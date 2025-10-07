const $=s=>document.querySelector(s);
const API={
  login:(u,p)=>fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'include',body:JSON.stringify({username:u,password:p})}).then(r=>r.json()),
  me:()=>fetch('/api/student/me',{credentials:'include'}).then(r=>r.json()),
  list:()=>fetch('/api/admin/students',{credentials:'include'}).then(r=>r.json()),
  del:(id)=>fetch('/api/admin/students/'+id,{method:'DELETE',credentials:'include'}).then(r=>r.json()),
  logout:()=>fetch('/api/auth/logout',{method:'POST',credentials:'include'})
};
function toast(msg, ok=true){ const t=$('#toast'); t.textContent=msg; t.classList.remove('hidden'); t.style.borderColor= ok? '#60a5fa':'#ef4444'; setTimeout(()=>t.classList.add('hidden'),2200); }

async function init(){
  $('#logoutBtn').onclick=async()=>{ await API.logout(); location.reload(); };
  $('#loginForm').onsubmit=async(e)=>{ e.preventDefault(); const u=$('#username').value,p=$('#password').value; const r=await API.login(u,p); if(r.error){ toast(r.error,false) } else { load(); } };
  load();
}

async function load(){
  const me=await API.me();
  if(me.role!=='admin'){ $('#auth').classList.remove('hidden'); $('#panel').classList.add('hidden'); return; }
  $('#auth').classList.add('hidden'); $('#panel').classList.remove('hidden');
  let data=await API.list();
  const tbody=$('#studentsTable tbody');
  const render=(rows)=>{
    tbody.innerHTML='';
    rows.forEach(s=>{
      const tr=document.createElement('tr');
      tr.innerHTML=`<td>${s.username}</td><td>${s.recordsCount}</td><td>${s.totalMinutes}</td><td><button class="btn danger" data-id="${s.id}">Sil</button></td>`;
      tr.querySelector('button').onclick=async()=>{ if(confirm('Silinsin mi?')){ await API.del(s.id); toast('Silindi'); load(); } };
      tbody.appendChild(tr);
    });
  };
  render(data);
  $('#filter').oninput=(e)=>{ const q=e.target.value.toLowerCase(); render(data.filter(x=>x.username.toLowerCase().includes(q))); };
  const headers=[...document.querySelectorAll('th[data-k]')];
  headers.forEach(h=> h.onclick=()=>{ const k=h.dataset.k; data=[...data].sort((a,b)=> (a[k]>b[k]?1:-1)); render(data); });
}

window.addEventListener('DOMContentLoaded', init);


