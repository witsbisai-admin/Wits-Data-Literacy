function renderCert(){
  cs('cc-name',cv('cf-name')||'Recipient Name');
  const role=cv('cf-role');const fac=cv('cf-faculty');
  cs('cc-designation',[role,fac].filter(Boolean).join(' · ')||'Designation · Faculty');
  cs('cc-programme',cv('cf-programme')||'Programme Name');
  cs('cc-faculty',cv('cf-faculty')||'—');
  const nqf=cv('cf-nqf');const cred=cv('cf-credits');
  cs('cc-nqf',nqf&&cred?`${nqf} · ${cred}`:nqf||cred||'—');
  const d=cv('cf-date');
  cs('cc-date',d?new Date(d+'T12:00:00').toLocaleDateString('en-ZA',{day:'numeric',month:'long',year:'numeric'}):'—');
  const certno=cv('cf-certno');
  cs('cert-certno-disp',`Cert No: ${certno||'—'}`);
  cs('cc-s1n',cv('cf-s1n'));cs('cc-s1t',cv('cf-s1t'));
  /*cs('cc-s2n',cv('cf-s2n'));cs('cc-s2t',cv('cf-s2t'));
  cs('cc-s3n',cv('cf-s3n'));cs('cc-s3t',cv('cf-s3t'));*/
  const gradeEl=document.getElementById('cc-grade');
  if(gradeEl){gradeEl.textContent=state.certGrade==='—'?'':state.certGrade;gradeEl.style.display=state.certGrade==='—'?'none':'inline-block';}

}


function setGrade(grade,btn){
  state.certGrade=grade;
  document.querySelectorAll('.grade-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderCert();
}

function toggleCertOpt(el,key){
  el.classList.toggle('on');
  state.certOpts[key]=el.classList.contains('on');
  const map={wm:'cert-wm',seal:'cert-seal',nqfbar:'cert-nqfbar'};
  const target=document.getElementById(map[key]);
  if(target)target.style.display=state.certOpts[key]?'':'none';
}

function setCertBg(color,swatch){
  document.querySelectorAll('.cswatch').forEach(s=>s.classList.remove('active'));
  swatch.classList.add('active');
  document.getElementById('certificate').style.background=color;
  const dark=color.startsWith('#0')||color.startsWith('#1');
  document.getElementById('cc-name').style.color=dark?'#fff':'';
  ['cc-inst','cc-programme','cc-has-completed','cc-presents'].forEach(id=>{
    const el=document.getElementById(id);if(el)el.style.color=dark?'var(--gold-light)':'';
  });
}

function setCertScale(s,btn){
  document.querySelectorAll('.scale-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('cert-wrap').style.transform=`scale(${s})`;
  document.getElementById('cert-wrap').style.transformOrigin='top center';
}

async function fillFromProfile() {
  // Instead of localStorage, we pull from the inputs that were populated by loadProfile()
  const name = document.getElementById('p-name')?.value;
  const role = document.getElementById('p-role')?.value;
  const faculty = document.getElementById('p-faculty')?.value;

  if (name) document.getElementById('cf-name').value = name;
  if (role) document.getElementById('cf-role').value = role;
  if (faculty) document.getElementById('cf-faculty').value = faculty;
  
  renderCert();
}

function autoCertNo(){
  const yr=new Date().getFullYear();
  const num=String(Math.floor(Math.random()*9000)+1000);
  const cn=`WDC-${yr}-${num}`;
  const el=document.getElementById('cf-certno');
  if(el){el.value=cn;renderCert();}
}

function printCert(){
  const wrap=document.getElementById('cert-wrap');
  const prev=wrap.style.transform;
  wrap.style.transform='scale(1)';
  setTimeout(()=>{window.print();wrap.style.transform=prev;},150);
}

function isAdmin() {
  // TEMP (you can change later to real login)
  return localStorage.getItem('role') === 'admin';
}

document.addEventListener('DOMContentLoaded', () => {
  if (!isAdmin()) {
    const panel = document.getElementById('admin-config');
    if (panel) panel.style.display = 'none';
  }
});