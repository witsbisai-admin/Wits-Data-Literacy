// /js/modules/admin.js

let _adminTarget = 'overview';
let _adminUserTarget = null;

async function showAdminView(tab){
  _adminTarget = tab;
  
  // Fetch real data from Supabase
  const { data: allStudentData, error } = await _supabase
    .from('student_progress')
    .select('*');

  if (error) {
    showToast("Error fetching admin data: " + error.message);
    return;
  }

  // Map database rows to UI format
  window.currentAdminData = allStudentData.map(row => ({
    ...row,
    units: (row.progress_data?.completedUnits || []).length,
    quizzes: (row.progress_data?.passedQuizzes || []).length,
    labs: (row.progress_data?.completedLabs || []).length,
    xp: row.progress_data?.xp || 0,
    pct: Math.round((((row.progress_data?.completedUnits || []).length + (row.progress_data?.passedQuizzes || []).length) / 12) * 100),
    complete: (row.progress_data?.completedUnits || []).length === 6 && (row.progress_data?.passedQuizzes || []).length === 6,
    name: row.full_name || "Unknown",
    email: row.user_email || "N/A",
    faculty: row.faculty || "N/A",
    quizScores: row.progress_data?.quizScores || {}
  }));

  // Update UI Views
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  document.getElementById('view-admin').classList.add('active');
  document.querySelectorAll('.nav-item,.admin-nav-item').forEach(n=>n.classList.remove('active'));
  document.getElementById('nav-admin-'+tab)?.classList.add('active');
  
  if(tab==='overview') renderAdminOverview();
  if(tab==='users')    renderAdminUsers();
  if(tab==='progress') renderAdminProgress();
}

function getAdminStats(){
  const users = window.currentAdminData || [];
  const learners = users.filter(u => u.user_id !== currentUser.id); // Hide admin
  
  return {
    total:      learners.length,
    active:     learners.filter(u => u.pct > 0).length,
    completed:  learners.filter(u => u.complete).length,
    avgPct:     learners.length ? Math.round(learners.reduce((s, u) => s + u.pct, 0) / learners.length) : 0,
    byUnit:     [1, 2, 3, 4, 5, 6].map(n => ({ n, done: learners.filter(u => u.units >= n).length })),
    faculties:  [...new Set(learners.map(u => u.faculty || 'Unknown'))]
      .map(f => ({ f, count: learners.filter(u => (u.faculty || 'Unknown') === f).length }))
      .sort((a, b) => b.count - a.count).slice(0, 6)
  };
}

