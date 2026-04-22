// /js/modules/admin.js
// ══════════════════════════════════════════════════════════════
//  ADMIN MODULE — READ ONLY
//  - is_admin checked from student_progress table
//  - Non-admins are blocked with a toast and redirected
//  - User management (delete/reset) is handled via Supabase dashboard
// ══════════════════════════════════════════════════════════════

let _adminTarget = 'overview';
let _currentSortCol = null; // Tracks which column is being sorted (e.g., 'avg' or 1, 2, 3...)
let _currentSortDir = 1;    // 1 for ascending, -1 for descending


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
  try {
      const screenWidth = window.innerWidth;
      if (screenWidth <= 1024) {
          const hamburger = document.getElementById("bc-hamburger-id");
          const closeBtn = document.getElementById("bc-close-id");
          const sidebar = document.getElementById("sidebar-id");
          if (hamburger) hamburger.style.display = "block";
          if (closeBtn) closeBtn.style.display = "none";
          if (sidebar) sidebar.style.display = "none";
      }

      const isAdmin = await checkAdminAccess();
      if (!isAdmin) return;

      _adminTarget = tab;

      const { data: allStudentData, error } = await _supabase
          .from('student_progress')
          .select('*');

      if (error) {
          showToast('Error fetching admin data: ' + error.message);
          console.error("Supabase Admin Fetch Error:", error);
          return;
      }

      // 1. Safeguard against null data returns
      const safeData = allStudentData || [];

      // 2. Safeguard against missing/null progress_data objects
      window.currentAdminData = safeData.map(row => {
          const pd = row.progress_data || {}; 
          return {
              ...row,
              units: (pd.completedUnits || []).length,
              quizzes: (pd.passedQuizzes || []).length,
              labs: (pd.completedLabs || []).length,
              xp: pd.xp || 0,
              pct: Math.round(
                  (((pd.completedUnits || []).length +
                    (pd.passedQuizzes || []).length) / 12) * 100
              ) || 0,
              complete: (pd.completedUnits || []).length === 6 &&
                        (pd.passedQuizzes || []).length === 6,
              name: row.full_name || 'Unknown',
              email: row.user_email || 'N/A',
              faculty: row.faculty || 'N/A',
              quizScores: pd.quizScores || {}
          };
      });

      document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
      const adminView = document.getElementById('view-admin');
      if (adminView) adminView.classList.add('active');

      document.querySelectorAll('.admin-view').forEach(v => v.classList.remove('active'));
      const targetTab = document.getElementById('admin-view-' + tab);
      if (targetTab) targetTab.classList.add('active');

      document.querySelectorAll('.nav-item, .admin-nav-item').forEach(n => n.classList.remove('active'));
      const navTab = document.getElementById('nav-admin-' + tab);
      if (navTab) navTab.classList.add('active');

      if (tab === 'overview') renderAdminOverview();
      if (tab === 'users') renderAdminUsers();
      if (tab === 'progress') renderAdminProgress();
      if (tab === 'survey') renderAdminSurveyResults();

  } catch (err) {
      console.error("Admin view crash:", err);
      showToast("An error occurred loading the admin panel. Check the console.");
  }
}

