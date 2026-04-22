/**
 * Handles switching the view to a specific learning unit
 */
function showUnit(n) {
    const screenWidth = window.innerWidth;
    if(screenWidth <= 1024){
      document.getElementById("bc-hamburger-id").style.display = "block";
      document.getElementById("bc-close-id").style.display = "none";
      document.getElementById("sidebar-id").style.display = "none";
    }
    state.currentUnit = n;
    const unit = UNITS[n-1];
    
    // Render the unit content
    renderUnit(unit);
    
    // Update UI to show the unit view
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById('view-unit').classList.add('active');
    document.getElementById('bc-current').textContent = `Unit ${n}: ${unit.title}`;
    
    // Update sidebar active state
    document.querySelectorAll('.nav-item').forEach(ni => ni.classList.remove('active'));
    document.getElementById('nav-u'+n).classList.add('active');
    
    // Scroll to the top
    window.scrollTo(0,0);
}
 
/**
 * Initializes observers to track if a user reads the content sections
 */
const readingTimeouts = {}; // Store timeouts to delay reading


function initContentObserver(unitId) {
  const options = { threshold: 0.6 }; 
  
  const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          const sectionIdx = parseInt(entry.target.dataset.index);
          const key = `${unitId}-${sectionIdx}`;

          if (entry.isIntersecting) {
              // Start a 3-second timer before marking as read
              if (!readingTimeouts[key]) {
                  readingTimeouts[key] = setTimeout(() => {
                      markSectionAsViewed(unitId, sectionIdx);
                  }, 3000); 
              }
          } else {
              // If they scroll away too fast, cancel the timer
              clearTimeout(readingTimeouts[key]);
              delete readingTimeouts[key];
          }
      });
  }, options);

  document.querySelectorAll('.section-card').forEach((card) => {
      observer.observe(card);
  });
}

function markSectionAsViewed(unitId, index) {
  if (!state.viewedSections[unitId]) state.viewedSections[unitId] = [];
  
  if (!state.viewedSections[unitId].includes(index)) {
      state.viewedSections[unitId].push(index);
      saveState(); 
  }

  // Smooth Fade-In UI Feedback
  const badge = document.getElementById(`badge-${unitId}-${index}`);
  if (badge && badge.style.display === 'none') {
      badge.style.display = 'inline-block';
      badge.classList.add('animate-in'); // Uses your existing fade-up CSS
  }

  const tocItem = document.getElementById(`toc-${unitId}-${index}`);
  if (tocItem) {
      const dot = tocItem.querySelector('.toc-dot');
      if (dot) {
          dot.style.background = 'var(--green)';
          dot.innerHTML = '<i class="fa-solid fa-check" style="color:white; font-size:6px; display:flex; align-items:center; justify-content:center; height:100%;"></i>';
          dot.style.width = '12px';
          dot.style.height = '12px';
          dot.classList.add('animate-in');
      }
  }
  
  // Real-time update Content Status in Sidebar
  const contentStatusEl = document.getElementById(`status-content-${unitId}`);
  const unit = UNITS[unitId - 1];
  if (contentStatusEl && state.viewedSections[unitId].length >= unit.sections.length) {
      contentStatusEl.innerHTML = '✓ Done';
      contentStatusEl.style.color = 'var(--green)';
  } else if (contentStatusEl) {
      contentStatusEl.innerHTML = 'In Progress';
      contentStatusEl.style.color = 'var(--amber)';
  }

  checkUnitReady(unitId); 
  // FIX: Update global sidebar immediately when content is read
  if (typeof buildNavBadges === 'function') buildNavBadges();
}