function renderAdminOverview(){
  const users = window.currentAdminData || []; 
  const s = getAdminStats();
  const el = document.getElementById('admin-view-overview');
  
  el.innerHTML = `
    <div class="admin-header-bar animate-in">
      <div class="admin-tag">ADMINISTRATOR DASHBOARD</div>
      <h1>Platform Overview</h1>
      <p>Real-time enrolment, completion, and engagement data — ${new Date().toLocaleDateString('en-ZA',{day:'numeric',month:'long',year:'numeric'})}</p>
    </div>

    <div class="admin-kpi-grid">
      <div class="kpi-card purple">
        <div class="kpi-num" style="color:#7C3AED">${s.total}</div>
        <div class="kpi-label">Total Enrolled</div>
        <div class="kpi-delta neutral">All registered learners</div>
      </div>
      <div class="kpi-card blue">
        <div class="kpi-num" style="color:var(--blue)">${s.active}</div>
        <div class="kpi-label">Active Learners</div>
        <div class="kpi-delta ${s.active>0?'up':'neutral'}">${s.total?Math.round(s.active/s.total*100):0}% engagement rate</div>
      </div>
      <div class="kpi-card green">
        <div class="kpi-num" style="color:var(--green)">${s.completed}</div>
        <div class="kpi-label">Completed Programme</div>
        <div class="kpi-delta ${s.completed>0?'up':'neutral'}">${s.total?Math.round(s.completed/s.total*100):0}% completion rate</div>
      </div>
      <div class="kpi-card gold">
        <div class="kpi-num" style="color:var(--amber)">${s.avgPct}%</div>
        <div class="kpi-label">Avg Progress</div>
        <div class="kpi-delta neutral">Across all learners</div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-bottom:22px">
      <div class="admin-table-wrap">
        <div class="admin-table-header"><h3>📊 Unit Completion Rates</h3></div>
        <div style="padding:18px 20px">
          <div class="bar-chart">
            ${s.byUnit.map(u=>{
              const pct2 = s.total ? Math.round(u.done/s.total*100) : 0;
              return `<div class="bar-row">
                <div class="bar-label">Unit ${u.n}</div>
                <div class="bar-track">
                  <div class="bar-fill" style="width:${pct2}%;background:linear-gradient(to right,${pct2>79?'var(--green)':pct2>49?'var(--gold)':'var(--blue)'},${pct2>79?'#4ade80':pct2>49?'var(--gold-light)':'#0077AA'})">
                    <span>${pct2}%</span>
                  </div>
                </div>
                <div class="bar-value">${u.done}/${s.total}</div>
              </div>`;
            }).join('')}
          </div>
        </div>
      </div>

      <div class="admin-table-wrap">
        <div class="admin-table-header"><h3>🏛️ Enrolment by Faculty</h3></div>
        <div style="padding:18px 20px">
          ${s.faculties.length ? `<div class="bar-chart">
            ${s.faculties.map((f,i)=>{
              const pct2=s.total?Math.round(f.count/s.total*100):0;
              const colors=['var(--blue)','#7C3AED','var(--green)','var(--amber)','#0891B2','#DC2626'];
              return `<div class="bar-row">
                <div class="bar-label" style="font-size:11px">${f.f.replace('Faculty of ','').substring(0,18)}</div>
                <div class="bar-track">
                  <div class="bar-fill" style="width:${pct2}%;background:${colors[i%colors.length]}">
                    <span>${pct2}%</span></div>
                </div>
                <div class="bar-value">${f.count}</div>
              </div>`;
            }).join('')}
          </div>` : '<p style="color:var(--text-light);font-size:13px;text-align:center;padding:20px">No learner data yet</p>'}
        </div>
      </div>
    </div>

    <div class="admin-table-wrap">
      <div class="admin-table-header">
        <h3>👥 Recent Learner Activity</h3>
        <button class="admin-btn admin-btn-blue" onclick="showAdminView('users')">View All Users →</button>
      </div>
      <table class="admin-tbl">
        <thead><tr><th>Name</th><th>Faculty</th><th>Progress</th><th>Units</th><th>Quizzes</th><th>XP</th><th>Status</th></tr></thead>
        <tbody>
          ${(window.currentAdminData||[]).slice(0,8).map(u=>`
            <tr>
              <td><strong>${u.name||'—'}</strong><br><span style="font-size:10.5px;color:var(--text-light)">${u.email}</span></td>
              <td style="font-size:12px">${(u.faculty||'—').replace('Faculty of ','')}</td>
              <td><div class="progress-pill">
                <div class="progress-pill-bar"><div class="progress-pill-fill ${u.pct>=100?'full':''}" style="width:${u.pct}%"></div></div>
                <span style="font-size:11px;color:var(--text-mid)">${u.pct}%</span>
              </div></td>
              <td>${u.units}/6</td>
              <td>${u.quizzes}/6</td>
              <td><span style="color:var(--amber);font-weight:600">⭐ ${u.xp}</span></td>
              <td><span class="status-pill ${u.complete?'sp-complete':u.pct>0?'sp-active':'sp-inactive'}">${u.complete?'Completed':u.pct>0?'In Progress':'Not Started'}</span></td>
            </tr>`).join('') || '<tr><td colspan="7" style="text-align:center;color:var(--text-light);padding:24px">No learners enrolled yet.</td></tr>'}
        </tbody>
      </table>
    </div>`;
}

