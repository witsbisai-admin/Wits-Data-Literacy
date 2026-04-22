function buildUnitsGrid() {
  const grid = document.getElementById('units-grid');
  
  grid.innerHTML = UNITS.map(u => {
    const uid = u.id;
    
    // Check if the entire unit is officially complete
    const isDone = state.completedUnits.includes(uid);
    
    // Check if any part of the unit has been started
    const hasViewedContent = state.viewedSections[uid] && state.viewedSections[uid].length > 0;
    const hasStartedLab = (state.labTasks && state.labTasks[uid] && state.labTasks[uid].length > 0) || (state.completedLabs || []).includes(uid);
    const hasStartedQuiz = (state.quizProgress && state.quizProgress[uid]) || (state.passedQuizzes || []).includes(uid);
    
    const inProgress = !isDone && (hasViewedContent || hasStartedLab || hasStartedQuiz);

    // Calculate a smoother percentage for the card's progress bar
    let pct = 0;
    if (isDone) {
        pct = 100;
    } else {
        const contentPct = state.viewedSections[uid] ? (state.viewedSections[uid].length / u.sections.length) * 33.3 : 0;
        const labPct = (state.completedLabs || []).includes(uid) ? 33.3 : 0;
        const quizPct = (state.passedQuizzes || []).includes(uid) ? 33.4 : 0;
        pct = Math.min(100, Math.round(contentPct + labPct + quizPct));
    }

    const status = isDone ? '✓ Completed' : (inProgress ? 'In Progress' : 'Not Started');
    const statusClass = isDone ? 'done' : (inProgress ? 'inprogress' : 'locked');

    return `<div class="ucard ${isDone ? 'completed' : ''}" onclick="showUnit(${uid})">
      <div class="ucard-head">
        <div class="unit-num">${u.icon} Unit ${uid}</div>
        <div class="unit-status ${statusClass}">${status}</div>
      </div>
      <h3>${u.title}</h3>
      <p>${u.tagline}</p>
      <div class="ucard-meta">
        <div class="umeta-item">⏱ ${u.hours}</div>
        <div class="umeta-item">📚 ${u.topics} topics</div>
        <div class="umeta-item">📝 ${u.quizCount} Qs</div>
      </div>
      <div class="ucard-prog"><div class="ucard-prog-inner" style="width:${pct}%"></div></div>
    </div>`;
  }).join('');
}

function updateDashStats() {
  document.getElementById('dash-completed').textContent = `${state.completedUnits.length}/6`;
  document.getElementById('dash-quizzes').textContent = `${state.passedQuizzes.length}/6`;
  document.getElementById('dash-xp').textContent = state.xp;
  
  const allDone = state.completedUnits.length === 6 && state.passedQuizzes.length === 6;
  document.getElementById('dash-cert').textContent = allDone ? 'Ready 🏆' : 'Not Ready';
  
  buildUnitsGrid();
}