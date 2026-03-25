function cv(id){return document.getElementById(id)?.value||'';}function cs(id,t){const el=document.getElementById(id);if(el)el.textContent=t;}
function scrollToSection(id){
  const el=document.getElementById(id);
  if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
}
 