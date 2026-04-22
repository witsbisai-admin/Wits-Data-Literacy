// ══════════════════════════════════════
// INTERACTIVE LAB RENDERER
// ══════════════════════════════════════
function renderInteractiveLab(uid){
    const labs = {
      1: buildLab1(),
      2: buildLab2(),
      3: buildLab3(),
      4: buildLab4(),
      5: buildLab5(),
      6: buildLab6()
    };
    return labs[uid] || '<p>Lab not available.</p>';
  }
  
  function labDone(uid){ return (state.completedLabs||[]).includes(uid); }
  
  async function completeLab(uid) {
    if (!state.completedLabs) state.completedLabs = [];
    if (!state.completedLabs.includes(uid)) {
      state.completedLabs.push(uid);
      state.xp += 75;
      await saveState();
  
      if (typeof checkUnitReady === 'function') {
        checkUnitReady(uid);
      }
  
      updateProgress();
      showToast(`Lab ${uid} completed! +75 XP 🔬`);
      
      // Update Lab UI inside the lab panel
      const badge = document.getElementById(`lab-done-badge-${uid}`);
      if(badge) { badge.textContent = '✓ Lab Complete'; badge.classList.add('completed'); }
      
      const btn = document.getElementById(`lab-complete-btn-${uid}`);
      if(btn) { btn.textContent = '✓ Lab Completed'; btn.disabled = true; }
      
      // FIX: Update the mini-widget lab status immediately
      const labStatusEl = document.getElementById(`status-lab-${uid}`);
      if (labStatusEl) {
          labStatusEl.textContent = '✓ Done';
          labStatusEl.style.color = 'var(--green)';
      }
  
      // FIX: Update the global sidebar navigation badges immediately
      if (typeof buildNavBadges === 'function') buildNavBadges();
  
      document.getElementById('total-xp').textContent = `${state.xp} XP`;
      updateDashStats();
    }
  }
  
  function triggerLabInProgress(uid) {
    const labStatusEl = document.getElementById(`status-lab-${uid}`);
    if (labStatusEl && !labDone(uid)) {
        labStatusEl.textContent = 'In Progress';
        labStatusEl.style.color = 'var(--amber)';
    }
    // FIX: Update global sidebar to show "◐" in-progress icon
    if (typeof buildNavBadges === 'function') buildNavBadges();
  }
  
  function switchLabTab(uid, tab){
    document.querySelectorAll(`#ilab-${uid} .ilab-tab`).forEach(t=>t.classList.remove('active'));
    document.querySelectorAll(`#ilab-${uid} .ilab-panel`).forEach(p=>p.classList.remove('active'));
    document.getElementById(`ltab-${uid}-${tab}`).classList.add('active');
    document.getElementById(`lpanel-${uid}-${tab}`).classList.add('active');
  }
  
  function tableRows(data, cols, rowClass){
    return data.map(r=>{
      const cls = rowClass ? rowClass(r) : '';
      return `<tr class="${cls}">${cols.map(c=>{
        let v=r[c]??'—';
        if(c==='RiskBand'){const m={LOW:'ari-low',MODERATE:'ari-mod',HIGH:'ari-high',CRITICAL:'ari-crit'};v=`<span class="ari-badge ${m[v]||''}">${v}</span>`;}
        if(c==='ARI_Score'){const sc=+v;v=`<span class="ari-badge ${sc<31?'ari-low':sc<56?'ari-mod':sc<76?'ari-high':'ari-crit'}">${v}</span>`;}
        if(c==='S1_Outcome'||c==='FinancialFlag'){v=`<span style="font-weight:600;color:${v==='Pass'||v==='Yes'?'var(--green)':'var(--red)'}">${v}</span>`;}
        return `<td>${v}</td>`;
      }).join('')}</tr>`;
    }).join('');
  }
  
  // ─── LAB 1: Data Quality Audit ────────
  function buildLab1(){
    const data = LAB_DATA.unit1;
    const cols = ['StudentID','Faculty','Programme','Gender','Race','HomeProvince','MatricNSC','Attendance','WPA','FinancialAid','ModulesFailed','LMS_Logins'];
    const nullCounts = {};
    cols.forEach(c=>{ nullCounts[c]=data.filter(r=>r[c]===null||r[c]===undefined).length; });
    const totalNulls = Object.values(nullCounts).reduce((a,b)=>a+b,0);
    const dups = data.filter((r,i)=>data.findIndex(x=>x.StudentID===r.StudentID)!==i).length;
  
    return `
    <div id="ilab-1" class="ilab-container">
      <div class="ilab-header">
        <div class="ilab-header-left">
          <div class="ilab-header-icon">🔬</div>
          <div><h3>Lab 1.1 — Data Quality Audit</h3><p>Analyse 30 first-year student records using the ACCURATE framework</p></div>
        </div>
        <div class="ilab-status">
          <span class="ilab-done-badge ${labDone(1)?'completed':''}" id="lab-done-badge-1">${labDone(1)?'✓ Lab Complete':'In Progress'}</span>
        </div>
      </div>
      <div class="ilab-tabs">
        <div class="ilab-tab active" id="ltab-1-data" onclick="switchLabTab(1,'data')">📊 Dataset (30 Records)</div>
        <div class="ilab-tab" id="ltab-1-audit" onclick="switchLabTab(1,'audit')">🔍 Audit Tasks</div>
        <div class="ilab-tab" id="ltab-1-scorecard" onclick="switchLabTab(1,'scorecard')">📋 ACCURATE Scorecard</div>
        <div class="ilab-tab" id="ltab-1-report" onclick="switchLabTab(1,'report')">📝 Report</div>
      </div>
  
      <div class="ilab-panel active" id="lpanel-1-data">
        <div class="dt-stats">
          <div class="dt-stat"><strong>30</strong>Total Records</div>
          <div class="dt-stat"><strong style="color:var(--red)">${totalNulls}</strong>Missing Values</div>
          <div class="dt-stat"><strong style="color:var(--amber)">${dups}</strong>Duplicate IDs</div>
          <div class="dt-stat"><strong>${cols.length}</strong>Variables</div>
        </div>
        <div class="dt-filter-bar">
          <input class="dt-filter" id="l1-search" placeholder="🔍 Filter by Faculty or Race..." oninput="filterLab1Table()" style="width:220px">
          <select class="dt-filter" id="l1-faculty" onchange="filterLab1Table()">
            <option value="">All Faculties</option>
            <option>Commerce</option><option>Engineering</option><option>Humanities</option><option>Science</option><option>Law</option>
          </select>
          <select class="dt-filter" id="l1-show-issues" onchange="filterLab1Table()">
            <option value="">All Records</option>
            <option value="issues">Show Issues Only</option>
          </select>
        </div>
        <div class="dt-container">
          <div class="dt-scroll">
            <table class="dt-table" id="l1-table">
              <thead><tr>${cols.map(c=>`<th>${c}</th>`).join('')}</tr></thead>
              <tbody id="l1-tbody">${buildLab1Rows(data,cols)}</tbody>
            </table>
          </div>
        </div>
        <p style="font-size:11px;color:var(--text-light);margin-top:8px">🔴 Red highlight = data quality issue detected. Use the Audit Tasks tab to complete your analysis.</p>
      </div>
  
      <div class="ilab-panel" id="lpanel-1-audit">
        <div class="task-list">
          <div class="task-item ${labTaskDone(1,0)?'completed-task':''}" id="l1t0">
            <div class="task-header">
              <div class="task-check" onclick="toggleLabTask(1,0)">✓</div>
              <div class="task-body">
                <div class="task-title">Task 1: Accuracy Check — Identify out-of-range values</div>
                <div class="task-desc">MatricNSC should be 0–42. Attendance should be 0–100. ModulesFailed should be ≥ 0. Identify ALL records with out-of-range values.</div>
                <textarea class="task-input" id="l1ta0" placeholder="List the StudentIDs with out-of-range values and which field is affected. e.g. '202300XX — MatricNSC = 55 (max is 42)'">${labTaskAnswer(1,0)}</textarea>
                <button class="task-btn" onclick="checkLab1Task(0)">Check Answer</button>
                <div class="task-feedback" id="l1tf0"></div>
              </div>
            </div>
          </div>
          <div class="task-item ${labTaskDone(1,1)?'completed-task':''}" id="l1t1">
            <div class="task-header">
              <div class="task-check" onclick="toggleLabTask(1,1)">✓</div>
              <div class="task-body">
                <div class="task-title">Task 2: Completeness — Count missing values per variable</div>
                <div class="task-desc">Which 3 variables have the highest number of missing (null) values? Rank them and state the percentage missing.</div>
                <textarea class="task-input" id="l1ta1" placeholder="1st: [Variable] — X missing (X%) &#10;2nd: [Variable] — X missing (X%) &#10;3rd: [Variable] — X missing (%)">${labTaskAnswer(1,1)}</textarea>
                <button class="task-btn" onclick="checkLab1Task(1)">Check Answer</button>
                <div class="task-feedback" id="l1tf1"></div>
              </div>
            </div>
          </div>
          <div class="task-item ${labTaskDone(1,2)?'completed-task':''}" id="l1t2">
            <div class="task-header">
              <div class="task-check" onclick="toggleLabTask(1,2)">✓</div>
              <div class="task-body">
                <div class="task-title">Task 3: Uniqueness — Find duplicate StudentIDs</div>
                <div class="task-desc">Look at the StudentID column. Which ID appears more than once? What are the implications for cohort size calculations?</div>
                <textarea class="task-input" id="l1ta2" placeholder="Duplicate ID found: &#10;Records affected: &#10;Impact on cohort size analysis: ">${labTaskAnswer(1,2)}</textarea>
                <button class="task-btn" onclick="checkLab1Task(2)">Check Answer</button>
                <div class="task-feedback" id="l1tf2"></div>
              </div>
            </div>
          </div>
          <div class="task-item ${labTaskDone(1,3)?'completed-task':''}" id="l1t3">
            <div class="task-header">
              <div class="task-check" onclick="toggleLabTask(1,3)">✓</div>
              <div class="task-body">
                <div class="task-title">Task 4: Overall Risk Assessment</div>
                <div class="task-desc">Based on your audit findings: Would you trust this dataset for building a student at-risk model? Give 2 reasons with evidence.</div>
                <textarea class="task-input" id="l1ta3" placeholder="Recommendation (trust/do not trust yet): &#10;Reason 1 (with evidence): &#10;Reason 2 (with evidence): ">${labTaskAnswer(1,3)}</textarea>
                <div class="task-check" onclick="toggleLabTask(1,3)" style="display:none"></div>
                <button class="task-btn" onclick="toggleLabTask(1,3);showToast('Reflection saved!')">Save Reflection</button>
              </div>
            </div>
          </div>
        </div>
        <button 
          class="lab-complete-btn" 
          id="lab-complete-btn-1" 
          onclick="completeLab(1)" 
          ${labDone(1) ? 'disabled' : 'disabled'}
        >
          ${labDone(1) ? '✓ Lab Completed' : '🏁 Complete All Tasks to Finish (+75 XP)'}
        </button>
      </div>
  
      <div class="ilab-panel" id="lpanel-1-scorecard">
        <p style="font-size:13px;color:var(--text-mid);margin-bottom:16px">Rate each ACCURATE dimension 1–5 based on your findings. Your ratings are saved automatically.</p>
        <div id="accurate-scorecard">${buildAccurateScorecard()}</div>
      </div>
  
      <div class="ilab-panel" id="lpanel-1-report">
        <p style="font-size:13px;color:var(--text-mid);margin-bottom:14px">Complete your Data Quality Audit Report. This will be auto-saved.</p>
        <div class="cf-group"><label style="font-size:12px;font-weight:600;color:var(--text-mid);display:block;margin-bottom:5px">Summary Finding (1–2 sentences)</label>
          <textarea class="task-input" id="report-summary" style="min-height:55px" placeholder="The FY2023 first-year dataset contains X critical quality issues..." oninput="autoSaveReport()">${getReportField('summary')}</textarea></div>
        <div class="cf-group"><label style="font-size:12px;font-weight:600;color:var(--text-mid);display:block;margin-bottom:5px">Top 3 Issues Identified</label>
          <textarea class="task-input" id="report-issues" style="min-height:80px" placeholder="1. ... &#10;2. ... &#10;3. ..." oninput="autoSaveReport()">${getReportField('issues')}</textarea></div>
        <div class="cf-group"><label style="font-size:12px;font-weight:600;color:var(--text-mid);display:block;margin-bottom:5px">Recommended Actions (with responsible party)</label>
          <textarea class="task-input" id="report-actions" style="min-height:80px" placeholder="1. Action — Responsible: &#10;2. Action — Responsible: &#10;3. Action — Responsible: " oninput="autoSaveReport()">${getReportField('actions')}</textarea></div>
        <div style="font-size:11px;color:var(--text-light);margin-top:6px">✓ Auto-saving to your account...</div>
      </div>
    </div>`;
  }
  
  function buildLab1Rows(data, cols){
    return data.map(r=>{
      const hasIssue = r.MatricNSC===null||r.MatricNSC>42||r.Attendance===null||r.Attendance>100||r.WPA===null||r.ModulesFailed<0||r.HomeProvince===null||r.LMS_Logins===null;
      return `<tr class="${hasIssue?'risk-high':''}">${cols.map(c=>{
        const v=r[c];
        let disp = v===null?'<span style="color:var(--red);font-weight:600">NULL</span>':v;
        if(c==='MatricNSC'&&v!==null&&v>42) disp=`<span style="color:var(--red);font-weight:600">${v} ⚠</span>`;
        if(c==='Attendance'&&v!==null&&v>100) disp=`<span style="color:var(--red);font-weight:600">${v} ⚠</span>`;
        if(c==='ModulesFailed'&&v!==null&&v<0) disp=`<span style="color:var(--red);font-weight:600">${v} ⚠</span>`;
        return `<td>${disp}</td>`;
      }).join('')}</tr>`;
    }).join('');
  }
  
  function filterLab1Table(){
    const search=(document.getElementById('l1-search')?.value||'').toLowerCase();
    const fac=(document.getElementById('l1-faculty')?.value||'');
    const showIssues=(document.getElementById('l1-show-issues')?.value||'');
    const data=LAB_DATA.unit1.filter(r=>{
      const matchSearch=!search||(r.Faculty+r.Race+r.Programme).toLowerCase().includes(search);
      const matchFac=!fac||r.Faculty===fac;
      const hasIssue=r.MatricNSC===null||r.MatricNSC>42||r.Attendance===null||r.Attendance>100||r.WPA===null||r.ModulesFailed<0||r.HomeProvince===null||r.LMS_Logins===null;
      const matchIssue=!showIssues||hasIssue;
      return matchSearch&&matchFac&&matchIssue;
    });
    const cols=['StudentID','Faculty','Programme','Gender','Race','HomeProvince','MatricNSC','Attendance','WPA','FinancialAid','ModulesFailed','LMS_Logins'];
    document.getElementById('l1-tbody').innerHTML=buildLab1Rows(data,cols);
  }
  
  function buildAccurateScorecard(){
    const dims=['Accuracy','Completeness','Consistency','Uniqueness','Relevance','Accessibility','Timeliness','Explainability'];
    return dims.map((d,i)=>`
      <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border)">
        <div style="font-size:13px;font-weight:600;color:var(--text);min-width:130px">${d}</div>
        <div style="display:flex;gap:6px">${[1,2,3,4,5].map(n=>`
          <button onclick="setACCURATERating(${i},${n},this)" id="acc-${i}-${n}"
            style="width:28px;height:28px;border-radius:6px;border:1.5px solid var(--border);background:#fff;font-size:12px;font-weight:600;cursor:pointer;color:var(--text-mid);transition:all .15s">${n}</button>
        `).join('')}</div>
        <div style="flex:1;font-size:11.5px;color:var(--text-light)" id="acc-note-${i}">Click to rate 1 (poor) – 5 (excellent)</div>
      </div>`).join('');
  }
  
  async function setACCURATERating(dim,rating,btn){
    [1,2,3,4,5].forEach(n=>{
      const b=document.getElementById(`acc-${dim}-${n}`);
      if(b){b.style.background=n<=rating?'var(--blue)':'#fff';b.style.color=n<=rating?'#fff':'var(--text-mid)';b.style.borderColor=n<=rating?'var(--blue)':'var(--border)';}
    });
    const notes=['Very poor — major issues found','Poor — significant issues','Fair — some issues','Good — minor issues only','Excellent — no issues found'];
    const noteEl=document.getElementById(`acc-note-${dim}`);
    if(noteEl)noteEl.textContent=notes[rating-1];
    if(!state.accurateRatings)state.accurateRatings={};
    state.accurateRatings[dim]=rating;
    await saveState();
  }
  
  function checkLab1Task(taskIdx){
    const ans=(document.getElementById(`l1ta${taskIdx}`)?.value||'').toLowerCase();
    const fb=document.getElementById(`l1tf${taskIdx}`);
    const checks=[
      ()=>{
        const found=ans.includes('202300') && (ans.includes('55')||ans.includes('115')||ans.includes('-1')||ans.includes('nsc')||ans.includes('attend')||ans.includes('modules'));
        return found?{ok:true,msg:'✓ Correct! You identified the out-of-range values. Record 20230008 has MatricNSC=55 (max 42); Record 20230012 has Attendance=115 (max 100); Record 20230020 has ModulesFailed=-1 (invalid).'}:{ok:false,msg:'Look more carefully at the MatricNSC column (max is 42), Attendance column (max is 100), and ModulesFailed column (cannot be negative).'};
      },
      ()=>{
        const hasMentionOfVars=ans.includes('matric')||ans.includes('nsc')||ans.includes('wpa')||ans.includes('attend')||ans.includes('province')||ans.includes('lms');
        return hasMentionOfVars?{ok:true,msg:'✓ Good analysis! The variables with highest missingness are: MatricNSC (3 missing = 10%), WPA (2 missing = 6.7%), Attendance (2 missing = 6.7%).'}:{ok:false,msg:'Hint: Look for NULL values in the dataset. Which columns have the most? Count them and calculate as a percentage of 30 records.'};
      },
      ()=>{
        const found=ans.includes('2023001')||ans.includes('duplicate')||ans.includes('same id')||ans.includes('appears twice');
        return found?{ok:true,msg:'✓ Correct! StudentID 2023001 appears twice (records 1 and 15). This means the true cohort size may be 29, not 30 — any aggregate statistic would be skewed.'}:{ok:false,msg:"Hint: Look at the StudentID column carefully. Compare the first few IDs — do any look identical?"};
      }
    ];
    if(checks[taskIdx]){
      const result=checks[taskIdx]();
      fb.textContent=result.msg;
      fb.className=`task-feedback show ${result.ok?'correct':'partial'}`;
      if(result.ok)toggleLabTask(1,taskIdx);
    }
    saveLabTaskAnswer(1,taskIdx,document.getElementById(`l1ta${taskIdx}`)?.value||'');
  }
  
  async function autoSaveReport(){
    if(!state.labReports)state.labReports={};
    state.labReports.lab1={
      summary:document.getElementById('report-summary')?.value||'',
      issues:document.getElementById('report-issues')?.value||'',
      actions:document.getElementById('report-actions')?.value||''
    };
    await saveState();
  }
  function getReportField(field){return state.labReports?.lab1?.[field]||'';}
  
  // ─── LAB 2: Data Mapping ───────────────
  function buildLab2(){
    const systems=[
      {tier:1,name:'PeopleSoft (SIS)',owner:'Registrar',vars:'StudentID, Enrolment, Academic Record, Matric',access:'L2 — Faculty Data Champion'},
      {tier:1,name:'Applications System',owner:'Admissions',vars:'NSC results, School, Province, Application history',access:'L2 — Faculty Data Champion'},
      {tier:1,name:'Finance System',owner:'Finance Division',vars:'Fee account, NSFAS award, Bursary type',access:'L4 — Finance only'},
      {tier:2,name:'Ulwazi LMS (Moodle)',owner:'Academic IT',vars:'Login logs, Quiz scores, Assignment submissions',access:'L2 — Faculty Data Champion'},
      {tier:2,name:'Turnitin / Gradebook',owner:'Academic IT',vars:'Assignment submissions, Plagiarism flags, Marks',access:'L2 — Faculty Data Champion'},
      {tier:2,name:'Library System',owner:'Library',vars:'Borrowing records, Study room bookings',access:'L3 — Analytics Team'},
      {tier:3,name:'Counselling CRM',owner:'Student Services',vars:'Appointment notes, Referral records',access:'L4 — Restricted'},
      {tier:3,name:'Residence Management',owner:'Student Housing',vars:'Allocation, Incidents',access:'L3 — Analytics Team'},
      {tier:4,name:'BISO Data Warehouse',owner:'BISO',vars:'Integrated student view, ARI, Dashboards',access:'L2+ — Data Champions'},
    ];
    const scenario='First-year African Languages pass rate dropped from 79% to 58% between 2022 and 2023. Dropout is 23% higher than faculty average.';
    return `
    <div id="ilab-2" class="ilab-container">
      <div class="ilab-header">
        <div class="ilab-header-left">
          <div class="ilab-header-icon">🗺️</div>
          <div><h3>Lab 2.1 — Data Mapping & Systems Navigation</h3><p>Map data sources for a real student success investigation</p></div>
        </div>
        <span class="ilab-done-badge ${labDone(2)?'completed':''}" id="lab-done-badge-2">${labDone(2)?'✓ Lab Complete':'In Progress'}</span>
      </div>
      <div class="ilab-tabs">
        <div class="ilab-tab active" id="ltab-2-scenario" onclick="switchLabTab(2,'scenario')">📌 Scenario</div>
        <div class="ilab-tab" id="ltab-2-systems" onclick="switchLabTab(2,'systems')">🗄️ Systems Map</div>
        <div class="ilab-tab" id="ltab-2-tasks" onclick="switchLabTab(2,'tasks')">✏️ Tasks</div>
      </div>
      <div class="ilab-panel active" id="lpanel-2-scenario">
        <div class="info-box gold"><div class="ib-title">📋 Investigation Scenario</div><p>${scenario}</p></div>
        <p style="font-size:13px;color:var(--text-mid);line-height:1.65;margin:14px 0">Your task: Map all the data sources, identify which variables you need from each system, and draft your data access plan. Work through the Systems Map tab first, then complete the Tasks.</p>
        <div class="section-card" style="margin:0;background:var(--bg)">
          <h3 style="font-size:13px;margin-top:0">Investigation Questions to Guide You</h3>
          <ul style="padding-left:18px">
            <li style="font-size:13px;color:var(--text-mid);padding:4px 0">What demographic factors might explain the differential dropout rate?</li>
            <li style="font-size:13px;color:var(--text-mid);padding:4px 0">What academic engagement data would show early warning signals?</li>
            <li style="font-size:13px;color:var(--text-mid);padding:4px 0">Was there a change in the student cohort profile between 2022 and 2023?</li>
            <li style="font-size:13px;color:var(--text-mid);padding:4px 0">Are there financial stress indicators that correlate with dropout?</li>
            <li style="font-size:13px;color:var(--text-mid);padding:4px 0">What does LMS engagement data reveal about participation trends?</li>
          </ul>
        </div>
      </div>
      <div class="ilab-panel" id="lpanel-2-systems">
        <p style="font-size:13px;color:var(--text-mid);margin-bottom:12px">All Wits student data systems. Click a row to mark it as relevant to your investigation.</p>
        <div class="dt-container"><table class="dt-table">
          <thead><tr><th>Tier</th><th>System Name</th><th>Data Owner</th><th>Key Variables</th><th>Access Level</th><th>Relevant?</th></tr></thead>
          <tbody>${systems.map((s,i)=>`<tr id="sys-row-${i}">
            <td>${s.tier}</td><td><strong>${s.name}</strong></td><td>${s.owner}</td>
            <td style="font-size:11px">${s.vars}</td><td style="font-size:11px">${s.access}</td>
            <td><button onclick="toggleSystemRelevant(${i})" id="sys-btn-${i}" style="padding:4px 10px;border-radius:6px;border:1.5px solid var(--border);background:#fff;font-size:11px;cursor:pointer;transition:all .15s">${(state.sysRelevant||[]).includes(i)?'✓ Selected':'+ Select'}</button></td>
          </tr>`).join('')}</tbody>
        </table></div>
        <div style="margin-top:12px;padding:12px;background:var(--gold-pale);border-radius:8px;font-size:12px;color:var(--amber)">
          <strong>Selected systems:</strong> <span id="sys-selected-count">${(state.sysRelevant||[]).length}</span> of ${systems.length} — aim for the minimum necessary (data minimisation principle)
        </div>
      </div>
      <div class="ilab-panel" id="lpanel-2-tasks">
        <div class="task-list">
          <div class="task-item ${labTaskDone(2,0)?'completed-task':''}" id="l2t0">
            <div class="task-header"><div class="task-check" onclick="toggleLabTask(2,0)">✓</div>
            <div class="task-body">
              <div class="task-title">Task 1: Identify your top 3 most critical data sources</div>
              <div class="task-desc">Which 3 systems from the Systems Map are most important for this investigation? For each, name the key variable you need and why.</div>
              <textarea class="task-input" id="l2ta0" placeholder="1. System name — Variable: X — Why: &#10;2. System name — Variable: X — Why: &#10;3. System name — Variable: X — Why: " oninput="saveLabTaskAnswer(2,0,this.value)">${labTaskAnswer(2,0)}</textarea>
              <button class="task-btn" onclick="toggleLabTask(2,0);showToast('Saved!')">Save & Mark Done</button>
            </div></div>
          </div>
          <div class="task-item ${labTaskDone(2,1)?'completed-task':''}" id="l2t1">
            <div class="task-header"><div class="task-check" onclick="toggleLabTask(2,1)">✓</div>
            <div class="task-body">
              <div class="task-title">Task 2: Identify 2 data gaps</div>
              <div class="task-desc">What data do you WISH you had that is NOT currently collected? For each: describe it, how it could be ethically collected, and its POPIA implications.</div>
              <textarea class="task-input" id="l2ta1" placeholder="Gap 1: &#10;Collection method: &#10;POPIA consideration: &#10;&#10;Gap 2: &#10;Collection method: &#10;POPIA consideration: " oninput="saveLabTaskAnswer(2,1,this.value)">${labTaskAnswer(2,1)}</textarea>
              <button class="task-btn" onclick="toggleLabTask(2,1);showToast('Saved!')">Save & Mark Done</button>
            </div></div>
          </div>
          <div class="task-item ${labTaskDone(2,2)?'completed-task':''}" id="l2t2">
            <div class="task-header"><div class="task-check" onclick="toggleLabTask(2,2)">✓</div>
            <div class="task-body">
              <div class="task-title">Task 3: Draft your Data Request</div>
              <div class="task-desc">Complete the key elements of a Wits Data Request for your most critical data source.</div>
              <textarea class="task-input" id="l2ta2" style="min-height:110px" placeholder="Purpose statement: &#10;Variables requested: &#10;Cohort (which students): &#10;Time period: &#10;Proposed storage location: &#10;Line manager approval: " oninput="saveLabTaskAnswer(2,2,this.value)">${labTaskAnswer(2,2)}</textarea>
              <button class="task-btn" onclick="toggleLabTask(2,2);showToast('Saved!')">Save & Mark Done</button>
            </div></div>
          </div>
        </div>
        <button 
        class="lab-complete-btn" 
        id="lab-complete-btn-2" 
        onclick="completeLab(2)" 
        ${labDone(2) ? 'disabled' : 'disabled'}
      >
        ${labDone(2) ? '✓ Lab Completed' : '🏁 Complete All Tasks to Finish (+75 XP)'}
      </button>
      </div>
    </div>`;
  }
  
  async function toggleSystemRelevant(i){
    if(!state.sysRelevant)state.sysRelevant=[];
    const idx=state.sysRelevant.indexOf(i);
    if(idx===-1){state.sysRelevant.push(i);}else{state.sysRelevant.splice(idx,1);}
    await saveState();
    const btn=document.getElementById(`sys-btn-${i}`);
    if(btn){btn.textContent=state.sysRelevant.includes(i)?'✓ Selected':'+ Select';btn.style.background=state.sysRelevant.includes(i)?'var(--green-bg)':'#fff';btn.style.borderColor=state.sysRelevant.includes(i)?'var(--green)':'var(--border)';}
    const cnt=document.getElementById('sys-selected-count');
    if(cnt)cnt.textContent=state.sysRelevant.length;
  }
  
  // ─── LAB 3: Dashboard Building ─────────
  function buildLab3(){
    const data=LAB_DATA.unit3;
    const races=['African','Coloured','Indian','White'];
    const passRates=races.map(r=>{
      const group=data.filter(s=>s.Race===r);
      return{race:r,pass:group.filter(s=>s.S1_Outcome==='Pass').length,total:group.length,pct:group.length?Math.round(group.filter(s=>s.S1_Outcome==='Pass').length/group.length*100):0};
    });
    const faculties=['Commerce','Engineering','Humanities','Science'];
    const facPass=faculties.map(f=>{const g=data.filter(s=>s.Faculty===f);return{fac:f,pct:g.length?Math.round(g.filter(s=>s.S1_Outcome==='Pass').length/g.length*100):0};});
  
    return `
    <div id="ilab-3" class="ilab-container">
      <div class="ilab-header">
        <div class="ilab-header-left">
          <div class="ilab-header-icon">📊</div>
          <div><h3>Lab 3.1 — Student Success Dashboard</h3><p>Analyse 40 student records and build equity-focused visualisations</p></div>
        </div>
        <span class="ilab-done-badge ${labDone(3)?'completed':''}" id="lab-done-badge-3">${labDone(3)?'✓ Lab Complete':'In Progress'}</span>
      </div>
      <div class="ilab-tabs">
        <div class="ilab-tab active" id="ltab-3-data" onclick="switchLabTab(3,'data')">📋 Dataset</div>
        <div class="ilab-tab" id="ltab-3-charts" onclick="switchLabTab(3,'charts')">📊 Charts</div>
        <div class="ilab-tab" id="ltab-3-equity" onclick="switchLabTab(3,'equity')">⚖️ Equity Analysis</div>
        <div class="ilab-tab" id="ltab-3-story" onclick="switchLabTab(3,'story')">📝 Data Story</div>
      </div>
      <div class="ilab-panel active" id="lpanel-3-data">
        <div class="dt-stats">
          <div class="dt-stat"><strong>40</strong>Students</div>
          <div class="dt-stat"><strong>${data.filter(s=>s.S1_Outcome==='Pass').length}</strong>Passed</div>
          <div class="dt-stat"><strong>${data.filter(s=>s.S1_Outcome==='Fail').length}</strong>Failed</div>
          <div class="dt-stat"><strong>${Math.round(data.filter(s=>s.S1_Outcome==='Pass').length/40*100)}%</strong>Overall Pass Rate</div>
        </div>
        <div class="dt-filter-bar">
          <select class="dt-filter" id="l3-race" onchange="filterLab3()"><option value="">All Races</option>${races.map(r=>`<option>${r}</option>`).join('')}</select>
          <select class="dt-filter" id="l3-aid" onchange="filterLab3()"><option value="">All Aid Types</option><option>NSFAS</option><option>Self-funded</option><option>Bursary</option><option>Partial</option></select>
          <select class="dt-filter" id="l3-outcome" onchange="filterLab3()"><option value="">All Outcomes</option><option>Pass</option><option>Fail</option></select>
        </div>
        <div class="dt-container"><table class="dt-table" id="l3-table">
          <thead><tr><th>ID</th><th>Faculty</th><th>Race</th><th>Gender</th><th>Quintile</th><th>Aid</th><th>Matric NSC</th><th>WPA</th><th>Attend%</th><th>LMS Logins</th><th>Outcome</th></tr></thead>
          <tbody id="l3-tbody">${buildLab3Rows(data)}</tbody>
        </table></div>
      </div>
      <div class="ilab-panel" id="lpanel-3-charts">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
          <div class="chart-wrap">
            <div class="chart-title">📊 Pass Rate by Race — Equity Gap Chart</div>
            <div id="chart3-race">${buildBarChart(passRates.map(r=>({label:r.race,val:r.pct,color:r.race==='African'?'#C0392B':r.race==='White'?'#1A7F5A':r.race==='Coloured'?'#B7791F':'#003B5C'})),'%',100)}</div>
          </div>
          <div class="chart-wrap">
            <div class="chart-title">📊 Pass Rate by Faculty</div>
            <div id="chart3-fac">${buildBarChart(facPass.map(f=>({label:f.fac,val:f.pct,color:'#003B5C'})),'%',100)}</div>
          </div>
          <div class="chart-wrap" style="grid-column:1/-1">
            <div class="chart-title">📊 WPA Distribution by School Quintile (Hover to inspect)</div>
            <div id="chart3-quint">${buildQuintileChart(data)}</div>
          </div>
        </div>
      </div>
      <div class="ilab-panel" id="lpanel-3-equity">
        <div class="info-box red"><div class="ib-title">🔍 Equity Gap Finder</div><p>The charts below disaggregate pass rates by race and financial aid — revealing gaps that the overall average conceals.</p></div>
        <div style="overflow-x:auto"><table class="data-table" style="margin:14px 0">
          <thead><tr><th>Race Group</th><th>Pass</th><th>Fail</th><th>Total</th><th>Pass Rate</th><th>Gap vs Highest</th></tr></thead>
          <tbody>${(()=>{const maxPct=Math.max(...passRates.map(r=>r.pct));return passRates.map(r=>`<tr><td><strong>${r.race}</strong></td><td style="color:var(--green)">${r.pass}</td><td style="color:var(--red)">${r.total-r.pass}</td><td>${r.total}</td><td><strong>${r.pct}%</strong></td><td style="color:${r.pct<maxPct?'var(--red)':'var(--green)'}">${r.pct===maxPct?'Highest':'-'+(maxPct-r.pct)+' pts'}</td></tr>`).join('');})()}</tbody>
        </table></div>
        <div style="overflow-x:auto"><table class="data-table">
          <thead><tr><th>Aid Type</th><th>Pass Rate</th><th>Avg WPA</th><th>n</th></tr></thead>
          <tbody>${['NSFAS','Self-funded','Bursary','Partial'].map(a=>{const g=data.filter(s=>s.FinancialAid===a);const avgWPA=g.length?+(g.reduce((sum,s)=>sum+s.S1_WPA,0)/g.length).toFixed(1):0;const pr=g.length?Math.round(g.filter(s=>s.S1_Outcome==='Pass').length/g.length*100):0;return`<tr><td><strong>${a}</strong></td><td><strong style="color:${pr<60?'var(--red)':pr<75?'var(--amber)':'var(--green)'}">${pr}%</strong></td><td>${avgWPA}</td><td>${g.length}</td></tr>`;}).join('')}</tbody>
        </table></div>
      </div>
      <div class="ilab-panel" id="lpanel-3-story">
        <div class="info-box blue"><div class="ib-title">SCQA Data Story Framework</div><p>Use the SCQA framework to write a 3-minute stakeholder briefing based on the equity finding you found most significant.</p></div>
        <div class="task-list">
          <div class="task-item"><div class="task-header"><div class="task-body">
            <div class="task-title">S — Situation</div>
            <textarea class="task-input" id="scqa-s" placeholder="Set the scene: What do we know? (Cohort size, overall context)" oninput="saveSCQA()">${state.scqa?.s||''}</textarea>
          </div></div></div>
          <div class="task-item"><div class="task-header"><div class="task-body">
            <div class="task-title">C — Complication</div>
            <textarea class="task-input" id="scqa-c" placeholder="What is the concerning finding from your equity analysis?" oninput="saveSCQA()">${state.scqa?.c||''}</textarea>
          </div></div></div>
          <div class="task-item"><div class="task-header"><div class="task-body">
            <div class="task-title">Q — Question this raises</div>
            <textarea class="task-input" id="scqa-q" placeholder="What question does this raise for leadership?" oninput="saveSCQA()" style="min-height:55px">${state.scqa?.q||''}</textarea>
          </div></div></div>
          <div class="task-item"><div class="task-header"><div class="task-body">
            <div class="task-title">A — Answer / Recommendation</div>
            <textarea class="task-input" id="scqa-a" placeholder="What specific interventions does the data suggest?" oninput="saveSCQA()">${state.scqa?.a||''}</textarea>
          </div></div></div>
        </div>
        <button 
        class="lab-complete-btn" 
        id="lab-complete-btn-3" 
        onclick="completeLab(3)" 
        ${labDone(3) ? 'disabled' : 'disabled'}
      >
        ${labDone(3) ? '✓ Lab Completed' : '🏁 Complete All Tasks to Finish (+75 XP)'}
      </button>
      </div>
    </div>`;
  }
  
  function buildLab3Rows(data){
    return data.map(r=>`<tr class="${r.S1_Outcome==='Fail'?'risk-high':''}">
      <td>${r.StudentID}</td><td>${r.Faculty}</td><td>${r.Race}</td><td>${r.Gender}</td>
      <td>Q${r.SchoolQuintile}</td><td>${r.FinancialAid}</td><td>${r.MatricNSC}</td>
      <td>${r.S1_WPA}</td><td>${r.S1_Attendance}%</td><td>${r.S1_LMS_Logins}</td>
      <td><span style="font-weight:600;color:${r.S1_Outcome==='Pass'?'var(--green)':'var(--red)'}">${r.S1_Outcome}</span></td>
    </tr>`).join('');
  }
  function filterLab3(){
    const race=document.getElementById('l3-race')?.value||'';
    const aid=document.getElementById('l3-aid')?.value||'';
    const out=document.getElementById('l3-outcome')?.value||'';
    const filtered=LAB_DATA.unit3.filter(s=>(!race||s.Race===race)&&(!aid||s.FinancialAid===aid)&&(!out||s.S1_Outcome===out));
    document.getElementById('l3-tbody').innerHTML=buildLab3Rows(filtered);
  }
  
  function buildBarChart(items,unit,max){
    return `<div style="display:flex;flex-direction:column;gap:8px">${items.map(item=>`
      <div style="display:flex;align-items:center;gap:10px">
        <div style="font-size:11px;color:var(--text-mid);min-width:80px;text-align:right">${item.label}</div>
        <div style="flex:1;background:var(--border);border-radius:4px;height:22px;overflow:hidden">
          <div style="height:100%;width:${item.val}%;background:${item.color||'var(--blue)'};border-radius:4px;display:flex;align-items:center;padding-left:6px;transition:width .5s ease">
            <span style="font-size:11px;font-weight:700;color:#fff">${item.val}${unit}</span>
          </div>
        </div>
      </div>`).join('')}</div>`;
  }
  
  function buildQuintileChart(data){
    const quints=[1,2,3,4,5];
    const qData=quints.map(q=>{
      const g=data.filter(s=>s.SchoolQuintile===q);
      return{q,avg:g.length?+(g.reduce((s,r)=>s+r.S1_WPA,0)/g.length).toFixed(1):0,n:g.length};
    });
    return buildBarChart(qData.map(d=>({label:`Quintile ${d.q} (n=${d.n})`,val:d.avg,color:d.q<=2?'#C0392B':d.q===3?'#B7791F':'#1A7F5A'})),' WPA',100);
  }
  
  async function saveSCQA() {
    state.scqa = {
        s: document.getElementById('scqa-s')?.value || '',
        c: document.getElementById('scqa-c')?.value || '',
        q: document.getElementById('scqa-q')?.value || '',
        a: document.getElementById('scqa-a')?.value || ''
    };
    await saveState();
    checkLabReady(3); // Lab 3 completion depends on SCQA
}
  
  // ─── LAB 4: ARI Interpretation ─────────
  function buildLab4(){
    const data=LAB_DATA.unit4;
    const high=data.filter(d=>d.RiskBand==='HIGH'||d.RiskBand==='CRITICAL');
    const bandCounts={LOW:0,MODERATE:0,HIGH:0,CRITICAL:0};
    data.forEach(d=>bandCounts[d.RiskBand]++);
  
    return `
    <div id="ilab-4" class="ilab-container">
      <div class="ilab-header">
        <div class="ilab-header-left">
          <div class="ilab-header-icon">🤖</div>
          <div><h3>Lab 4.1 — ARI Model Interpretation</h3><p>Analyse 25 at-risk predictions and make evidence-based intervention decisions</p></div>
        </div>
        <span class="ilab-done-badge ${labDone(4)?'completed':''}" id="lab-done-badge-4">${labDone(4)?'✓ Lab Complete':'In Progress'}</span>
      </div>
      <div class="ilab-tabs">
        <div class="ilab-tab active" id="ltab-4-data" onclick="switchLabTab(4,'data')">📊 ARI Predictions</div>
        <div class="ilab-tab" id="ltab-4-high" onclick="switchLabTab(4,'high')">🔴 High Risk Actions</div>
        <div class="ilab-tab" id="ltab-4-bias" onclick="switchLabTab(4,'bias')">⚖️ Bias Check</div>
        <div class="ilab-tab" id="ltab-4-reflect" onclick="switchLabTab(4,'reflect')">💭 Reflection</div>
      </div>
      <div class="ilab-panel active" id="lpanel-4-data">
        <div class="dt-stats">
          ${Object.entries(bandCounts).map(([k,v])=>`<div class="dt-stat"><strong>${v}</strong>${k}</div>`).join('')}
          <div class="dt-stat"><strong>${Math.round(high.length/data.length*100)}%</strong>High+Critical</div>
        </div>
        <div class="dt-filter-bar">
          <select class="dt-filter" id="l4-band" onchange="filterLab4()"><option value="">All Bands</option><option>LOW</option><option>MODERATE</option><option>HIGH</option><option>CRITICAL</option></select>
          <select class="dt-filter" id="l4-race" onchange="filterLab4()"><option value="">All Races</option><option>African</option><option>Coloured</option><option>Indian</option><option>White</option></select>
        </div>
        <div class="dt-container"><table class="dt-table" id="l4-table">
          <thead><tr><th>StudentID</th><th>Faculty</th><th>Race</th><th>Gender</th><th>ARI Score</th><th>Risk Band</th><th>NSC</th><th>Attend%</th><th>LMS</th><th>Financial</th><th>Top Risk Factor</th></tr></thead>
          <tbody id="l4-tbody">${buildLab4Rows(data)}</tbody>
        </table></div>
      </div>
      <div class="ilab-panel" id="lpanel-4-high">
        <div class="info-box red"><div class="ib-title">🚨 High & Critical Risk Students</div><p>${high.length} students require immediate action. For each, decide the most appropriate first intervention.</p></div>
        <div class="dt-container"><table class="dt-table">
          <thead><tr><th>StudentID</th><th>Risk Band</th><th>ARI</th><th>Top Risk Factor</th><th>Assigned Intervention</th></tr></thead>
          <tbody>${high.map((s,i)=>`<tr>
            <td><strong>${s.StudentID}</strong></td>
            <td><span class="ari-badge ${s.RiskBand==='CRITICAL'?'ari-crit':'ari-high'}">${s.RiskBand}</span></td>
            <td>${s.ARI_Score}</td>
            <td>${s.TopRiskFactor}</td>
            <td><select class="task-select" style="margin:0;padding:4px 8px;font-size:11px" onchange="saveIntervention(${i},this.value)" id="interv-${i}">
              <option value="">Select intervention...</option>
              <option value="phone">📞 Personal phone call</option>
              <option value="email">📧 Personalised email</option>
              <option value="advisor">👤 Advisor appointment</option>
              <option value="tutoring">📚 Academic tutoring</option>
              <option value="financial">💰 Financial aid check</option>
              <option value="counselling">💬 Counselling referral</option>
              <option value="mdc">🏥 Multi-disciplinary conference</option>
            </select></td>
          </tr>`).join('')}</tbody>
        </table></div>
        <div class="task-list" style="margin-top:16px">
          <div class="task-item ${labTaskDone(4,0)?'completed-task':''}" id="l4t0">
            <div class="task-header"><div class="task-check" onclick="toggleLabTask(4,0)">✓</div>
            <div class="task-body">
              <div class="task-title">After assigning interventions: What was the most common top risk factor among HIGH/CRITICAL students?</div>
              <textarea class="task-input" id="l4ta0" placeholder="Most common factor: &#10;Implication for programme design: " oninput="saveLabTaskAnswer(4,0,this.value)">${labTaskAnswer(4,0)}</textarea>
              <button class="task-btn" onclick="toggleLabTask(4,0);showToast('Saved!')">Save & Mark Done</button>
            </div></div>
          </div>
        </div>
        <button 
        class="lab-complete-btn" 
        id="lab-complete-btn-4" 
        onclick="completeLab(4)" 
        ${labDone(4) ? 'disabled' : 'disabled'}
      >
        ${labDone(4) ? '✓ Lab Completed' : '🏁 Complete All Tasks to Finish (+75 XP)'}
      </button>
      </div>
      <div class="ilab-panel" id="lpanel-4-bias">
        <div class="info-box purple"><div class="ib-title">⚖️ Algorithmic Bias Audit</div><p>Compare the distribution of HIGH/CRITICAL risk flags across race groups. Are any groups disproportionately represented?</p></div>
        <table class="data-table">
          <thead><tr><th>Race Group</th><th>Total</th><th>HIGH+CRITICAL</th><th>% Flagged</th><th>Equity Assessment</th></tr></thead>
          <tbody>${['African','Coloured','Indian','White'].map(r=>{
            const total=data.filter(d=>d.Race===r).length;
            const flagged=data.filter(d=>d.Race===r&&(d.RiskBand==='HIGH'||d.RiskBand==='CRITICAL')).length;
            const pct=total?Math.round(flagged/total*100):0;
            const concern=pct>60?'⚠️ Potentially over-represented':pct<20?'ℹ️ Under-represented — check completeness':'✓ Within expected range';
            return`<tr><td><strong>${r}</strong></td><td>${total}</td><td>${flagged}</td><td><strong style="color:${pct>60?'var(--red)':pct<20?'var(--amber)':'var(--green)'}">${pct}%</strong></td><td style="font-size:11.5px">${concern}</td></tr>`;
          }).join('')}</tbody>
        </table>
        <div class="task-list" style="margin-top:14px">
          <div class="task-item ${labTaskDone(4,1)?'completed-task':''}" id="l4t1">
            <div class="task-header"><div class="task-check" onclick="toggleLabTask(4,1)">✓</div>
            <div class="task-body">
              <div class="task-title">What type of bias might explain the pattern you see? What mitigation would you recommend?</div>
              <textarea class="task-input" id="l4ta1" placeholder="Bias type identified: &#10;Evidence: &#10;Mitigation recommendation: " oninput="saveLabTaskAnswer(4,1,this.value)">${labTaskAnswer(4,1)}</textarea>
              <button class="task-btn" onclick="toggleLabTask(4,1);showToast('Saved!')">Save & Mark Done</button>
            </div></div>
          </div>
        </div>
      </div>
      <div class="ilab-panel" id="lpanel-4-reflect">
        <div class="task-list">
          <div class="task-item"><div class="task-header"><div class="task-body">
            <div class="task-title">Reflection: Would you act on these model outputs? What safeguards are needed?</div>
            <textarea class="task-input" id="l4-reflect" style="min-height:90px" placeholder="I would/would not act on these outputs because...&#10;Safeguards needed:&#10;What additional information would increase my confidence:" oninput="saveLabTaskAnswer(4,2,this.value)">${labTaskAnswer(4,2)}</textarea>
            <button class="task-btn" onclick="showToast('Reflection saved!')">Save Reflection</button>
          </div></div></div>
        </div>
      </div>
    </div>`;
  }
  
  function buildLab4Rows(data){
    return data.map(r=>`<tr class="${r.RiskBand==='HIGH'?'risk-high':r.RiskBand==='CRITICAL'?'risk-crit':''}">
      <td>${r.StudentID}</td><td>${r.Faculty}</td><td>${r.Race}</td><td>${r.Gender}</td>
      <td><span class="ari-badge ${r.ARI_Score<31?'ari-low':r.ARI_Score<56?'ari-mod':r.ARI_Score<76?'ari-high':'ari-crit'}">${r.ARI_Score}</span></td>
      <td><span class="ari-badge ${r.RiskBand==='LOW'?'ari-low':r.RiskBand==='MODERATE'?'ari-mod':r.RiskBand==='HIGH'?'ari-high':'ari-crit'}">${r.RiskBand}</span></td>
      <td>${r.NSC_Score}</td><td>${r.Attendance_Pct}%</td><td>${r.LMS_Score}</td>
      <td><span style="color:${r.FinancialFlag==='Yes'?'var(--red)':'var(--green)'}">${r.FinancialFlag}</span></td>
      <td style="font-size:11px">${r.TopRiskFactor}</td>
    </tr>`).join('');
  }
  
  function filterLab4(){
    const band=document.getElementById('l4-band')?.value||'';
    const race=document.getElementById('l4-race')?.value||'';
    const filtered=LAB_DATA.unit4.filter(r=>(!band||r.RiskBand===band)&&(!race||r.Race===race));
    document.getElementById('l4-tbody').innerHTML=buildLab4Rows(filtered);
  }
  async function saveIntervention(i,v){if(!state.interventions)state.interventions={};state.interventions[i]=v;await saveState();}
  
  // ─── LAB 5: Ethics Scenarios ────────────
  function buildLab5(){
    const scenarios=[
      {id:'A',title:'The Shared Dashboard',icon:'📊',desc:'A faculty administrator creates a Power BI dashboard showing all HIGH/CRITICAL risk students by name, student number, ARI score, and top risk factor — shared via a link accessible to all 45 academic staff.',violations:['POPIA Condition 7 (Security Safeguards)','POPIA Condition 2 (Processing Limitation)'],correct:'The dashboard must restrict identifiable information to only authorised roles. A named staff member with a specific student advising role should have access, not all 45 staff. ARI scores should be accessible only to the student\'s allocated advisor.'},
      {id:'B',title:'The Automated Email',icon:'📧',desc:'An automated email goes to all students with ARI > 70: "Our analytics system indicates you may be at significant risk of failing. Please contact your academic advisor immediately."',violations:['Communication Guideline violation (deficit language)','POPIA Condition 3 (Purpose Specification) — disclosure of monitoring'],correct:'The email should be warm and strengths-based. Leads with care: "We check in with students who might benefit from support." Should be human-initiated, not automated. Should not reference the analytics system.'},
      {id:'C',title:'The Research Request',icon:'🔬',desc:'A postgraduate researcher from another university requests the anonymised 2020–2023 first-year cohort dataset (including race, gender, WPA, school quintile, dropout status) for a published study. Their supervisor has Wits IRB approval.',violations:['POPIA Condition 4 (Further Processing)'],correct:'Sharing is permissible if: the research purpose is compatible with original collection; data is further pseudonymised; a formal data sharing agreement is signed; and the dataset cannot re-identify individuals even indirectly.'},
    ];
    return `
    <div id="ilab-5" class="ilab-container">
      <div class="ilab-header">
        <div class="ilab-header-left">
          <div class="ilab-header-icon">⚖️</div>
          <div><h3>Lab 5.1 — Ethics Scenario Workshop</h3><p>Navigate ethical tensions and produce documented ethics decisions</p></div>
        </div>
        <span class="ilab-done-badge ${labDone(5)?'completed':''}" id="lab-done-badge-5">${labDone(5)?'✓ Lab Complete':'In Progress'}</span>
      </div>
      <div class="ilab-tabs">
        ${scenarios.map((s,i)=>`<div class="ilab-tab ${i===0?'active':''}" id="ltab-5-s${s.id}" onclick="switchLabTab(5,'s${s.id}')">${s.icon} Scenario ${s.id}</div>`).join('')}
        <div class="ilab-tab" id="ltab-5-record" onclick="switchLabTab(5,'record')">📋 Ethics Record</div>
      </div>
      ${scenarios.map((s,i)=>`
      <div class="ilab-panel ${i===0?'active':''}" id="lpanel-5-s${s.id}">
        <div class="case-study"><div class="cs-label">Ethics Scenario ${s.id}</div><div class="cs-title">${s.icon} ${s.title}</div><div class="cs-body"><p>${s.desc}</p></div></div>
        <div class="task-list">
          <div class="task-item ${labTaskDone(5,i*3)?'completed-task':''}" id="l5t${i*3}">
            <div class="task-header"><div class="task-check" onclick="toggleLabTask(5,${i*3})">✓</div>
            <div class="task-body">
              <div class="task-title">Which POPIA conditions are implicated? What are the specific harms?</div>
              <textarea class="task-input" id="l5ta${i*3}" placeholder="POPIA conditions: &#10;Specific harms: " oninput="saveLabTaskAnswer(5,${i*3},this.value)">${labTaskAnswer(5,i*3)}</textarea>
              <button class="task-btn" onclick="revealEthicsHint(${i},'violations')">See POPIA Guidance</button>
              <button class="task-btn" style="background:var(--blue);margin-left:6px" onclick="toggleLabTask(5,${i*3});showToast('Saved!')">Save & Done</button>
              <div class="task-feedback" id="l5hint${i}v"></div>
            </div></div>
          </div>
          <div class="task-item ${labTaskDone(5,i*3+1)?'completed-task':''}" id="l5t${i*3+1}">
            <div class="task-header"><div class="task-check" onclick="toggleLabTask(5,${i*3+1})">✓</div>
            <div class="task-body">
              <div class="task-title">How should this situation be handled correctly?</div>
              <textarea class="task-input" id="l5ta${i*3+1}" placeholder="Correct approach: &#10;Safeguards: &#10;Communication to stakeholders: " oninput="saveLabTaskAnswer(5,${i*3+1},this.value)">${labTaskAnswer(5,i*3+1)}</textarea>
              <button class="task-btn" onclick="revealEthicsHint(${i},'correct')">See Model Answer</button>
              <button class="task-btn" style="background:var(--blue);margin-left:6px" onclick="toggleLabTask(5,${i*3+1});showToast('Saved!')">Save & Done</button>
              <div class="task-feedback" id="l5hint${i}c"></div>
            </div></div>
          </div>
        </div>
      </div>`).join('')}
      <div class="ilab-panel" id="lpanel-5-record">
        <p style="font-size:13px;color:var(--text-mid);margin-bottom:14px">Complete your Ethics Decision Record for your chosen scenario.</p>
        <div class="cf-group"><label style="font-size:12px;font-weight:600;color:var(--text-mid);display:block;margin-bottom:5px">Issue Identified</label>
          <textarea class="task-input" style="min-height:55px" id="ethics-issue" oninput="saveEthicsRecord()">${state.ethicsRecord?.issue||''}</textarea></div>
        <div class="cf-group"><label style="font-size:12px;font-weight:600;color:var(--text-mid);display:block;margin-bottom:5px">Ethical Principles Engaged</label>
          <textarea class="task-input" style="min-height:55px" id="ethics-principles" oninput="saveEthicsRecord()">${state.ethicsRecord?.principles||''}</textarea></div>
        <div class="cf-group"><label style="font-size:12px;font-weight:600;color:var(--text-mid);display:block;margin-bottom:5px">Decision Taken & Safeguards</label>
          <textarea class="task-input" style="min-height:70px" id="ethics-decision" oninput="saveEthicsRecord()">${state.ethicsRecord?.decision||''}</textarea></div>
          <button 
          class="lab-complete-btn" 
          id="lab-complete-btn-5" 
          onclick="completeLab(5)" 
          ${labDone(5) ? 'disabled' : 'disabled'}
        >
          ${labDone(5) ? '✓ Lab Completed' : '🏁 Complete All Tasks to Finish (+75 XP)'}
        </button>
      </div>
    </div>`;
  }
  
  const ethicsScenarios=[
    {violations:'POPIA Condition 7 (Security Safeguards) and Condition 2 (Processing Limitation) are both violated. Harm: identifiable at-risk information accessible to all staff is a data breach; students are exposed to stigma and differential treatment.',correct:'Only the assigned advisor should see a specific student\'s ARI details. The dashboard should show anonymised aggregate trends to all staff, and individual flags only to the specific advisor assigned to that student.'},
    {violations:'POPIA Condition 6 (Openness) — students were not notified of automated monitoring. Communication Guidelines violated: deficit language ("at significant risk of failing"), references the analytics system (stigmatising), and automated contact removes the human relationship.',correct:'The contact should be warm, human-initiated, strengths-based: "I wanted to check in and see how you\'re getting on." Reference to analytics should be indirect. All automated communications should be reviewed by a human before sending.'},
    {violations:'POPIA Condition 4 (Further Processing) requires compatibility with original purpose. Simply having IRB approval is not sufficient — Wits must also assess compatibility and execute a formal Data Sharing Agreement.',correct:'Permissible with: formal Data Sharing Agreement; additional pseudonymisation; confirmation that re-identification is not possible; approval from Wits Information Officer; and a commitment that findings will not name the institution without consent.'}
  ];
  function revealEthicsHint(i,type){
    const el=document.getElementById(`l5hint${i}${type==='violations'?'v':'c'}`);
    if(el){el.textContent=type==='violations'?ethicsScenarios[i].violations:ethicsScenarios[i].correct;el.className='task-feedback show correct';}
  }

  async function saveEthicsRecord() {
    state.ethicsRecord = {
        issue: document.getElementById('ethics-issue')?.value || '',
        principles: document.getElementById('ethics-principles')?.value || '',
        decision: document.getElementById('ethics-decision')?.value || ''
    };
    await saveState();
    checkLabReady(5); // Lab 5 completion depends on Ethics Record
}
  
  // ─── LAB 6: 90-Day Action Plan ──────────
  function buildLab6(){
    return `
    <div id="ilab-6" class="ilab-container">
      <div class="ilab-header">
        <div class="ilab-header-left">
          <div class="ilab-header-icon">🎯</div>
          <div><h3>Lab 6.1 — 90-Day Data Champion Action Plan</h3><p>Build your personalised action plan for your faculty or division</p></div>
        </div>
        <span class="ilab-done-badge ${labDone(6)?'completed':''}" id="lab-done-badge-6">${labDone(6)?'✓ Lab Complete':'In Progress'}</span>
      </div>
      <div class="ilab-tabs">
        <div class="ilab-tab active" id="ltab-6-problem" onclick="switchLabTab(6,'problem')">1️⃣ Problem</div>
        <div class="ilab-tab" id="ltab-6-data" onclick="switchLabTab(6,'data')">2️⃣ Data Plan</div>
        <div class="ilab-tab" id="ltab-6-analysis" onclick="switchLabTab(6,'analysis')">3️⃣ Analysis</div>
        <div class="ilab-tab" id="ltab-6-intervention" onclick="switchLabTab(6,'intervention')">4️⃣ Intervention</div>
        <div class="ilab-tab" id="ltab-6-measure" onclick="switchLabTab(6,'measure')">5️⃣ Measurement</div>
        <div class="ilab-tab" id="ltab-6-plan" onclick="switchLabTab(6,'plan')">📋 Full Plan</div>
      </div>
      ${[
        {id:'problem',title:'Step 1: Problem Definition',ph:'Target students: \nTarget semester: \nTarget outcome (retention/pass rate/throughput): \nData point you already know that motivates this: \nWhy is this the priority above others: '},
        {id:'data',title:'Step 2: Data Plan',ph:'Variable 1: — System: — Owner: — Access needed: \nVariable 2: — System: — Owner: — Access needed: \nVariable 3: — System: — Owner: — Access needed: \nData gaps identified: '},
        {id:'analysis',title:'Step 3: Analysis Plan',ph:'Type of analysis: \nVisualisation(s) to produce: \nEquity disaggregations (essential): \nKey question the analysis will answer: '},
        {id:'intervention',title:'Step 4: Intervention Design',ph:'Risk tier(s) to target: LOW / MODERATE / HIGH / CRITICAL\nPerson making first student contact: \nScript / communication approach: \nSupport options to offer: \nTimeline from data signal to contact: '},
        {id:'measure',title:'Step 5: Measurement Framework',ph:'Reach Rate target: \nUptake Rate target: \nWPA improvement metric: \nRetention target: \nEquity check — how will you disaggregate outcomes: \nReview date: '}
      ].map((step,si)=>`
      <div class="ilab-panel ${si===0?'active':''}" id="lpanel-6-${step.id}">
        <div class="info-box blue"><div class="ib-title">${step.title}</div></div>
        <textarea class="task-input" style="min-height:180px" id="ap-${step.id}" placeholder="${step.ph}" oninput="saveActionPlan()">${state.actionPlan?.[step.id]||''}</textarea>
        ${si<4?`<button class="task-btn" style="margin-top:6px" onclick="switchLabTab(6,'${['data','analysis','intervention','measure','plan'][si+1]}');showToast('Saved, moving to next step...')">Save & Continue →</button>`:''}
      </div>`).join('')}
      <div class="ilab-panel" id="lpanel-6-plan">
        <div class="info-box green"><div class="ib-title">✅ Your Complete 90-Day Action Plan</div><p>Review your full plan below. All sections are auto-filled from your inputs.</p></div>
        <div id="full-plan-preview" style="background:var(--bg);border-radius:10px;padding:20px;font-size:13px;color:var(--text-mid);line-height:1.7"></div>
        <button class="task-btn" style="margin-top:12px;width:100%;padding:10px" onclick="refreshActionPlanPreview()">🔄 Refresh Plan Preview</button>
        <button 
        class="lab-complete-btn" 
        id="lab-complete-btn-6" 
        onclick="completeLab(6)" 
        ${labDone(6) ? 'disabled' : 'disabled'}
      >
        ${labDone(6) ? '✓ Lab Completed' : '🏁 Complete All Tasks to Finish (+75 XP)'}
      </button>
      </div>
    </div>`;
  }
  
