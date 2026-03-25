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

function buildNavBadges(){
    UNITS.forEach(u=>{
      const done=state.completedUnits.includes(u.id);
      const qpassed=state.passedQuizzes.includes(u.id);
      const el=document.getElementById(`nb-${u.id}`);
      if(!el) return;
      if(done&&qpassed){el.textContent='✓';el.className='nav-badge done';}
      else if(done||qpassed){el.textContent='…';el.className='nav-badge';}
      else{el.textContent='—';el.className='nav-badge';}
    });
}

function showView(id){
    // Hide all views and deactivate nav
    document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
    const viewEl=document.getElementById('view-'+id);
    if(viewEl) viewEl.classList.add('active');
    document.querySelectorAll('.nav-item,.admin-nav-item').forEach(n=>n.classList.remove('active'));
  
    const labels={dashboard:'Dashboard',profile:'My Profile',
      certificate:'Certificate Generator',references:'References',admin:'Admin Panel'};
    document.getElementById('bc-current').textContent=labels[id]||id;
  
    // Certificate: fill from profile + check completion lock
    if(id==='certificate'){
      fillFromProfile(); renderCert();
      const allDone=state.completedUnits.length===6&&state.passedQuizzes.length===6;
      const certContent=document.getElementById('view-certificate');
      const existing=certContent?certContent.querySelector('.cert-locked-msg'):null;
      if(!allDone){
        if(!existing&&certContent){
          const lockDiv=document.createElement('div');
          lockDiv.className='cert-locked-msg animate-in';
          lockDiv.innerHTML='<h3>🔒 Certificate Not Yet Available</h3>'+
            '<p>Complete all 6 units and pass all 6 quizzes to unlock your certificate.</p>'+
            '<div style="max-width:300px;margin:0 auto 16px;text-align:left">'+
            UNITS.map(function(u){
              var ud=state.completedUnits.includes(u.id);
              var qd=state.passedQuizzes.includes(u.id);
              return '<div class="cert-check-item '+(ud&&qd?'ok':'')+'">'+
                '<span class="ci">'+(ud&&qd?'✅':'⭕')+'</span> '+
                'Unit '+u.id+': '+u.title.split(' ').slice(0,3).join(' ')+'...</div>';
            }).join('')+'</div>'+
            '<button class="retry-btn" onclick="showView(&apos;dashboard&apos;)">Back to Dashboard</button>';
          const layout=certContent.querySelector('.cert-gen-layout');
          if(layout){certContent.insertBefore(lockDiv,layout);layout.style.display='none';}
        }
      } else {
        if(existing) existing.remove();
        const layout=certContent?certContent.querySelector('.cert-gen-layout'):null;
        if(layout) layout.style.display='';
        const u=currentUser;
        if(u){
          const n=document.getElementById('cf-name');if(n&&!n.value)n.value=u.name||'';
          const r=document.getElementById('cf-role');if(r&&!r.value)r.value=u.role||'';
          const f=document.getElementById('cf-faculty');if(f&&!f.value)f.value=u.faculty||'';
          const d=document.getElementById('cf-date');if(d&&!d.value)d.value=new Date().toISOString().split('T')[0];
          if(!document.getElementById('cf-certno')?.value)autoCertNo();
          renderCert();
        }
      }
    }
  
    // Admin panel — delegate to showAdminView
    if(id==='admin'){ showAdminView('overview'); return; }
  
    updateDashStats();
}

function saveProfile(){
    const profile={name:document.getElementById('p-name')?.value||'',role:document.getElementById('p-role')?.value||'',faculty:document.getElementById('p-faculty')?.value||'',email:document.getElementById('p-email')?.value||''};
    localStorage.setItem('wits_dc_profile',JSON.stringify(profile));
    const initials=(profile.name||'DC').split(' ').map(w=>w[0]).join('').substring(0,2).toUpperCase()||'DC';
    document.getElementById('user-av').textContent=initials;
    document.getElementById('sidebar-username').textContent=profile.name||'Data Champion';
    document.getElementById('sidebar-role').textContent=profile.role||'Participant';
}
  
function loadProfile(){
    const s=localStorage.getItem('wits_dc_profile');
    if(s){
      const p=JSON.parse(s);
      if(document.getElementById('p-name')) document.getElementById('p-name').value=p.name||'';
      if(document.getElementById('p-role')) document.getElementById('p-role').value=p.role||'';
      if(document.getElementById('p-faculty')) document.getElementById('p-faculty').value=p.faculty||'';
      if(document.getElementById('p-email')) document.getElementById('p-email').value=p.email||'';
      const initials=(p.name||'DC').split(' ').map(w=>w[0]).join('').substring(0,2).toUpperCase()||'DC';
      document.getElementById('user-av').textContent=initials;
      document.getElementById('sidebar-username').textContent=p.name||'Data Champion';
      document.getElementById('sidebar-role').textContent=p.role||'Participant';
    }
}

function buildReferences(){
  const container=document.getElementById('refs-list');
  if(!container)return;
  container.innerHTML=REFS.map(r=>`<div style="padding:8px 0;border-bottom:1px solid var(--border);font-size:13px;color:var(--text-mid);line-height:1.6">${r}</div>`).join('');
}
 