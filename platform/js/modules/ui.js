/* UI-specific functions*/

function showLoadingScreen(msg = 'Loading...') {
    const screen = document.getElementById('loading-screen');
    const status = document.getElementById('ls-status');
    if (screen) screen.classList.remove('hidden');
    if (status) status.textContent = msg;
}
  
function hideLoadingScreen() {
    const screen = document.getElementById('loading-screen');
    if (screen) screen.classList.add('hidden');
}

function showToast(msg){
    const t=document.getElementById('toast');
    document.getElementById('toast-msg').textContent=msg;
    t.classList.add('show');
    setTimeout(()=>t.classList.remove('show'),3000);
}

function updateProgress(){
    const total=UNITS.length*2; // units + quizzes
    const done=state.completedUnits.length+state.passedQuizzes.length;
    const pct=Math.round((done/total)*100);
    document.getElementById('prog-pct').textContent=`${pct}%`;
    document.getElementById('prog-bar').style.width=`${pct}%`;
    updateDashStats();
    document.getElementById('total-xp').textContent=`${state.xp} XP`;
}

function buildNavBadges() {
  UNITS.forEach(u => {
      const uid = u.id;
      
      // 1. Gather status flags
      const isDone = state.completedUnits.includes(uid);
      const hasViewedContent = state.viewedSections[uid] && state.viewedSections[uid].length > 0;
      const hasStartedLab = (state.labTasks && state.labTasks[uid] && state.labTasks[uid].length > 0) || (state.completedLabs || []).includes(uid);
      const hasStartedQuiz = (state.quizProgress && state.quizProgress[uid]) || (state.passedQuizzes || []).includes(uid);
      
      const inProgress = !isDone && (hasViewedContent || hasStartedLab || hasStartedQuiz);
      
      const el = document.getElementById(`nb-${uid}`);
      if (!el) return;

      // 2. Apply UI changes based on status
      if (isDone) {
          el.textContent = '✓';
          el.className = 'nav-badge done';
          // Reset styles in case it was previously marked in-progress
          el.style.color = '';
          el.style.background = '';
      } else if (inProgress) {
          el.textContent = '◐'; // Half circle to denote "In Progress"
          el.className = 'nav-badge';
          // Apply custom amber styling for visibility
          el.style.color = 'var(--amber)'; 
          el.style.background = 'rgba(183, 121, 31, 0.2)'; 
      } else {
          el.textContent = '—';
          el.className = 'nav-badge';
          // Reset styles
          el.style.color = '';
          el.style.background = '';
      }
  });
}

function showView(id) {
  const screenWidth = window.innerWidth;
  if(screenWidth <= 1024){
    document.getElementById("bc-hamburger-id").style.display = "block";
    document.getElementById("bc-close-id").style.display = "none";
    document.getElementById("sidebar-id").style.display = "none";
  }
  // 1. Hide all views and deactivate navigation states
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const viewEl = document.getElementById('view-' + id);
  if (viewEl) viewEl.classList.add('active');
  
  // 2. Clear active state from all nav items (including admin items)
  document.querySelectorAll('.nav-item, .admin-nav-item').forEach(n => n.classList.remove('active'));
  
  // 3. Set active class on the corresponding navigation item
  if (id === 'survey') {
      document.getElementById('nav-survey')?.classList.add('active');
  } else {
      // Fallback for standard views like dashboard or profile
      const standardNavItem = document.querySelector(`.nav-item[onclick*="showView('${id}')"]`);
      if (standardNavItem) standardNavItem.classList.add('active');
  }

  // 4. Update the Breadcrumb Title
  const labels = {
      dashboard: 'Dashboard',
      profile: 'My Profile',
      survey: 'Course Experience Survey',
      certificate: 'Certificate Generator',
      references: 'References',
      admin: 'Admin Panel'
  };
  const breadcrumbEl = document.getElementById('bc-current');
  if (breadcrumbEl) breadcrumbEl.textContent = labels[id] || id;

  // 5. Context-Specific Initialization
  if (id === 'survey') {
      // Trigger the rendering logic for the survey form
      if (typeof renderSurvey === 'function') renderSurvey();
  }
  
  if (id === 'certificate') {
    if (typeof fillFromProfile === 'function') fillFromProfile();
    if (typeof renderCert === 'function') renderCert();
    
    // Check progress
    const allDone = state.completedUnits.length === 6 && state.passedQuizzes.length === 6;
    
    // Check admin status - we need to fetch this from the progress table or a global flag
    const isAdmin = document.getElementById('admin-nav-section')?.style.display === 'block';

    const certContent = document.getElementById('view-certificate');
    const existingLock = certContent ? certContent.querySelector('.cert-locked-msg') : null;
    
    // Admin bypass: If admin, they skip the 'allDone' requirement
    if (!allDone && !isAdmin) {
        if (!existingLock && certContent) {
            const lockDiv = document.createElement('div');
            lockDiv.className = 'cert-locked-msg animate-in';
            lockDiv.innerHTML = `
                <h3>🔒 Certificate Not Yet Available</h3>
                <p>Complete all 6 units and pass all 6 quizzes to unlock your certificate.</p>
                <div style="max-width:300px;margin:0 auto 16px;text-align:left">
                    ${UNITS.map(u => {
                        const ud = state.completedUnits.includes(u.id);
                        const qd = state.passedQuizzes.includes(u.id);
                        return `<div class="cert-check-item ${ud && qd ? 'ok' : ''}">
                            <span class="ci">${ud && qd ? '✅' : '⭕'}</span> 
                            Unit ${u.id}: ${u.title.split(' ').slice(0,3).join(' ')}...</div>`;
                    }).join('')}
                </div>
                <button class="retry-btn" onclick="showView('dashboard')">Back to Dashboard</button>`;
            
            const layout = certContent.querySelector('.cert-gen-layout');
            if (layout) {
                certContent.insertBefore(lockDiv, layout);
                layout.style.display = 'none';
            }
        }
    } else {
        // Unlock for Admins or Completed Students
        if (existingLock) existingLock.remove();
        const layout = certContent ? certContent.querySelector('.cert-gen-layout') : null;
        if (layout) {
            layout.style.display = 'grid';
            if (isAdmin && !allDone) {
                showToast("Admin access: Certificate unlocked for testing.");
            }
        }
    }
  }
  // 6. Admin Panel Entry
  if (id === 'admin') { 
      if (typeof showAdminView === 'function') showAdminView('overview'); 
      return; 
  }

  // 7. Global UI Updates
  if (typeof updateDashStats === 'function') updateDashStats();
}