function renderAdminUsers(filter=''){
  const el = document.getElementById('admin-view-users');
  const allUsers = window.currentAdminData || [];
  const users = filter ? allUsers.filter(u=>
    (u.name||'').toLowerCase().includes(filter.toLowerCase()) ||
    (u.email||'').toLowerCase().includes(filter.toLowerCase()) ||
    (u.faculty||'').toLowerCase().includes(filter.toLowerCase())
  ) : allUsers;

  el.innerHTML = `
    <div class="admin-header-bar animate-in">
      <div class="admin-tag">USER MANAGEMENT</div>
      <h1>Learner Accounts</h1>
      <p>${allUsers.length} registered learner${allUsers.length!==1?'s':''} · ${allUsers.filter(u=>u.complete).length} completed</p>
    </div>
    <div class="admin-table-wrap">
      <div class="admin-table-header">
        <h3>All Learners (${users.length})</h3>
        <div class="admin-table-actions">
          <input class="admin-search" placeholder="🔍 Search name, email..." oninput="renderAdminUsers(this.value)" value="${filter}">
        </div>
      </div>
      <table class="admin-tbl">
        <thead><tr><th>Name</th><th>Email</th><th>Role / Faculty</th><th>Progress</th><th>Quizzes</th><th>XP</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          ${users.length ? users.map(u=>`
          <tr>
            <td><strong>${u.name||'—'}</strong></td>
            <td style="font-size:11.5px">${u.email}</td>
            <td style="font-size:11.5px">${u.role||'—'}<br><span style="color:var(--text-light)">${(u.faculty||'—').replace('Faculty of ','')}</span></td>
            <td><div class="progress-pill">
              <div class="progress-pill-bar"><div class="progress-pill-fill ${u.pct>=100?'full':''}" style="width:${u.pct}%"></div></div>
              <span style="font-size:11px">${u.pct}%</span>
            </div></td>
            <td>${u.quizzes}/6 ${u.quizzes===6?'✅':''}</td>
            <td><span style="color:var(--amber);font-weight:600">⭐ ${u.xp}</span></td>
            <td><span class="status-pill ${u.complete?'sp-complete':u.pct>0?'sp-active':'sp-inactive'}">${u.complete?'Completed':u.pct>0?'In Progress':'Not Started'}</span></td>
            <td>
              <div style="display:flex;gap:5px;flex-wrap:wrap">
                <button class="admin-btn admin-btn-purple" onclick="openAdminResetModal('${u.email}','${(u.name||'').replace(/'/g,"\'")}')">🔑 Reset PW</button>
                <button class="admin-btn admin-btn-red" onclick="openAdminDeleteModal('${u.email}','${(u.name||'').replace(/'/g,"\'")}')">🗑 Delete</button>
              </div>
            </td>
          </tr>`).join('')
          : '<tr><td colspan="8" style="text-align:center;color:var(--text-light);padding:24px">No learners found.</td></tr>'}
        </tbody>
      </table>
    </div>`;
}