async function saveActionPlan() {
    if (!state.actionPlan) state.actionPlan = {};
    ['problem', 'data', 'analysis', 'intervention', 'measure'].forEach(k => {
        const el = document.getElementById(`ap-${k}`);
        if (el) state.actionPlan[k] = el.value;
    });
    await saveState();
    checkLabReady(6); // Lab 6 completion depends on the Action Plan
}
  
  function refreshActionPlanPreview(){
    saveActionPlan();
    const ap=state.actionPlan||{};
    const user=currentUser;
    const labels={problem:'Problem Definition',data:'Data Plan',analysis:'Analysis Plan',intervention:'Intervention Design',measure:'Measurement Framework'};
    const html=Object.entries(labels).map(([k,label])=>`
      <div style="margin-bottom:16px;padding:14px;background:#fff;border-radius:8px;border-left:4px solid var(--blue)">
        <div style="font-size:10.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--blue);margin-bottom:6px">${label}</div>
        <div style="white-space:pre-wrap;font-size:12.5px;color:var(--text-mid)">${ap[k]||'<em style="color:var(--text-light)">Not completed yet</em>'}</div>
      </div>`).join('');
    const el=document.getElementById('full-plan-preview');
    if(el)el.innerHTML=`<div style="font-size:11px;color:var(--text-light);margin-bottom:14px">Data Champion: ${user?.name||'—'} · ${user?.role||''} · ${user?.faculty||''} · Generated: ${new Date().toLocaleDateString('en-ZA')}</div>`+html;
  }
  
  // ── Lab task state helpers ────────────────
  function labTaskDone(uid,ti){ return (state.labTasks?.[uid]||[]).includes(ti); }
  function labTaskAnswer(uid,ti){ return state.labAnswers?.[uid]?.[ti]||''; }
