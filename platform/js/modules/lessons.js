/**
 * Handles switching the view to a specific learning unit
 */
function showUnit(n) {
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
  * Renders the HTML for the unit, including interactive labs and quizzes
  */
function renderUnit(unit) {
    const isDone = state.completedUnits.includes(unit.id);
    const quizPassed = state.passedQuizzes.includes(unit.id);
  
    // 1. Build the lesson content sections
    let sectionsHtml = unit.sections.map((s, i) => `
      <div class="section-card" id="sec-${unit.id}-${i}">
        <h2>${s.title}</h2>
        ${s.content}
      </div>`).join('');
  
    // 2. Build the Interactive Lab (This replaces the old static lab)
    const interactiveLab = renderInteractiveLab(unit.id);
  
    // 3. Build the Quiz
    const quizHtml = buildQuizHtml(unit);
  
    // 4. Build the Table of Contents for the sidebar
    const tocHtml = unit.sections.map((s, i) => `
      <div class="toc-item" onclick="scrollToSection('sec-${unit.id}-${i}')" id="toc-${unit.id}-${i}">
        <div class="toc-dot"></div>${s.title}
      </div>`).join('');
  
    // 5. Inject everything into the DOM
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
        <div class="lesson-sidebar-panel">
          <div class="mini-widget">
            <div class="mw-title">Contents</div>
            ${tocHtml}
            <div class="toc-item" onclick="scrollToSection('ilab-${unit.id}')" style="margin-top:6px;border-top:1px solid var(--border);padding-top:8px">
              <div class="toc-dot" style="background:var(--green)"></div>🔬 Interactive Lab
            </div>
            <div class="toc-item" onclick="scrollToSection('quiz-${unit.id}')" style="margin-top:2px">
              <div class="toc-dot" style="background:var(--blue)"></div>📝 Unit Quiz
            </div>
          </div>
          
          <div class="mini-widget">
            <div class="mw-title">Unit Progress</div>
            <div style="font-size:12px;color:var(--text-mid);margin-bottom:6px">Content: <strong style="color:${isDone ? 'var(--green)' : 'var(--amber)'}">${isDone ? '✓ Done' : 'In Progress'}</strong></div>
            <div style="font-size:12px;color:var(--text-mid);margin-bottom:6px">Lab: <strong style="color:${labDone(unit.id) ? 'var(--green)' : 'var(--text-light)'}">${labDone(unit.id) ? '✓ Done' : 'Not complete'}</strong></div>
            <div style="font-size:12px;color:var(--text-mid);margin-bottom:10px">Quiz: <strong style="color:${quizPassed ? 'var(--green)' : 'var(--text-light)'}">${quizPassed ? '✓ Passed' : 'Not attempted'}</strong></div>
            
            <button class="next-btn" onclick="scrollToSection('ilab-${unit.id}')">🔬 Go to Lab</button>
            <button class="next-btn" style="margin-top:6px;background:var(--blue-mid)" onclick="scrollToSection('quiz-${unit.id}')">📝 Take Quiz</button>
            <button class="mark-done-btn ${isDone ? 'done' : ''}" onclick="markUnitDone(${unit.id})" id="mark-btn-${unit.id}" style="margin-top:6px">
              ${isDone ? '✓ Completed' : 'Mark as Complete'}
            </button>
          </div>
          
          ${unit.id < UNITS.length ? `
          <div class="mini-widget">
            <div class="mw-title">Next Up</div>
            <div style="font-size:12px;color:var(--text-mid);margin-bottom:10px">${UNITS[unit.id].icon} Unit ${unit.id+1}: ${UNITS[unit.id].title}</div>
            <button class="next-btn" onclick="showUnit(${unit.id+1})">Continue →</button>
          </div>` : ``}
          
        </div>
      </div>`;
  
    // Initialize the quiz state for this unit
    initQuiz(unit);
}