function checkUnitReady(uid) {
  const unit = UNITS[uid - 1];
  const totalSections = unit.sections.length;
  const viewedCount = (state.viewedSections[uid] || []).length;
  const isLabDone = (state.completedLabs || []).includes(uid);
  const isQuizPassed = (state.passedQuizzes || []).includes(uid); // NEW: 3rd Argument
  
  const btn = document.getElementById(`mark-btn-${uid}`);
  if (!btn || state.completedUnits.includes(uid)) return;

  // ALL 3 REQUIREMENTS MUST BE MET
  if (viewedCount >= totalSections && isLabDone && isQuizPassed) {
      btn.disabled = false;
      btn.innerHTML = '🏁 Mark Unit as Complete';
      btn.style.opacity = '1';
      btn.classList.add('animate-in');
      btn.classList.remove('locked');
  } else {
      btn.disabled = true;
      btn.style.opacity = '0.5';
      
      let reason = [];
      if (viewedCount < totalSections) reason.push(`Read (${viewedCount}/${totalSections})`);
      if (!isLabDone) reason.push(`Finish Lab`);
      if (!isQuizPassed) reason.push(`Pass Quiz`);
      
      btn.innerHTML = `🔒 ${reason.join(' & ')} to Unlock`;
  }
}


function updateCompletionUI(uid) {
  const unit = UNITS[uid - 1];
  const viewedCount = (state.viewedSections[uid] || []).length;
  const totalSections = unit.sections.length;
  const isLabDone = (state.completedLabs || []).includes(uid);
  const btn = document.getElementById(`mark-btn-${uid}`);

  if (!btn || state.completedUnits.includes(uid)) return;

  if (viewedCount >= totalSections && isLabDone) {
      btn.disabled = false;
      btn.classList.remove('locked');
      btn.innerHTML = '✓ Mark Unit Complete';
  } else {
      btn.disabled = true;
      btn.style.opacity = '0.5';
      btn.innerHTML = `🔒 Read Content & Finish Lab to Unlock`;
  }
}

/**
  * Renders the HTML for the unit, including interactive labs, quizzes, and mobile navigation
  */