// Inside platform/js/modules/lab.js

async function toggleLabTask(uid, ti) {
  triggerLabInProgress(uid)
  if (!state.labTasks) state.labTasks = {};
  if (!state.labTasks[uid]) state.labTasks[uid] = [];
  
  const idx = state.labTasks[uid].indexOf(ti);
  if (idx === -1) {
      state.labTasks[uid].push(ti);
  } else {
      state.labTasks[uid].splice(idx, 1);
  }
  
  await saveState(); 
  
  const el = document.getElementById(`l${uid}t${ti}`);
  if (el) el.classList.toggle('completed-task', state.labTasks[uid].includes(ti));
  
  checkLabReady(uid);
  
  if (typeof checkUnitReady === 'function') {
      checkUnitReady(uid);
  }
}

async function saveLabTaskAnswer(uid, ti, val) {
  triggerLabInProgress(uid);
  if (!state.labAnswers) state.labAnswers = {};
  if (!state.labAnswers[uid]) state.labAnswers[uid] = {};
  state.labAnswers[uid][ti] = val;
  await saveState();
  
  // Evaluate if this specific text entry qualifies the lab to be complete
  checkLabReady(uid);
}
  


  function checkLabReady(uid) {
    const btn = document.getElementById(`lab-complete-btn-${uid}`);
    if (!btn || labDone(uid)) return;
  
    let isReady = false;
    let progressText = "";
  
    // Dynamic logic depending on which lab is loaded
    if (uid === 1) {
        // Lab 1: Requires 4 tasks to be checked off
        const completed = (state.labTasks?.[1] || []).length;
        isReady = completed >= 4;
        progressText = `${completed}/4 Tasks`;
        
    } else if (uid === 2) {
        // Lab 2: Requires 3 tasks to be checked off
        const completed = (state.labTasks?.[2] || []).length;
        isReady = completed >= 3;
        progressText = `${completed}/3 Tasks`;
        
    } else if (uid === 3) {
        // Lab 3: Relies on filling out the SCQA text areas (4 fields total)
        const scqa = state.scqa || {};
        // Check if fields exist and have at least a few characters typed
        const filled = ['s', 'c', 'q', 'a'].filter(k => (scqa[k] || '').trim().length > 5).length;
        isReady = filled >= 4;
        progressText = `${filled}/4 SCQA Fields`;
        
    } else if (uid === 4) {
        // Lab 4: Requires 3 text-based responses (Tasks 0, 1, and the final reflection)
        const ans = state.labAnswers?.[4] || {};
        const filled = [0, 1, 2].filter(k => (ans[k] || '').trim().length > 5).length;
        isReady = filled >= 3;
        progressText = `${filled}/3 Tasks`;
        
    } else if (uid === 5) {
        // Lab 5: Requires the Ethics Decision Record to be filled (3 fields)
        const rec = state.ethicsRecord || {};
        const filled = ['issue', 'principles', 'decision'].filter(k => (rec[k] || '').trim().length > 5).length;
        isReady = filled >= 3;
        progressText = `${filled}/3 Record Fields`;
        
    } else if (uid === 6) {
        // Lab 6: 90 Day Action Plan (5 fields)
        const ap = state.actionPlan || {};
        const filled = ['problem', 'data', 'analysis', 'intervention', 'measure'].filter(k => (ap[k] || '').trim().length > 5).length;
        isReady = filled >= 5;
        progressText = `${filled}/5 Plan Sections`;
    }
  
    // Apply UI changes to the completion button
    if (isReady) {
        btn.disabled = false;
        btn.innerHTML = '🏁 Mark Lab Complete (+75 XP)';
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
    } else {
        btn.disabled = true;
        btn.innerHTML = `Complete Work to Finish (${progressText})`;
        btn.style.opacity = '0.5';
        btn.style.cursor = 'not-allowed';
    }
  }