function renderAdminProgress(){
  const users = window.currentAdminData || [];
  const el = document.getElementById('admin-view-progress');
  const UNIT_NAMES = ['Foundations of Data Literacy','Student Data Landscape','Analysis & Visualisation','Predictive Modelling','Ethics & Governance','Insight to Intervention'];

  el.innerHTML = `
    <div class="admin-header-bar animate-in">
      <div class="admin-tag">PROGRESS REPORTS</div>
      <h1>Detailed Learning Analytics</h1>
      <p>Per-unit completion rates, quiz scores, and lab progress across all learners</p>
    </div>

    <div class="admin-table-wrap" style="margin-bottom:20px">
      <div class="admin-table-header"><h3>📋 Per-Unit Completion Detail</h3></div>
      <table class="admin-tbl">
        <thead><tr><th>Unit</th><th>Title</th><th>Content Done</th><th>Quiz Passed</th><th>Lab Done</th><th>All 3 Done</th></tr></thead>
        <tbody>
          ${[1,2,3,4,5,6].map(n=>{
            const unitDone  = users.filter(u => (u.progress_data?.completedUnits||[]).includes(n)).length;
            const quizDone  = users.filter(u => (u.progress_data?.passedQuizzes||[]).includes(n)).length;
            const labDone   = users.filter(u => (u.progress_data?.completedLabs||[]).includes(n)).length;
            const allThree  = users.filter(u => (u.progress_data?.completedUnits||[]).includes(n) && (u.progress_data?.passedQuizzes||[]).includes(n) && (u.progress_data?.completedLabs||[]).includes(n)).length;
            const pctU=users.length?Math.round(unitDone/users.length*100):0;
            const pctQ=users.length?Math.round(quizDone/users.length*100):0;
            const pctL=users.length?Math.round(labDone/users.length*100):0;
            const pctA=users.length?Math.round(allThree/users.length*100):0;
            return `<tr>
              <td><strong>Unit ${n}</strong></td>
              <td style="font-size:12px">${UNIT_NAMES[n-1]}</td>
              <td><div class="progress-pill"><div class="progress-pill-bar"><div class="progress-pill-fill ${pctU>=100?'full':''}" style="width:${pctU}%"></div></div><span style="font-size:11px">${unitDone}/${users.length} (${pctU}%)</span></div></td>
              <td><div class="progress-pill"><div class="progress-pill-bar"><div class="progress-pill-fill ${pctQ>=100?'full':''}" style="width:${pctQ}%"></div></div><span style="font-size:11px">${quizDone}/${users.length} (${pctQ}%)</span></div></td>
              <td><div class="progress-pill"><div class="progress-pill-bar"><div class="progress-pill-fill ${pctL>=100?'full':''}" style="width:${pctL}%"></div></div><span style="font-size:11px">${labDone}/${users.length} (${pctL}%)</span></div></td>
              <td><span class="status-pill ${pctA===100?'sp-complete':pctA>0?'sp-active':'sp-inactive'}">${allThree}/${users.length} (${pctA}%)</span></td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>

    <div class="admin-table-wrap">
      <div class="admin-table-header"><h3>🎯 Quiz Score Breakdown</h3></div>
      <table class="admin-tbl">
        <thead><tr><th>Name</th><th>U1</th><th>U2</th><th>U3</th><th>U4</th><th>U5</th><th>U6</th><th>Avg Score</th><th>Certificate</th></tr></thead>
        <tbody>
          ${users.map(u=>{
            const qs = u.quizScores||{};
            const qMax = {1:8,2:7,3:7,4:7,5:6,6:6};
            const scores = [1,2,3,4,5,6].map(n=>qs[n]!==undefined?`${qs[n]}/${qMax[n]}`:'—');
            const avgArr = [1,2,3,4,5,6].filter(n=>qs[n]!==undefined).map(n=>Math.round(qs[n]/qMax[n]*100));
            const avg = avgArr.length ? Math.round(avgArr.reduce((a,b)=>a+b,0)/avgArr.length) : null;
            return `<tr>
              <td><strong>${u.name||'—'}</strong></td>
              ${scores.map(s=>`<td style="text-align:center;font-size:12px;color:${s==='—'?'var(--text-light)':parseInt(s)>=Math.ceil(parseInt(s.split('/')[1])*0.7)?'var(--green)':'var(--red)'}">${s}</td>`).join('')}
              <td style="text-align:center"><strong style="color:${avg===null?'var(--text-light)':avg>=70?'var(--green)':'var(--red)'}">${avg!==null?avg+'%':'—'}</strong></td>
              <td style="text-align:center">${u.complete?'<span class="status-pill sp-complete">Ready 🏆</span>':'<span class="status-pill sp-inactive">Not yet</span>'}</td>
            </tr>`;
          }).join('') || '<tr><td colspan="9" style="text-align:center;color:var(--text-light);padding:24px">No quiz data yet.</td></tr>'}
        </tbody>
      </table>
    </div>`;
}

function openAdminResetModal(email, name){
  _adminUserTarget = email;
  document.getElementById('reset-user-name').textContent = name + ' (' + email + ')';
  document.getElementById('new-pass-input').value='';
  document.getElementById('new-pass-confirm').value='';
  document.getElementById('reset-pass-err').style.display='none';
  document.getElementById('reset-pass-ok').classList.remove('show');
  document.getElementById('admin-reset-modal').classList.add('show');
}

async function confirmAdminPasswordReset(){
  const newPass = document.getElementById('new-pass-input').value;
  const confirm = document.getElementById('new-pass-confirm').value;
  const err = document.getElementById('reset-pass-err');
  if(newPass.length < 6 || newPass !== confirm){
    err.textContent='Passwords do not match or are too short (min 6 chars).';
    err.style.display='block';
    setTimeout(()=>err.style.display='none',3000);
    return;
  }
  document.getElementById('reset-pass-ok').textContent = '⚠️ Password reset requires Stage 3 setup.';
  document.getElementById('reset-pass-ok').classList.add('show');
  setTimeout(()=>closeAdminModal(), 2000);
}

function openAdminDeleteModal(email, name){
  _adminUserTarget = email;
  document.getElementById('delete-user-name').textContent = name + ' (' + email + ')';
  document.getElementById('admin-delete-modal').classList.add('show');
}

async function confirmAdminDelete(){
  closeAdminModal();
  showToast('⚠️ Account deletion requires Stage 3 setup.');
}

function closeAdminModal(){
  document.querySelectorAll('.modal-overlay').forEach(m=>m.classList.remove('show'));
  _adminUserTarget = null;
}

// Close modals on overlay click
document.addEventListener('click', e=>{
  if(e.target.classList.contains('modal-overlay')) closeAdminModal();
});