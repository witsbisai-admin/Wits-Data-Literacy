// /js/modules/quiz.js
let quizState = {};

// ─── INIT ────────────────────────────────────────────────────────────────────

function initQuiz(unit) {
  if (state.quizProgress && state.quizProgress[unit.id]) {
    quizState[unit.id] = state.quizProgress[unit.id];
  } else {
    quizState[unit.id] = { current: 0, selected: {}, answered: {}, submitted: false };
  }
}

// ─── BUILD HTML ──────────────────────────────────────────────────────────────

function buildQuizHtml(unit) {
  // initQuiz MUST be called before this — quizState[unit.id] must already exist
  var qs = quizState[unit.id] || { current: 0, selected: {}, answered: {}, submitted: false };
  var isSubmitted = qs.submitted;
  var current = qs.current || 0;
  var total = unit.quiz.length;

  var correct = 0;
  if (isSubmitted) {
    unit.quiz.forEach(function(q, qi) {
      if (qs.answered[qi] === q.ans) correct++;
    });
  }
  var score = correct;
  var pct = Math.round((score / total) * 100);
  var passed = pct >= 70;
  var attempts = (state.quizAttempts && state.quizAttempts[unit.id]) || 0;

  var qHtml = unit.quiz.map(function(q, qi) {
    var isActive = qi === current;
    var blockStyle = isSubmitted ? 'display:none;' : (isActive ? '' : 'display:none;');
    var opts = q.opts.map(function(opt, oi) {
      var isSelected = qs.selected[qi] === oi;
      return '<div class="option ' + (isSelected ? 'selected' : '') + '"'
        + ' onclick="selectOption(' + unit.id + ',' + qi + ',' + oi + ')"'
        + ' id="opt-' + unit.id + '-' + qi + '-' + oi + '">'
        + '<div class="option-key">' + String.fromCharCode(65 + oi) + '</div>'
        + '<div class="option-text">' + opt + '</div>'
        + '</div>';
    }).join('');
    return '<div class="question-block ' + (isActive && !isSubmitted ? 'active' : '') + '"'
      + ' id="q-' + unit.id + '-' + qi + '"'
      + ' style="' + blockStyle + '">'
      + '<div class="q-num">Question ' + (qi + 1) + ' of ' + total + '</div>'
      + '<div class="q-text">' + q.q + '</div>'
      + '<div class="options">' + opts + '</div>'
      + '</div>';
  }).join('');

  var resultHtml = '';
  if (isSubmitted) {
    var circleClass = 'result-circle ' + (passed ? 'pass' : 'fail');
    var titleText = passed ? '🎉 Well Done!' : '📚 Keep Going!';
    var msgText = passed
      ? 'You passed Unit ' + unit.id + ' and earned 100 XP!'
      : 'You need 70% to pass. Review the content and try again.';
    resultHtml = '<div class="' + circleClass + '">'
      + '<div class="score">' + pct + '%</div>'
      + '<div class="total">' + score + '/' + total + '</div>'
      + '</div>'
      + '<div class="result-title">' + titleText + '</div>'
      + '<div style="font-size:11px;color:var(--text-light);margin-bottom:8px;">Attempt ' + attempts + '</div>'
      + '<div class="result-msg">' + msgText + '</div>'
      + '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:12px;">'
      + '<button class="retry-btn" onclick="retryQuiz(' + unit.id + ')">Retry Quiz</button>'
      + '</div>';
  }

  var isLast = current === total - 1;
  var navStyle = isSubmitted ? 'display:none;' : 'display:flex;';
  var progStyle = isSubmitted ? 'display:none;' : '';
  var resultStyle = isSubmitted ? 'display:block;' : 'display:none;';
  var progWidth = (((current + 1) / total) * 100) + '%';
  var nextBtnClass = 'qbtn ' + (isLast ? 'qbtn-submit' : 'qbtn-next');
  var nextBtnText = isLast ? 'Submit Quiz' : 'Next';

  return '<div class="quiz-container" id="quiz-' + unit.id + '">'
    + '<div class="quiz-header">'
    + '<div>'
    + '<h2>Unit ' + unit.id + ' Knowledge Check</h2>'
    + '<p>Answer all questions - Minimum 70% to pass</p>'
    + '</div>'
    + '<div class="quiz-progress-wrap" style="' + progStyle + '">'
    + '<div class="quiz-q-count" id="qcount-' + unit.id + '">Q' + (current + 1) + ' / ' + total + '</div>'
    + '<div class="quiz-prog-bar">'
    + '<div class="quiz-prog-fill" id="qprog-' + unit.id + '" style="width:' + progWidth + '"></div>'
    + '</div>'
    + '</div>'
    + '</div>'
    + '<div class="quiz-body">'
    + qHtml
    + '<div class="quiz-result" id="result-' + unit.id + '" style="' + resultStyle + '">'
    + resultHtml
    + '</div>'
    + '</div>'
    + '<div class="quiz-nav" id="qnav-' + unit.id + '" style="' + navStyle + '">'
    + '<button class="qbtn qbtn-prev" id="qprev-' + unit.id + '"'
    + ' onclick="quizNav(' + unit.id + ',-1)"'
    + (current === 0 ? ' disabled' : '') + '>Prev</button>'
    + '<button class="' + nextBtnClass + '" id="qnext-' + unit.id + '"'
    + ' onclick="quizNav(' + unit.id + ',1)">' + nextBtnText + '</button>'
    + '</div>'
    + '</div>';
}