// platform/js/modules/ui.js

async function loadProfile() {
  if (!currentUser) return;

  // 1. Fetch data from the database
  const { data: profile, error } = await _supabase
      .from('student_progress')
      .select('full_name, faculty, user_email')
      .eq('user_id', currentUser.id)
      .single();

  // 2. Extract values, falling back to Auth Metadata for new users
  const meta = currentUser.user_metadata || {};
  
  const displayName = profile?.full_name || meta.full_name || "";
  const displayEmail = profile?.user_email || currentUser.email || "";
  const displayFaculty = profile?.faculty || meta.faculty || "";
  const displayRole = meta.role || ""; // Role is typically kept in metadata

  // 3. Populate the UI inputs
  if (document.getElementById('p-name')) document.getElementById('p-name').value = displayName;
  if (document.getElementById('p-email')) document.getElementById('p-email').value = displayEmail;
  if (document.getElementById('p-faculty')) document.getElementById('p-faculty').value = displayFaculty;
  if (document.getElementById('p-role')) document.getElementById('p-role').value = displayRole;

  // 4. Update the Sidebar immediately
  const initials = displayName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() || "DC";
  document.getElementById('user-av').textContent = initials;
  document.getElementById('sidebar-username').textContent = displayName || 'Data Champion';
  document.getElementById('sidebar-role').textContent = displayFaculty || displayRole || 'Participant';
}

/*async function saveProfile() {
  if (!currentUser) return;
  
  const newName = document.getElementById('p-name')?.value.trim();
  const newRole = document.getElementById('p-role')?.value.trim();
  const newFaculty = document.getElementById('p-faculty')?.value.trim();
  
  if (!newName) {
      showToast("Name is required.");
      return;
  }

  showLoadingScreen('Saving profile...');
  
  // Update the database record
  const { error } = await _supabase
      .from('student_progress')
      .update({ 
          full_name: newName,
          faculty: newFaculty,
          role: 
      })
      .eq('user_id', currentUser.id);

  if (error) {
      showToast('Update failed: ' + error.message);
  } else {
      // Sync the local user metadata so auto-population works on next visit
      currentUser.user_metadata.full_name = newName;
      currentUser.user_metadata.role = newRole;
      currentUser.user_metadata.faculty = newFaculty;

      // Refresh UI components
      document.getElementById('sidebar-username').textContent = newName;
      document.getElementById('sidebar-role').textContent = newFaculty || newRole;
      
      const initials = newName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
      document.getElementById('user-av').textContent = initials;
      
      showToast('Profile updated! ✨');
  }
  hideLoadingScreen();
}*/

async function saveProfile() {
  if (!currentUser) return;
  
  const newName = document.getElementById('p-name')?.value.trim();
  const newRole = document.getElementById('p-role')?.value.trim();
  const newFaculty = document.getElementById('p-faculty')?.value.trim();
  
  if (!newName) {
    showToast("Name is required.");
    return;
  }

  showLoadingScreen('Saving profile...');

  // Build update object dynamically (avoids overwriting with empty strings)
  const updates = {
    full_name: newName
  };

  if (newFaculty) updates.faculty = newFaculty;
  if (newRole) updates.role = newRole;

  const { error } = await _supabase
    .from('student_progress')
    .update(updates)
    .eq('user_id', currentUser.id);

  if (error) {
    showToast('Update failed: ' + error.message);
  } else {
    // Optionally persist to Supabase Auth metadata as well
    await _supabase.auth.updateUser({
      data: {
        full_name: newName,
        role: newRole,
        faculty: newFaculty
      }
    });

    // Sync local user metadata
    currentUser.user_metadata.full_name = newName;
    currentUser.user_metadata.role = newRole;
    currentUser.user_metadata.faculty = newFaculty;

    // Refresh UI
    document.getElementById('sidebar-username').textContent = newName;
    document.getElementById('sidebar-role').textContent = newRole || newFaculty || '';

    const initials = newName
      .split(' ')
      .map(w => w[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    document.getElementById('user-av').textContent = initials;

    showToast('Profile updated! ✨');
  }

  hideLoadingScreen();
}


function buildReferences(){
  const container=document.getElementById('refs-list');
  if(!container)return;
  container.innerHTML=REFS.map(r=>`<div style="padding:8px 0;border-bottom:1px solid var(--border);font-size:13px;color:var(--text-mid);line-height:1.6">${r}</div>`).join('');
}

// Modal