function renderUnit(unit) {
  const isDone = state.completedUnits.includes(unit.id);
  const quizPassed = state.passedQuizzes.includes(unit.id);
  const viewed = state.viewedSections[unit.id] || [];

  // 1. Build Content HTML
  let sectionsHtml = unit.sections.map((s, i) => `
    <div class="section-card" id="sec-${unit.id}-${i}" data-index="${i}">
      <h2>${s.title} <span class="read-badge" id="badge-${unit.id}-${i}" style="display:${viewed.includes(i) ? 'inline-block' : 'none'}; font-size:10px; background:var(--green); color:white; padding:3px 8px; border-radius:12px; vertical-align:middle; margin-left:10px; font-family:'Sora', sans-serif; letter-spacing: 0.05em;">✓ Read</span></h2>
      ${s.content}
    </div>`).join('');

  // 2. Build Lab & Quiz HTML
  const interactiveLab = renderInteractiveLab(unit.id);
  initQuiz(unit);
  const quizHtml = buildQuizHtml(unit);

  // 3. Build Table of Contents
  const tocHtml = unit.sections.map((s, i) => {
    const isViewed = viewed.includes(i);
    const dotStyle = isViewed ? 'background:var(--green); width:12px; height:12px;' : '';
    const dotContent = isViewed ? '<i class="fa-solid fa-check" style="color:white; font-size:6px; display:flex; align-items:center; justify-content:center; height:100%;"></i>' : '';
    return `
    <div class="toc-item" onclick="scrollToSection('sec-${unit.id}-${i}'); document.getElementById('mobile-toc-panel').classList.remove('show');" id="toc-${unit.id}-${i}">
      <div class="toc-dot" style="${dotStyle}">${dotContent}</div>${s.title}
    </div>`;
  }).join('');

  // 4. Sidebar Status Logic
  const contentStatusText = (viewed.length >= unit.sections.length) ? '✓ Done' : (viewed.length > 0 ? 'In Progress' : 'Not Started');
  const contentStatusColor = contentStatusText.includes('✓') ? 'var(--green)' : (contentStatusText === 'Not Started' ? 'var(--text-light)' : 'var(--amber)');
  
  let quizStatusText = 'Not Started';
  let quizStatusColor = 'var(--text-light)';
  
  if (quizPassed) {
      quizStatusText = '✓ Passed';
      quizStatusColor = 'var(--green)';
  } else if (state.quizProgress && state.quizProgress[unit.id]) {
      if (state.quizProgress[unit.id].submitted) {
          quizStatusText = 'Failed - Retry';
          quizStatusColor = 'var(--red)';
      } else if (Object.keys(state.quizProgress[unit.id].answered || {}).length > 0) {
          quizStatusText = 'In Progress';
          quizStatusColor = 'var(--amber)';
      }
  }

  // 5. Final DOM Injection
  document.getElementById('view-unit').innerHTML = `
    <div class="lesson-layout animate-in">
      <div class="lesson-main">
        <div class="lesson-header">
          <div class="lesson-tag">Unit ${unit.id} of ${UNITS.length} · ${unit.hours} · ${unit.topics} Topics · ${unit.quizCount}-Question Quiz</div>
          <h1>${unit.title}</h1>
          <p>${unit.tagline}</p>
          <div class="lesson-meta-row">
            ${unit.outcomes.map(o => `<div class="lmeta"><span>✓</span>${o}</div>`).join('')}
          </div>
        </div>
        ${sectionsHtml}
        ${interactiveLab}
        ${quizHtml}
      </div>
      
      <div class="lesson-sidebar-panel" id="mobile-toc-panel">
        <button class="close-toc-btn" onclick="document.getElementById('mobile-toc-panel').classList.remove('show')">↓ Close Menu</button>

        <div class="mini-widget">
          <div class="mw-title">Contents</div>
          ${tocHtml}
          <div class="toc-item" onclick="scrollToSection('ilab-${unit.id}'); document.getElementById('mobile-toc-panel').classList.remove('show');" style="margin-top:6px;border-top:1px solid var(--border);padding-top:8px">
            <div class="toc-dot" style="background:var(--green)"></div>🔬 Interactive Lab
          </div>
          <div class="toc-item" onclick="scrollToSection('quiz-${unit.id}'); document.getElementById('mobile-toc-panel').classList.remove('show');" style="margin-top:2px">
            <div class="toc-dot" style="background:var(--blue)"></div>📝 Unit Quiz
          </div>
        </div>
        
        <div class="mini-widget">
          <div class="mw-title">Unit Progress</div>
          <div style="font-size:12px;color:var(--text-mid);margin-bottom:6px">Content: <strong id="status-content-${unit.id}" style="color:${contentStatusColor}">${contentStatusText}</strong></div>
          <div style="font-size:12px;color:var(--text-mid);margin-bottom:6px">Lab: <strong id="status-lab-${unit.id}" style="color:${labDone(unit.id) ? 'var(--green)' : 'var(--text-light)'}">${labDone(unit.id) ? '✓ Done' : 'Not Started'}</strong></div>
          <div style="font-size:12px;color:var(--text-mid);margin-bottom:10px">Quiz: <strong id="status-quiz-${unit.id}" style="color:${quizStatusColor}">${quizStatusText}</strong></div>
          
          <button class="next-btn" onclick="scrollToSection('ilab-${unit.id}'); document.getElementById('mobile-toc-panel').classList.remove('show');">🔬 Go to Lab</button>
          <button class="next-btn" style="margin-top:6px;background:var(--blue-mid)" onclick="scrollToSection('quiz-${unit.id}'); document.getElementById('mobile-toc-panel').classList.remove('show');">📝 Take Quiz</button>
          <button class="mark-done-btn ${isDone ? 'done' : ''}" onclick="markUnitDone(${unit.id})" id="mark-btn-${unit.id}" style="margin-top:6px" ${isDone ? '' : 'disabled'}>
            ${isDone ? '✓ Completed' : '🔒 Read & Lab Required'}
          </button>
        </div>
      </div>
      
      <button class="mobile-toc-btn" onclick="document.getElementById('mobile-toc-panel').classList.add('show')">
        📖 Unit Menu
      </button>

    </div>`;

  initContentObserver(unit.id); 
  checkUnitReady(unit.id);
  if(typeof checkLabReady === 'function') checkLabReady(unit.id);
}