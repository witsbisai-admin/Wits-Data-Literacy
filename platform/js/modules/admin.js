// /js/modules/admin.js
// ══════════════════════════════════════════════════════════════
//  ADMIN MODULE — READ ONLY
//  - is_admin checked from student_progress table
//  - Non-admins are blocked with a toast and redirected
//  - User management (delete/reset) is handled via Supabase dashboard
// ══════════════════════════════════════════════════════════════

let _adminTarget = 'overview';


// ══════════════════════════════════════════════════════════════
//  ADMIN GUARD  — verifies is_admin before rendering anything
// ══════════════════════════════════════════════════════════════
async function checkAdminAccess() {
  if (!currentUser) {
    showToast('⛔ You must be logged in.');
    return false;
  }

  const { data, error } = await _supabase
    .from('student_progress')
    .select('is_admin')
    .eq('user_id', currentUser.id)
    .single();

  if (error || !data?.is_admin) {
    showToast('⛔ Access denied. Admin privileges required.');
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById('view-dashboard')?.classList.add('active');
    return false;
  }

  return true;
}


// ══════════════════════════════════════════════════════════════
//  SHOW ADMIN VIEW
// ══════════════════════════════════════════════════════════════
async function showAdminView(tab) {
  const isAdmin = await checkAdminAccess();
  if (!isAdmin) return;

  _adminTarget = tab;

  const { data: allStudentData, error } = await _supabase
    .from('student_progress')
    .select('*');

  if (error) {
    showToast('Error fetching admin data: ' + error.message);
    return;
  }

  window.currentAdminData = allStudentData.map(row => ({
    ...row,
    units:      (row.progress_data?.completedUnits  || []).length,
    quizzes:    (row.progress_data?.passedQuizzes    || []).length,
    labs:       (row.progress_data?.completedLabs    || []).length,
    xp:         row.progress_data?.xp || 0,
    pct:        Math.round(
                  (((row.progress_data?.completedUnits || []).length +
                    (row.progress_data?.passedQuizzes  || []).length) / 12) * 100
                ),
    complete:   (row.progress_data?.completedUnits || []).length === 6 &&
                (row.progress_data?.passedQuizzes  || []).length === 6,
    name:       row.full_name   || 'Unknown',
    email:      row.user_email  || 'N/A',
    faculty:    row.faculty     || 'N/A',
    quizScores: row.progress_data?.quizScores || {}
  }));

  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('view-admin').classList.add('active');

  document.querySelectorAll('.admin-view').forEach(v => v.classList.remove('active'));
  document.getElementById('admin-view-' + tab)?.classList.add('active');

  document.querySelectorAll('.nav-item,.admin-nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('nav-admin-' + tab)?.classList.add('active');

  if (tab === 'overview') renderAdminOverview();
  if (tab === 'users')    renderAdminUsers();
  if (tab === 'progress') renderAdminProgress();
}


// ══════════════════════════════════════════════════════════════
//  STATS HELPER
// ══════════════════════════════════════════════════════════════
function getAdminStats() {
  const users    = window.currentAdminData || [];
  const learners = users.filter(u => u.user_id !== currentUser?.id && !u.is_admin);

  const total     = learners.length;
  const completed = learners.filter(u => u.complete).length;
  const avgPct    = total ? Math.round(learners.reduce((s, u) => s + u.pct, 0) / total) : 0;
  const totalXP   = learners.reduce((s, u) => s + (u.xp || 0), 0);

  const qMax = { 1:8, 2:7, 3:7, 4:7, 5:6, 6:6 };
  let totalScorePoints = 0, totalPossiblePoints = 0;
  learners.forEach(u => {
    const qs = u.quizScores || {};
    Object.keys(qs).forEach(unit => {
      totalScorePoints    += qs[unit];
      totalPossiblePoints += qMax[unit];
    });
  });
  const avgQuizScore       = totalPossiblePoints ? Math.round((totalScorePoints / totalPossiblePoints) * 100) : 0;
  const totalLabsCompleted = learners.reduce((s, u) => s + u.labs, 0);

  return {
    total, completed, avgPct, totalXP, avgQuizScore, totalLabsCompleted,
    byUnit: [1,2,3,4,5,6].map(n => ({
      n, done: learners.filter(u => u.units >= n).length
    })),
    faculties: [...new Set(learners.map(u => u.faculty || 'Unknown'))]
      .map(f => ({ f, count: learners.filter(u => (u.faculty || 'Unknown') === f).length }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6)
  };
}


// ══════════════════════════════════════════════════════════════
//  RENDER — OVERVIEW
// ══════════════════════════════════════════════════════════════
function renderAdminOverview() {
  const s  = getAdminStats();
  const el = document.getElementById('admin-view-overview');

  el.innerHTML = `
    <div class="admin-header-bar animate-in">
      <div class="admin-tag">ADMINISTRATOR DASHBOARD</div>
      <h1>Platform Overview</h1>
      <p>Real-time enrolment, completion, and competency data —
        ${new Date().toLocaleDateString('en-ZA', { day:'numeric', month:'long', year:'numeric' })}</p>
    </div>

    <div class="admin-kpi-grid" style="grid-template-columns:repeat(3,1fr)">
      <div class="kpi-card purple">
        <div class="kpi-num" style="color:#7C3AED">${s.total}</div>
        <div class="kpi-label">Total Enrolled Learners</div>
        <div class="kpi-delta neutral">Target audience</div>
      </div>
      <div class="kpi-card green">
        <div class="kpi-num" style="color:var(--green)">${s.completed}</div>
        <div class="kpi-label">Fully Certified</div>
        <div class="kpi-delta ${s.completed > 0 ? 'up' : 'neutral'}">
          ${s.total ? Math.round(s.completed / s.total * 100) : 0}% completion rate
        </div>
      </div>
      <div class="kpi-card blue">
        <div class="kpi-num" style="color:var(--blue)">${s.avgQuizScore}%</div>
        <div class="kpi-label">Avg Cohort Quiz Score</div>
        <div class="kpi-delta ${s.avgQuizScore >= 70 ? 'up' : 'down'}">Target: 70% Minimum</div>
      </div>
      <div class="kpi-card gold">
        <div class="kpi-num" style="color:var(--amber)">${s.avgPct}%</div>
        <div class="kpi-label">Average Curriculum Progress</div>
        <div class="kpi-delta neutral">Across active cohort</div>
      </div>
      <div class="kpi-card" style="border-top:3px solid #0891B2">
        <div class="kpi-num" style="color:#0891B2">${s.totalLabsCompleted}</div>
        <div class="kpi-label">Total Interactive Labs Done</div>
        <div class="kpi-delta up">Practical competency applied</div>
      </div>
      <div class="kpi-card" style="border-top:3px solid #F59E0B">
        <div class="kpi-num" style="color:#F59E0B">${s.totalXP}</div>
        <div class="kpi-label">Total Platform XP Earned</div>
        <div class="kpi-delta up">Platform engagement metric</div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-bottom:22px">
      <div class="admin-table-wrap">
        <div class="admin-table-header"><h3>📊 Unit Completion Rates</h3></div>
        <div style="padding:18px 20px">
          <div class="bar-chart">
            ${s.byUnit.map(u => {
              const pct2 = s.total ? Math.round(u.done / s.total * 100) : 0;
              const color = pct2 > 79
                ? 'linear-gradient(to right,var(--green),#4ade80)'
                : pct2 > 49
                  ? 'linear-gradient(to right,var(--gold),var(--gold-light))'
                  : 'linear-gradient(to right,var(--blue),#0077AA)';
              return `<div class="bar-row">
                <div class="bar-label">Unit ${u.n}</div>
                <div class="bar-track">
                  <div class="bar-fill" style="width:${pct2}%;background:${color}">
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
          ${s.faculties.length
            ? `<div class="bar-chart">
                ${s.faculties.map((f, i) => {
                  const pct2   = s.total ? Math.round(f.count / s.total * 100) : 0;
                  const colors = ['var(--blue)','#7C3AED','var(--green)','var(--amber)','#0891B2','#DC2626'];
                  return `<div class="bar-row">
                    <div class="bar-label" style="font-size:11px">
                      ${f.f.replace('Faculty of ','').substring(0, 18)}
                    </div>
                    <div class="bar-track">
                      <div class="bar-fill" style="width:${pct2}%;background:${colors[i % colors.length]}">
                        <span>${pct2}%</span>
                      </div>
                    </div>
                    <div class="bar-value">${f.count}</div>
                  </div>`;
                }).join('')}
              </div>`
            : '<p style="color:var(--text-light);font-size:13px;text-align:center;padding:20px">No learner data yet</p>'}
        </div>
      </div>
    </div>

    <div class="admin-table-wrap">
      <div class="admin-table-header">
        <h3>👥 Recent Learner Activity</h3>
        <button class="admin-btn admin-btn-blue" onclick="showAdminView('users')">View All Users →</button>
      </div>
      <table class="admin-tbl">
        <thead>
          <tr>
            <th>Name</th><th>Faculty</th><th>Progress</th>
            <th>Units</th><th>Labs</th><th>XP</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${(window.currentAdminData || [])
            .filter(u => !u.is_admin)
            .slice(0, 8)
            .map(u => `
              <tr>
                <td>
                  <strong>${u.name || '—'}</strong><br>
                  <span style="font-size:10.5px;color:var(--text-light)">${u.email}</span>
                </td>
                <td style="font-size:12px">${(u.faculty || '—').replace('Faculty of ','')}</td>
                <td>
                  <div class="progress-pill">
                    <div class="progress-pill-bar">
                      <div class="progress-pill-fill ${u.pct >= 100 ? 'full' : ''}"
                        style="width:${u.pct}%"></div>
                    </div>
                    <span style="font-size:11px;color:var(--text-mid)">${u.pct}%</span>
                  </div>
                </td>
                <td>${u.units}/6</td>
                <td>${u.labs}/6</td>
                <td><span style="color:var(--amber);font-weight:600">⭐ ${u.xp}</span></td>
                <td>
                  <span class="status-pill ${u.complete ? 'sp-complete' : u.pct > 0 ? 'sp-active' : 'sp-inactive'}">
                    ${u.complete ? 'Completed' : u.pct > 0 ? 'In Progress' : 'Not Started'}
                  </span>
                </td>
              </tr>`)
            .join('') ||
            '<tr><td colspan="7" style="text-align:center;color:var(--text-light);padding:24px">No learners enrolled yet.</td></tr>'}
        </tbody>
      </table>
    </div>`;
}


// ══════════════════════════════════════════════════════════════
//  RENDER — USERS
// ══════════════════════════════════════════════════════════════
function renderAdminUsers(filter = '') {
  const el       = document.getElementById('admin-view-users');
  const allUsers = (window.currentAdminData || []).filter(u => !u.is_admin);
  const users    = filter
    ? allUsers.filter(u =>
        (u.name   || '').toLowerCase().includes(filter.toLowerCase()) ||
        (u.email  || '').toLowerCase().includes(filter.toLowerCase()) ||
        (u.faculty|| '').toLowerCase().includes(filter.toLowerCase())
      )
    : allUsers;

  el.innerHTML = `
    <div class="admin-header-bar animate-in">
      <div class="admin-tag">USER MANAGEMENT</div>
      <h1>Learner Accounts</h1>
      <p>${allUsers.length} registered learner${allUsers.length !== 1 ? 's' : ''}
        · ${allUsers.filter(u => u.complete).length} completed</p>
    </div>

    <div class="admin-table-wrap">
      <div class="admin-table-header">
        <h3>All Learners (${users.length})</h3>
        <div class="admin-table-actions">
          <input
            class="admin-search"
            placeholder="🔍 Search name, email, faculty..."
            oninput="renderAdminUsers(this.value)"
            value="${filter}">
        </div>
      </div>
      <table class="admin-tbl">
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Faculty</th>
            <th>Progress</th><th>Units</th><th>Quizzes</th><th>Labs</th><th>XP</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${users.length
            ? users.map(u => `
              <tr>
                <td><strong>${u.name || '—'}</strong></td>
                <td style="font-size:11.5px">${u.email}</td>
                <td style="font-size:11.5px">${(u.faculty || '—').replace('Faculty of ','')}</td>
                <td>
                  <div class="progress-pill">
                    <div class="progress-pill-bar">
                      <div class="progress-pill-fill ${u.pct >= 100 ? 'full' : ''}"
                        style="width:${u.pct}%"></div>
                    </div>
                    <span style="font-size:11px">${u.pct}%</span>
                  </div>
                </td>
                <td style="text-align:center">${u.units}/6</td>
                <td style="text-align:center">${u.quizzes}/6 ${u.quizzes === 6 ? '✅' : ''}</td>
                <td style="text-align:center">${u.labs}/6</td>
                <td><span style="color:var(--amber);font-weight:600">⭐ ${u.xp}</span></td>
                <td>
                  <span class="status-pill ${u.complete ? 'sp-complete' : u.pct > 0 ? 'sp-active' : 'sp-inactive'}">
                    ${u.complete ? 'Completed' : u.pct > 0 ? 'In Progress' : 'Not Started'}
                  </span>
                </td>
              </tr>`)
              .join('')
            : '<tr><td colspan="9" style="text-align:center;color:var(--text-light);padding:24px">No learners found.</td></tr>'}
        </tbody>
      </table>
    </div>`;
}


// ══════════════════════════════════════════════════════════════
//  RENDER — PROGRESS
// ══════════════════════════════════════════════════════════════
function renderAdminProgress() {
  const users = (window.currentAdminData || []).filter(u => !u.is_admin);
  const el    = document.getElementById('admin-view-progress');
  const UNIT_NAMES = [
    'Foundations of Data Literacy',
    'Student Data Landscape',
    'Analysis & Visualisation',
    'Predictive Modelling',
    'Ethics & Governance',
    'Insight to Intervention'
  ];
  const qMax = { 1:8, 2:7, 3:7, 4:7, 5:6, 6:6 };

  const pill = (val, tot, pct) => `
    <div class="progress-pill">
      <div class="progress-pill-bar">
        <div class="progress-pill-fill ${pct >= 100 ? 'full' : ''}" style="width:${pct}%"></div>
      </div>
      <span style="font-size:11px">${val}/${tot} (${pct}%)</span>
    </div>`;

  el.innerHTML = `
    <div class="admin-header-bar animate-in">
      <div class="admin-tag">PROGRESS REPORTS</div>
      <h1>Detailed Learning Analytics</h1>
      <p>Per-unit completion rates, quiz scores, and lab progress across all learners</p>
    </div>

    <div class="admin-table-wrap" style="margin-bottom:20px">
      <div class="admin-table-header"><h3>📋 Per-Unit Completion Detail</h3></div>
      <table class="admin-tbl">
        <thead>
          <tr>
            <th>Unit</th><th>Title</th>
            <th>Content Done</th><th>Quiz Passed</th><th>Lab Done</th><th>All 3 Done</th>
          </tr>
        </thead>
        <tbody>
          ${[1,2,3,4,5,6].map(n => {
            const tot      = users.length || 1;
            const unitDone = users.filter(u => (u.progress_data?.completedUnits || []).includes(n)).length;
            const quizDone = users.filter(u => (u.progress_data?.passedQuizzes  || []).includes(n)).length;
            const labDone  = users.filter(u => (u.progress_data?.completedLabs  || []).includes(n)).length;
            const allThree = users.filter(u =>
              (u.progress_data?.completedUnits || []).includes(n) &&
              (u.progress_data?.passedQuizzes  || []).includes(n) &&
              (u.progress_data?.completedLabs  || []).includes(n)
            ).length;
            const pctU = Math.round(unitDone / tot * 100);
            const pctQ = Math.round(quizDone / tot * 100);
            const pctL = Math.round(labDone  / tot * 100);
            const pctA = Math.round(allThree / tot * 100);
            return `<tr>
              <td><strong>Unit ${n}</strong></td>
              <td style="font-size:12px">${UNIT_NAMES[n - 1]}</td>
              <td>${pill(unitDone, users.length, pctU)}</td>
              <td>${pill(quizDone, users.length, pctQ)}</td>
              <td>${pill(labDone,  users.length, pctL)}</td>
              <td>
                <span class="status-pill ${pctA === 100 ? 'sp-complete' : pctA > 0 ? 'sp-active' : 'sp-inactive'}">
                  ${allThree}/${users.length} (${pctA}%)
                </span>
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>

    <div class="admin-table-wrap">
      <div class="admin-table-header"><h3>🎯 Quiz Score Breakdown</h3></div>
      <table class="admin-tbl">
        <thead>
          <tr>
            <th>Name</th><th>U1</th><th>U2</th><th>U3</th><th>U4</th><th>U5</th><th>U6</th>
            <th>Avg Score</th><th>Certificate</th>
          </tr>
        </thead>
        <tbody>
          ${users.length
            ? users.map(u => {
                const qs     = u.quizScores || {};
                const scores = [1,2,3,4,5,6].map(n =>
                  qs[n] !== undefined ? `${qs[n]}/${qMax[n]}` : '—'
                );
                const avgArr = [1,2,3,4,5,6]
                  .filter(n => qs[n] !== undefined)
                  .map(n => Math.round(qs[n] / qMax[n] * 100));
                const avg = avgArr.length
                  ? Math.round(avgArr.reduce((a, b) => a + b, 0) / avgArr.length)
                  : null;
                return `<tr>
                  <td><strong>${u.name || '—'}</strong></td>
                  ${scores.map(s => {
                    const isPassing = s !== '—' &&
                      parseInt(s) >= Math.ceil(parseInt(s.split('/')[1]) * 0.7);
                    const col = s === '—'
                      ? 'var(--text-light)'
                      : isPassing ? 'var(--green)' : 'var(--red)';
                    return `<td style="text-align:center;font-size:12px;color:${col}">${s}</td>`;
                  }).join('')}
                  <td style="text-align:center">
                    <strong style="color:${avg === null
                      ? 'var(--text-light)'
                      : avg >= 70 ? 'var(--green)' : 'var(--red)'}">
                      ${avg !== null ? avg + '%' : '—'}
                    </strong>
                  </td>
                  <td style="text-align:center">
                    ${u.complete
                      ? '<span class="status-pill sp-complete">Ready 🏆</span>'
                      : '<span class="status-pill sp-inactive">Not yet</span>'}
                  </td>
                </tr>`;
              }).join('')
            : '<tr><td colspan="9" style="text-align:center;color:var(--text-light);padding:24px">No quiz data yet.</td></tr>'}
        </tbody>
      </table>
    </div>`;
}


// ══════════════════════════════════════════════════════════════
//  MODAL CLOSE HELPER (kept in case other modals exist in app)
// ══════════════════════════════════════════════════════════════
function closeAdminModal() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('show'));
}

document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) closeAdminModal();
});