// ─── SELECT OPTION ───────────────────────────────────────────────────────────

async function selectOption(uid, qi, oi) {
  var qs = quizState[uid];
  if (!qs || qs.submitted) return;

  qs.selected[qi] = oi;
  qs.answered[qi] = oi;

  document.querySelectorAll('#q-' + uid + '-' + qi + ' .option').forEach(function(el, i) {
    el.classList.toggle('selected', i === oi);
  });

  var quizStatusEl = document.getElementById('status-quiz-' + uid);
  if (quizStatusEl && !(state.passedQuizzes || []).includes(uid)) {
    quizStatusEl.textContent = 'In Progress';
    quizStatusEl.style.color = 'var(--amber)';
  }

  if (!state.quizProgress) state.quizProgress = {};
  state.quizProgress[uid] = qs;
  await saveState();

  // FIX: Update global sidebar to show "◐" in-progress icon
  if (typeof buildNavBadges === 'function') buildNavBadges();
}

// ─── NAVIGATION ──────────────────────────────────────────────────────────────

function quizNav(uid, dir) {
  var unit = UNITS[uid - 1];
  var qs = quizState[uid];
  var total = unit.quiz.length;

  if (!qs) return;

  if (dir === 1 && qs.selected[qs.current] === undefined && !qs.submitted) {
    showToast('Please select an answer to continue!');
    return;
  }

  if (dir === 1 && qs.current === total - 1 && !qs.submitted) {
    var allAnswered = Object.keys(qs.answered).length === total;
    if (!allAnswered) {
      showToast('Please answer all questions first!');
      return;
    }
    submitQuiz(uid);
    return;
  }

  qs.current = Math.max(0, Math.min(total - 1, qs.current + dir));

  document.querySelectorAll('[id^="q-' + uid + '-"]').forEach(function(el) {
    el.classList.remove('active');
    el.style.display = 'none';
  });
  var currentQ = document.getElementById('q-' + uid + '-' + qs.current);
  if (currentQ) {
    currentQ.style.display = '';
    currentQ.classList.add('active');
  }

  var qcount = document.getElementById('qcount-' + uid);
  if (qcount) qcount.textContent = 'Q' + (qs.current + 1) + ' / ' + total;

  var qprog = document.getElementById('qprog-' + uid);
  if (qprog) qprog.style.width = (((qs.current + 1) / total) * 100) + '%';

  var prevBtn = document.getElementById('qprev-' + uid);
  if (prevBtn) prevBtn.disabled = (qs.current === 0);

  var isLast = qs.current === total - 1;
  var nextBtn = document.getElementById('qnext-' + uid);
  if (nextBtn) {
    nextBtn.textContent = isLast ? 'Submit Quiz' : 'Next';
    nextBtn.className = 'qbtn ' + (isLast ? 'qbtn-submit' : 'qbtn-next');
  }
}

// ─── SUBMIT ──────────────────────────────────────────────────────────────────

