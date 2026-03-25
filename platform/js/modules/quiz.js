// /js/modules/quiz.js

// CRITICAL: This state object tracks quiz progress. If missing, units will not load!
let quizState = {};

function initQuiz(unit){
  quizState[unit.id] = {current:0, selected:{}, answered:{}, submitted:false};
}

function buildQuizHtml(unit){
  const qHtml = unit.quiz.map((q,qi)=>`
    <div class="question-block ${qi===0?'active':''}" id="q-${unit.id}-${qi}">
      <div class="q-num">Question ${qi+1} of ${unit.quiz.length}</div>
      <div class="q-text">${q.q}</div>
      <div class="options">
        ${q.opts.map((opt,oi)=>`
          <div class="option" onclick="selectOption(${unit.id},${qi},${oi})" id="opt-${unit.id}-${qi}-${oi}">
            <div class="option-key">${String.fromCharCode(65+oi)}</div>
            <div class="option-text">${opt}</div>
          </div>`).join('')}
      </div>
      <div class="explanation" id="exp-${unit.id}-${qi}">
        <strong>Explanation</strong>
        <p>${q.exp}</p>
      </div>
    </div>`).join('');

  return `
    <div class="quiz-container" id="quiz-${unit.id}">
      <div class="quiz-header">
        <div>
          <h2>Unit ${unit.id} Knowledge Check</h2>
          <p>Answer all questions · Minimum 70% to pass · Answers explained</p>
        </div>
        <div class="quiz-progress-wrap">
          <div class="quiz-q-count" id="qcount-${unit.id}">Q1 / ${unit.quiz.length}</div>
          <div class="quiz-prog-bar"><div class="quiz-prog-fill" id="qprog-${unit.id}" style="width:${100/unit.quiz.length}%"></div></div>
        </div>
      </div>
      <div class="quiz-body">${qHtml}
        <div class="quiz-result" id="result-${unit.id}"></div>
      </div>
      <div class="quiz-nav" id="qnav-${unit.id}">
        <button class="qbtn qbtn-prev" id="qprev-${unit.id}" onclick="quizNav(${unit.id},-1)" disabled>← Prev</button>
        <button class="qbtn qbtn-next" id="qnext-${unit.id}" onclick="quizNav(${unit.id},1)">Next →</button>
      </div>
    </div>`;
}

function selectOption(uid,qi,oi){
  const qs=quizState[uid];
  if(qs.submitted||qs.answered[qi]) return;
  qs.selected[qi]=oi;
  document.querySelectorAll(`#q-${uid}-${qi} .option`).forEach((o,i)=>{
    o.classList.toggle('selected',i===oi);
  });
}

function quizNav(uid,dir){
  const unit=UNITS[uid-1];
  const qs=quizState[uid];
  const total=unit.quiz.length;

  if(dir===1 && qs.selected[qs.current]===undefined && !qs.answered[qs.current] && !qs.submitted){
    showToast('Please select an answer first!'); return;
  }

  if(dir===1 && !qs.answered[qs.current] && !qs.submitted){
    checkAnswer(uid,qs.current);
  }

  if(qs.current+dir >= total && dir===1 && !qs.submitted){
    const allAnswered = Object.keys(qs.answered).length === total;
    if(!allAnswered){showToast('Please answer all questions first!');return;}
    submitQuiz(uid);
    return;
  }

  qs.current = Math.max(0, Math.min(total-1, qs.current+dir));
  document.querySelectorAll(`[id^="q-${uid}-"]`).forEach(q=>q.classList.remove('active'));
  document.getElementById(`q-${uid}-${qs.current}`)?.classList.add('active');
  document.getElementById(`qcount-${uid}`).textContent=`Q${qs.current+1} / ${total}`;
  document.getElementById(`qprog-${uid}`).style.width=`${((qs.current+1)/total)*100}%`;
  document.getElementById(`qprev-${uid}`).disabled=(qs.current===0);
  
  const isLast=(qs.current===total-1);
  const nextBtn=document.getElementById(`qnext-${uid}`);
  if(isLast && Object.keys(qs.answered).length===total-1){
    nextBtn.textContent='Submit Quiz';nextBtn.className='qbtn qbtn-submit';
  } else {
    nextBtn.textContent='Next →';nextBtn.className='qbtn qbtn-next';
  }
}

