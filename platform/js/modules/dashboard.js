function buildUnitsGrid(){
  const grid=document.getElementById('units-grid');
  grid.innerHTML=UNITS.map(u=>{
    const done=state.completedUnits.includes(u.id);
    const qpassed=state.passedQuizzes.includes(u.id);
    const pct=((done?1:0)+(qpassed?1:0))*50;
    const status=done&&qpassed?'✓ Completed':done||qpassed?'In Progress':'Not Started';
    const statusClass=done&&qpassed?'done':done||qpassed?'inprogress':'locked';
    return`<div class="ucard ${done&&qpassed?'completed':''}" onclick="showUnit(${u.id})">
      <div class="ucard-head">
        <div class="unit-num">${u.icon} Unit ${u.id}</div>
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

function updateDashStats(){
  document.getElementById('dash-completed').textContent=`${state.completedUnits.length}/6`;
  document.getElementById('dash-quizzes').textContent=`${state.passedQuizzes.length}/6`;
  document.getElementById('dash-xp').textContent=state.xp;
  const allDone=state.completedUnits.length===6&&state.passedQuizzes.length===6;
  document.getElementById('dash-cert').textContent=allDone?'Ready 🏆':'Not Ready';
  buildUnitsGrid();
}