async function submitQuiz(uid) {
  var unit = UNITS[uid - 1];
  var qs = quizState[uid];
  if (!qs || qs.submitted) return;

  var correct = 0;
  unit.quiz.forEach(function(q, qi) {
    if (qs.answered[qi] === q.ans) correct++;
  });
  var total = unit.quiz.length;
  var pct = Math.round((correct / total) * 100);
  var passed = pct >= 70;

  // Mark submitted and store score BEFORE rebuilding HTML
  qs.submitted = true;
  qs.score = pct;

  if (!state.quizAttempts) state.quizAttempts = {};
  state.quizAttempts[uid] = (state.quizAttempts[uid] || 0) + 1;

  if (!state.quizProgress) state.quizProgress = {};
  state.quizProgress[uid] = qs;

  if (passed) {
    if (!state.passedQuizzes) state.passedQuizzes = [];
    if (!state.passedQuizzes.includes(uid)) {
      state.passedQuizzes.push(uid);
      state.xp = (state.xp || 0) + 100;
    }
  }

  await saveState();

  // Rebuild quiz container in place using updated state — no full page re-render
  var quizContainer = document.getElementById('quiz-' + uid);
  if (quizContainer) {
    var tempDiv = document.createElement('div');
    tempDiv.innerHTML = buildQuizHtml(unit);
    quizContainer.parentNode.replaceChild(tempDiv.firstChild, quizContainer);
  }

  // Update sidebar
  var quizStatusEl = document.getElementById('status-quiz-' + uid);
  if (quizStatusEl) {
    if (passed) {
      quizStatusEl.textContent = '✓ Passed';
      quizStatusEl.style.color = 'var(--green)';
    } else {
      quizStatusEl.textContent = 'Failed - Retry';
      quizStatusEl.style.color = 'var(--red, #e74c3c)';
    }
  }

  if (passed) {
    if (typeof updateProgress === 'function') updateProgress();
    if (typeof buildNavBadges === 'function') buildNavBadges();
    if (typeof updateDashStats === 'function') updateDashStats();
    var xpEl = document.getElementById('total-xp');
    if (xpEl) xpEl.textContent = state.xp + ' XP';
    showToast('You passed! +100 XP 🎉');
  } else {
    showToast('Score: ' + pct + '%. You need 70% to pass. Try again!');
  }

  if (typeof checkUnitReady === 'function') checkUnitReady(uid);
}

// ─── RETRY ───────────────────────────────────────────────────────────────────

async function retryQuiz(uid) {
  var unit = UNITS[uid - 1];

  // Reset state FIRST — buildQuizHtml will read this clean state
  quizState[uid] = { current: 0, selected: {}, answered: {}, submitted: false };
  if (state.quizProgress) delete state.quizProgress[uid];
  await saveState();

  // Rebuild just the quiz container in place — no full page re-render needed
  var quizContainer = document.getElementById('quiz-' + uid);
  if (quizContainer) {
    var tempDiv = document.createElement('div');
    tempDiv.innerHTML = buildQuizHtml(unit);
    quizContainer.parentNode.replaceChild(tempDiv.firstChild, quizContainer);
  } else {
    renderUnit(unit);
  }
  
  // NEW: Reset the sidebar status text visually
  var quizStatusEl = document.getElementById('status-quiz-' + uid);
  if (quizStatusEl) {
    quizStatusEl.textContent = 'Not Started';
    quizStatusEl.style.color = 'var(--text-light)';
  }

  scrollToSection('quiz-' + uid);
}

// ─── MARK UNIT DONE ──────────────────────────────────────────────────────────

async function markUnitDone(uid) {
  if (!state.completedUnits.includes(uid)) {
    state.completedUnits.push(uid);
    state.xp += 50;
    await saveState();

    if (typeof updateProgress === 'function') updateProgress();
    if (typeof buildNavBadges === 'function') buildNavBadges();
    if (typeof updateDashStats === 'function') updateDashStats();

    var btn = document.getElementById('mark-btn-' + uid);
    if (btn) {
      btn.textContent = '✓ Completed';
      btn.classList.add('done');
    }
    var xpEl = document.getElementById('total-xp');
    if (xpEl) xpEl.textContent = state.xp + ' XP';

    var balloon = document.createElement('div');
    balloon.innerHTML = '🎉🎓🏆';
    balloon.style.cssText = 'position:fixed;bottom:-50px;left:50%;transform:translateX(-50%);font-size:60px;z-index:9999;transition:all 2s ease-out;opacity:1;';
    document.body.appendChild(balloon);
    requestAnimationFrame(function() {
      balloon.style.bottom = '100%';
      balloon.style.opacity = '0';
      balloon.style.transform = 'translateX(-50%) rotate(15deg) scale(1.5)';
    });
    setTimeout(function() { balloon.remove(); }, 2000);

    if (typeof showSuccessModal === 'function') {
      showSuccessModal('Fantastic! You have fully completed Unit ' + uid + '.');
    } else {
      showToast('Unit ' + uid + ' complete! +50 XP');
    }
  }
}