// ══════════════════════════════════════════════════════════════
//  STATS HELPER & TIME ACTIVE HELPER
// ══════════════════════════════════════════════════════════════
function getAdminStats() {
  const users = window.currentAdminData || [];
  const learners = users.filter(u => u.user_id !== currentUser?.id && !u.is_admin);

  const total = learners.length;
  const completed = learners.filter(u => u.complete).length;
  const activeStudents = learners.filter(u => u.units > 0 || u.quizzes > 0 || u.xp > 0).length;
  const inactiveStudents = total - activeStudents;
  const avgPct = total ? Math.round(learners.reduce((s, u) => s + u.pct, 0) / total) : 0;

  // Lab completion rate for the KPI
  const totalLabsPossible = total * 6; 
  const totalLabsDone = learners.reduce((s, u) => s + u.labs, 0);
  const labCompletionRate = totalLabsPossible ? Math.round((totalLabsDone / totalLabsPossible) * 100) : 0;

  const qMax = { 1:8, 2:7, 3:7, 4:7, 5:6, 6:6 };
  let totalScorePoints = 0, totalPossiblePoints = 0;
  learners.forEach(u => {
    const qs = u.quizScores || {};
    Object.keys(qs).forEach(unit => {
      totalScorePoints    += qs[unit];
      totalPossiblePoints += qMax[unit];
    });
  });
  const avgQuizScore = totalPossiblePoints ? Math.round((totalScorePoints / totalPossiblePoints) * 100) : 0;

  return {
    total, completed, activeStudents, inactiveStudents, avgPct, avgQuizScore, 
    labCompletionRate,
    byUnit: [1,2,3,4,5,6].map(n => ({
      n, done: learners.filter(u => u.units >= n).length
    })),
    faculties: [...new Set(learners.map(u => u.faculty || 'Unknown'))]
      .map(f => ({ f, count: learners.filter(u => (u.faculty || 'Unknown') === f).length }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6)
  };
}

function getRelativeTime(dateString) {
  if (!dateString) return "No Activity";
  const now = new Date();
  const past = new Date(dateString);
  const diffInMs = now - past;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `Past ${diffInDays} days`;
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return `Last ${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''}`;
  
  const diffInMonths = Math.floor(diffInDays / 30);
  return `Last ${diffInMonths} month${diffInMonths > 1 ? 's' : ''}`;
}

function getSurveyStats() {
  const learners = window.currentAdminData.filter(u => !u.is_admin);
  const respondents = learners.filter(u => u.progress_data?.survey?.submitted);
  
  const wsAttended = respondents.filter(u => u.progress_data.survey.attended_workshop?.includes("Yes")).length;
  const champions = respondents.filter(u => u.progress_data.survey.keen_champion === "Yes").length;

  return {
      count: respondents.length,
      wsRate: respondents.length ? Math.round((wsAttended / respondents.length) * 100) : 0,
      championRate: respondents.length ? Math.round((champions / respondents.length) * 100) : 0
  };
}

// In showAdminView('survey-results')
function renderAdminSurveyResults() {
  const stats = getSurveyStats();
  const respondents = window.currentAdminData.filter(u => u.progress_data?.survey?.submitted);
  
  // HTML would include KPI cards for stats.avgQuality and stats.recRate
  // and a table listing respondents with a "View Full Response" button
}

// ══════════════════════════════════════════════════════════════
//  RENDER — OVERVIEW
// ══════════════════════════════════════════════════════════════
function renderAdminOverview() {
  const s = getAdminStats();
  const el = document.getElementById('admin-view-overview');
  
  // Format date as "7 April 2026"
  const longDate = new Date().toLocaleDateString('en-ZA', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  el.innerHTML = `
    <div class="admin-header-bar animate-in">
      <div class="admin-tag">ADMINISTRATOR DASHBOARD</div>
      <h1>Platform Overview</h1>
      <p>Real-time enrolment, completion, and competency data — ${longDate}</p>
    </div>

    <div class="admin-kpi-grid" style="grid-template-columns:repeat(3,1fr)">
      <div class="kpi-card purple">
        <div class="kpi-num" style="color:#7C3AED">${s.total}</div>
        <div class="kpi-label">Registered Students</div>
        <div class="kpi-delta neutral">Total accounts in database</div>
      </div>
      <div class="kpi-card blue">
        <div class="kpi-num" style="color:var(--blue)">${s.activeStudents}</div>
        <div class="kpi-label">Active Students</div>
        <div class="kpi-delta up">Engaged with platform content</div>
      </div>
      <div class="kpi-card gold">
        <div class="kpi-num" style="color:var(--amber)">${s.inactiveStudents}</div>
        <div class="kpi-label">Inactive Students</div>
        <div class="kpi-delta down">No progress recorded yet</div>
      </div>
      <div class="kpi-card green">
        <div class="kpi-num" style="color:var(--green)">${s.completed}</div>
        <div class="kpi-label">Fully Certified</div>
        <div class="kpi-delta up">${s.total ? Math.round(s.completed / s.total * 100) : 0}% completion rate</div>
      </div>
      <div class="kpi-card" style="border-top:3px solid #0891B2">
        <div class="kpi-num" style="color:#0891B2">${s.labCompletionRate}%</div>
        <div class="kpi-label">Lab Completion Rate</div>
        <div class="kpi-delta up">Practical competency applied</div>
      </div>
      <div class="kpi-card" style="border-top:3px solid #7C3AED">
        <div class="kpi-num" style="color:#7C3AED">${s.avgQuizScore}%</div>
        <div class="kpi-label">Avg Quiz Score</div>
        <div class="kpi-delta ${s.avgQuizScore >= 70 ? 'up' : 'down'}">Target: 70% Minimum</div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-bottom:22px">
      <div class="admin-table-wrap">
        <div class="admin-table-header"><h3>📊 Unit Completion Rates</h3></div>
        <div style="padding:18px 20px">
          <div class="bar-chart">
            ${s.byUnit.map(u => {
              const pct2 = s.total ? Math.round(u.done / s.total * 100) : 0;
              return `<div class="bar-row">
                <div class="bar-label">Unit ${u.n}</div>
                <div class="bar-track">
                  <div class="bar-fill" style="width:${pct2}%;background:var(--blue)">
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
          <div class="bar-chart">
            ${s.faculties.map((f, i) => {
              const pct2 = s.total ? Math.round(f.count / s.total * 100) : 0;
              const colors = ['var(--blue)','#7C3AED','var(--green)','var(--amber)','#0891B2','#DC2626'];
              return `<div class="bar-row">
                <div class="bar-label" style="font-size:11px">${f.f.replace('Faculty of ','').substring(0, 18)}</div>
                <div class="bar-track">
                  <div class="bar-fill" style="width:${pct2}%;background:${colors[i % colors.length]}">
                    <span>${pct2}%</span>
                  </div>
                </div>
                <div class="bar-value">${f.count}</div>
              </div>`;
            }).join('')}
          </div>
        </div>
      </div>
    </div>

    <div class="admin-table-wrap">
      <div class="admin-table-header">
        <h3>👥 Recent Learner Activity</h3>
        <button class="admin-btn admin-btn-blue" onclick="showAdminView('users')">See All Students →</button>
      </div>
      <table class="admin-tbl">
        <thead>
          <tr>
            <th>Name</th><th>Faculty</th><th>LAST ACTIVITY</th><th>Progress</th><th>XP</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${(window.currentAdminData || [])
            .filter(u => !u.is_admin)
            .slice(0, 5)
            .map(u => {
              const isActive = (u.units > 0 || u.quizzes > 0 || u.labs > 0);
              const statusLabel = u.complete ? 'Completed' : (isActive ? 'Active' : 'Inactive');
              const statusClass = u.complete ? 'sp-complete' : (isActive ? 'sp-active' : 'sp-inactive');

              return `
              <tr>
                <td><strong>${u.name || 'Unknown'}</strong><br><small>${u.email}</small></td>
                <td>${(u.faculty || 'N/A').replace('Faculty of ','')}</td>
                <td>${getRelativeTime(u.last_updated)}</td>
                <td>
                  <div class="progress-pill">
                    <div class="progress-pill-bar">
                      <div class="progress-pill-fill ${u.pct >= 100 ? 'full' : ''}" style="width:${u.pct}%"></div>
                    </div>
                    <span style="font-size:11px">${u.pct}%</span>
                  </div>
                </td>
                <td><span style="color:var(--amber); font-weight:600">⭐ ${u.xp}</span></td>
                <td><span class="status-pill ${statusClass}">${statusLabel}</span></td>
              </tr>`;
            }).join('')}
        </tbody>
      </table>
    </div>`;
}
// ══════════════════════════════════════════════════════════════
//  RENDER — USERS
// ══════════════════════════════════════════════════════════════
function renderAdminUsers(filter = '') {
  const el = document.getElementById('admin-view-users');
  const allUsers = (window.currentAdminData || []).filter(u => !u.is_admin);
  
  // Only render the shell once to prevent search focus loss
  if (!el.querySelector('.admin-table-wrap') || filter === '') {
    el.innerHTML = `
      <div class="admin-header-bar animate-in">
        <div class="admin-tag">USER MANAGEMENT</div>
        <h1>Learner Accounts</h1>
        <p id="user-count-summary">${allUsers.length} registered learner${allUsers.length !== 1 ? 's' : ''} 
          · ${allUsers.filter(u => u.complete).length} completed</p>
      </div>

      <div class="admin-table-wrap">
        <div class="admin-table-header">
          <h3 id="table-title">All Learners (${allUsers.length})</h3>
          <div class="admin-table-actions">
            <input class="admin-search" id="user-search-input" 
              placeholder="🔍 Search name, email, faculty..." value="${filter}">
          </div>
        </div>
        <table class="admin-tbl">
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Faculty</th><th>LAST ACTIVITY</th>
              <th>Progress</th><th>Units</th><th>Quizzes</th><th>Labs</th><th>XP</th><th>Status</th>
            </tr>
          </thead>
          <tbody id="admin-user-tbody"></tbody>
        </table>
      </div>`;
    
    document.getElementById('user-search-input').addEventListener('input', (e) => {
      updateUserTableRows(e.target.value);
    });
  }

  updateUserTableRows(filter);
}

// Function that specifically handles the rows to preserve rich UI elements
function updateUserTableRows(filter) {
  const tbody = document.getElementById('admin-user-tbody');
  const allUsers = (window.currentAdminData || []).filter(u => !u.is_admin);
  const filtered = allUsers.filter(u => 
    (u.name || '').toLowerCase().includes(filter.toLowerCase()) || 
    (u.email || '').toLowerCase().includes(filter.toLowerCase()) ||
    (u.faculty || '').toLowerCase().includes(filter.toLowerCase())
  );

  const title = document.getElementById('table-title');
  if (title) title.textContent = `All Learners (${filtered.length})`;

  tbody.innerHTML = filtered.map(u => {
    const lastActive = getRelativeTime(u.last_updated);
    const isActive = (u.units > 0 || u.quizzes > 0 || u.labs > 0);
    
    return `
      <tr>
        <td><strong>${u.name || '—'}</strong></td>
        <td style="font-size:11.5px">${u.email}</td>
        <td style="font-size:11.5px">${(u.faculty || '—').replace('Faculty of ','')}</td>
        <td style="font-size:11.5px; color:var(--text-light)">${lastActive}</td>
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
        <td style="text-align:center">${u.quizzes}/6</td>
        <td style="text-align:center">${u.labs}/6</td>
        <td><span style="color:var(--amber); font-weight:600">⭐ ${u.xp}</span></td>
        <td>
          <span class="status-pill ${u.complete ? 'sp-complete' : (isActive ? 'sp-active' : 'sp-inactive')}">
            ${u.complete ? 'Completed' : (isActive ? 'Active' : 'Inactive')}
          </span>
        </td>
      </tr>`;
  }).join('');
}

// ══════════════════════════════════════════════════════════════
//  RENDER — PROGRESS
// ══════════════════════════════════════════════════════════════
function renderAdminProgress() {
  const users = (window.currentAdminData || []).filter(u => !u.is_admin);
  const el = document.getElementById('admin-view-progress');
  const UNIT_NAMES = [
    'Foundations of Data Literacy',
    'Student Data Landscape',
    'Analysis & Visualisation',
    'Predictive Modelling',
    'Ethics & Governance',
    'Insight to Intervention'
  ];
  const qMax = { 1:8, 2:7, 3:7, 4:7, 5:6, 6:6 };

  // Sorting Logic for the Quiz Table
  if (_currentSortCol !== null) {
    users.sort((a, b) => {
      let valA, valB;
      if (_currentSortCol === 'avg') {
        // Calculate average for comparison
        const getAvg = (u) => {
          const s = u.quizScores || {};
          const scores = [1,2,3,4,5,6].filter(n => s[n] !== undefined).map(n => s[n] / qMax[n]);
          return scores.length ? scores.reduce((sum, v) => sum + v, 0) / scores.length : -1;
        };
        valA = getAvg(a); valB = getAvg(b);
      } else {
        // Sort by specific Unit ID
        valA = (a.quizScores && a.quizScores[_currentSortCol] !== undefined) ? a.quizScores[_currentSortCol] : -1;
        valB = (b.quizScores && b.quizScores[_currentSortCol] !== undefined) ? b.quizScores[_currentSortCol] : -1;
      }
      return (valA - valB) * _currentSortDir;
    });
  }

  const pill = (val, tot, pct) => `
    <div class="progress-pill">
      <div class="progress-pill-bar">
        <div class="progress-pill-fill ${pct >= 100 ? 'full' : ''}" style="width:${pct}%"></div>
      </div>
      <span style="font-size:11px">${val}/${tot} (${pct}%)</span>
    </div>`;

  // Helper for Sort Icons
  const sortIcon = (col) => `<span style="cursor:pointer; margin-left:4px; font-size:10px;" onclick="toggleAdminSort('${col}')">${_currentSortCol === col ? (_currentSortDir === 1 ? '▲' : '▼') : '↕'}</span>`;

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
            <th>Name</th>
            <th>U1 ${sortIcon(1)}</th><th>U2 ${sortIcon(2)}</th><th>U3 ${sortIcon(3)}</th>
            <th>U4 ${sortIcon(4)}</th><th>U5 ${sortIcon(5)}</th><th>U6 ${sortIcon(6)}</th>
            <th>Avg Score ${sortIcon('avg')}</th><th>Certificate</th>
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

// Sorting Toggle Handler
function toggleAdminSort(col) {
  if (_currentSortCol === col) {
    _currentSortDir *= -1; // Toggle direction if clicking same column
  } else {
    _currentSortCol = col;
    _currentSortDir = -1; // Default to highest-to-lowest on first click
  }
  renderAdminProgress(); // Re-render the view with sorted data
}


// ══════════════════════════════════════════════════════════════
//  RENDER — SURVEY
// ══════════════════════════════════════════════════════════════
function renderAdminSurveyResults() {
  const stats = getSurveyStats();
  const el = document.getElementById('admin-view-survey');
  if (!el) return; // Guard clause
  
  // Filter learners who have actually submitted
  const submittedUsers = window.currentAdminData.filter(u => u.progress_data?.survey?.submitted);

  el.innerHTML = `
      <div class="admin-header-bar animate-in">
          <div class="admin-tag">SURVEY ANALYTICS</div>
          <h1>Course & Workshop Feedback</h1>
          <p>${stats.count} total responses processed</p>
      </div>

      <div class="admin-kpi-grid" style="grid-template-columns: repeat(3, 1fr); margin-bottom: 24px;">
          <div class="kpi-card purple">
              <div class="kpi-num">${stats.wsRate}%</div>
              <div class="kpi-label">Workshop Attendance</div>
          </div>
          <div class="kpi-card green">
              <div class="kpi-num">${stats.championRate}%</div>
              <div class="kpi-label">Keen to be Champions</div>
          </div>
          <div class="kpi-card gold">
              <div class="kpi-num">${stats.count}</div>
              <div class="kpi-label">Total Submissions</div>
          </div>
      </div>

      <div class="admin-table-wrap">
          <div class="admin-table-header"><h3>Individual Response Details</h3></div>
          <table class="admin-tbl">
              <thead>
                  <tr>
                      <th>Name</th>
                      <th>Role/Faculty</th>
                      <th>Path</th>
                      <th>Status</th>
                      <th>Action</th>
                  </tr>
              </thead>
              <tbody>
                  ${submittedUsers.length > 0 ? submittedUsers.map(u => {
                      const isWorkshop = u.progress_data.survey.attended_workshop?.includes('Yes');
                      return `
                      <tr>
                          <td><strong>${u.name || '—'}</strong><br><small>${u.email}</small></td>
                          <td>${u.faculty || '—'}</td>
                          <td><span class="status-pill ${isWorkshop ? 'sp-active' : 'sp-inactive'}">
                              ${isWorkshop ? 'Workshop' : 'Online Only'}</span>
                          </td>
                          <td><span class="status-pill sp-complete">Submitted</span></td>
                          <td><button class="admin-btn admin-btn-blue" onclick="viewFullSurvey('${u.user_id}')">View Full Response</button></td>
                      </tr>`;
                  }).join('') : `<tr><td colspan="5" style="text-align:center; padding:40px; color:var(--text-light)">No survey submissions found yet.</td></tr>`}
              </tbody>
          </table>
      </div>`;
}

function viewFullSurvey(userId) {
  const user = window.currentAdminData.find(u => u.user_id === userId);
  const s = user.progress_data.survey;
  const modal = document.getElementById('admin-reset-modal'); 
  const box = modal.querySelector('.modal-box');
  
  let responseHtml = Object.entries(s).map(([key, val]) => `
      <div style="margin-bottom:10px; padding:8px; background:var(--bg); border-radius:6px">
          <div style="font-size:10px; color:var(--text-light); text-transform:uppercase">${key.replace(/_/g, ' ')}</div>
          <div style="font-size:13px; font-weight:600">${val}</div>
      </div>`).join('');

  box.innerHTML = `<h3>📝 Response for ${user.name}</h3>
      <div style="max-height:400px; overflow-y:auto; margin:15px 0">${responseHtml}</div>
      <div class="modal-actions"><button class="admin-btn admin-btn-blue" onclick="closeAdminModal()">Close</button></div>`;
  modal.classList.add('show');
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