function checkAnswer(uid,qi){
  const unit=UNITS[uid-1];
  const qs=quizState[uid];
  const correct=unit.quiz[qi].ans;
  const sel=qs.selected[qi];
  if(sel===undefined) return;
  
  qs.answered[qi]=sel;
  document.querySelectorAll(`#q-${uid}-${qi} .option`).forEach((o,i)=>{
    if(i===correct) o.classList.add('correct');
    else if(i===sel && i!==correct) o.classList.add('wrong');
    o.style.pointerEvents='none';
  });
  document.getElementById(`exp-${uid}-${qi}`).classList.add('show');
}

async function submitQuiz(uid){
  const unit=UNITS[uid-1];
  const qs=quizState[uid];
  qs.submitted=true;
  
  let correct=0;
  unit.quiz.forEach((q,qi)=>{if(qs.answered[qi]===q.ans)correct++;});
  const score=correct;
  const total=unit.quiz.length;
  const pct=Math.round((score/total)*100);
  const passed=pct>=70;

  if(passed && !state.passedQuizzes.includes(uid)){
    state.passedQuizzes.push(uid);
    state.xp+=100;
    state.quizScores[uid]=score;
    await saveState();
    buildNavBadges();
    updateProgress();
  } else if(!state.quizScores[uid]){
    state.quizScores[uid]=score;
    await saveState();
  }

  document.getElementById(`qnav-${uid}`).innerHTML='';
  document.querySelectorAll(`[id^="q-${uid}-"]`).forEach(q=>q.style.display='none');

  const resultEl=document.getElementById(`result-${uid}`);
  resultEl.style.display='block';
  resultEl.innerHTML=`
    <div class="result-circle ${passed?'pass':'fail'}">
      <div class="score">${pct}%</div>
      <div class="total">${score}/${total}</div>
    </div>
    <div class="result-title">${passed?'🎉 Well Done!':'📚 Keep Going!'}</div>
    <div class="result-msg">${passed?`You scored ${score}/${total} (${pct}%). You have passed Unit ${uid} quiz and earned 100 XP!`:`You scored ${score}/${total} (${pct}%). You need 70% to pass. Review the content and try again.`}</div>
    <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
      ${!passed?`<button class="retry-btn" onclick="retryQuiz(${uid})">Retry Quiz</button>`:''}
      <button class="retry-btn" style="background:var(--gold);color:var(--navy)" onclick="markUnitDone(${uid})">Mark Unit Complete</button>
      ${uid<UNITS.length?`<button class="retry-btn" style="background:var(--green)" onclick="showUnit(${uid+1})">Next Unit →</button>`:''}
    </div>`;

  updateDashStats();
  document.getElementById('total-xp').textContent=`${state.xp} XP`;
}

function retryQuiz(uid){
  const unit=UNITS[uid-1];
  quizState[uid]={current:0,selected:{},answered:{},submitted:false};
  renderUnit(unit);
  scrollToSection(`quiz-${uid}`);
}

async function markUnitDone(uid){
  if(!state.completedUnits.includes(uid)){
    state.completedUnits.push(uid);
    state.xp+=50;
    await saveState();
    showToast(`Unit ${uid} marked complete! +50 XP`);
    updateProgress();
    buildNavBadges();
    updateDashStats();
    const btn=document.getElementById(`mark-btn-${uid}`);
    if(btn){btn.textContent='✓ Completed';btn.classList.add('done');}
    document.getElementById('total-xp').textContent=`${state.xp} XP`;
  }
}