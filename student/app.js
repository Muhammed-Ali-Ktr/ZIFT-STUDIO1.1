const $ = s => document.querySelector(s);
const API = {
  register: (u,p)=>fetch('/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'include',body:JSON.stringify({username:u,password:p})}).then(r=>r.json()),
  login: (u,p)=>fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'include',body:JSON.stringify({username:u,password:p})}).then(r=>r.json()),
  logout: ()=>fetch('/api/auth/logout',{method:'POST',credentials:'include'}),
  me: ()=>fetch('/api/student/me',{credentials:'include'}).then(r=>r.json()),
  getProfile: ()=>fetch('/api/student/profile',{credentials:'include'}).then(r=>r.json()),
  saveProfile: (p)=>fetch('/api/student/profile',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'include',body:JSON.stringify(p)}).then(r=>r.json()),
  listRecords: ()=>fetch('/api/student/records',{credentials:'include'}).then(r=>r.json()),
  addRecord: (rec)=>fetch('/api/student/records',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'include',body:JSON.stringify(rec)}).then(r=>r.json()),
  delRecord: (id)=>fetch('/api/student/records/'+id,{method:'DELETE',credentials:'include'}).then(r=>r.json()),
  getPlans: ()=>fetch('/api/student/plans',{credentials:'include'}).then(r=>r.json()),
  addPlan: (p)=>fetch('/api/student/plans',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'include',body:JSON.stringify(p)}).then(r=>r.json()),
  updatePlan: (id,p)=>fetch('/api/student/plans/'+id,{method:'PUT',headers:{'Content-Type':'application/json'},credentials:'include',body:JSON.stringify(p)}).then(r=>r.json()),
  getEvents: ()=>fetch('/api/student/events',{credentials:'include'}).then(r=>r.json()),
  addEvent: (e)=>fetch('/api/student/events',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'include',body:JSON.stringify(e)}).then(r=>r.json()),
  updateEvent: (id,e)=>fetch('/api/student/events/'+id,{method:'PUT',headers:{'Content-Type':'application/json'},credentials:'include',body:JSON.stringify(e)}).then(r=>r.json()),
  statsWeekly: (weekStart)=>fetch('/api/student/stats/weekly?weekStart='+encodeURIComponent(weekStart),{credentials:'include'}).then(r=>r.json())
};

function toast(msg, ok=true){ const t=$('#toast'); t.textContent=msg; t.classList.remove('hidden'); t.style.borderColor= ok? '#10b981':'#ef4444'; setTimeout(()=>t.classList.add('hidden'),2200); }

function isoWeekStart(d){ const x=new Date(d); const day=(x.getDay()+6)%7; x.setHours(0,0,0,0); x.setDate(x.getDate()-day); return x.toISOString().slice(0,10); }

async function init(){
  $('#logoutBtn').onclick=async()=>{ await API.logout(); location.reload(); };
  $('#themeToggle').onclick=()=>{ document.documentElement.classList.toggle('light'); };

  $('#loginForm').onsubmit=async(e)=>{ e.preventDefault(); const u=$('#loginUsername').value,p=$('#loginPassword').value; const r=await API.login(u,p); if(r.error){toast(r.error,false)} else { toast('Giriş başarılı'); loadApp(); } };
  $('#registerForm').onsubmit=async(e)=>{ e.preventDefault(); const u=$('#registerUsername').value,p=$('#registerPassword').value; const r=await API.register(u,p); if(r.error){toast(r.error,false)} else { toast('Kayıt başarılı'); loadApp(); } };

  loadApp();
  // public stats on auth screen
  try{ const stats=await fetch('/api/auth/stats').then(r=>r.json()); const el=$('#publicStats'); if(el) el.textContent = 'Toplam üye: '+(stats.userCount||0); }catch{}
}

async function loadApp(){
  try{
    const me = await API.me();
    if(me.error){ throw new Error('unauth'); }
    $('#authSection').classList.add('hidden');
    $('#dashboard').classList.remove('hidden');
    await loadPreferences();
    setupWidgets();
    setupPlanner();
    await refreshRecords();
    await refreshPlanner();
    await buildCalendar();
    buildWeekbar();
    await refreshStats();
    setupPomodoro();
  }catch{ $('#authSection').classList.remove('hidden'); $('#dashboard').classList.add('hidden'); }
}

async function loadPreferences(){
  const profile = await API.getProfile();
  const theme = profile.theme || 'dark';
  const layout = profile.layout || 'two';
  const hidden = profile.hiddenWidgets || [];
  applyTheme(theme);
  applyLayout(layout);
  // themeSelect replaced by cycle button
  $('#layoutSelect').value = layout;
  for(const key of hidden){ const el=document.querySelector(`.widget[data-key="${key}"]`); if(el) el.style.display='none'; }
  const themes=['dark','forest','ocean','crimson','light'];
  $('#themeCycle').onclick=async()=>{
    const current=document.documentElement.dataset.theme||theme;
    const idx=(themes.indexOf(current)+1)%themes.length;
    const next=themes[idx];
    applyTheme(next);
    await API.saveProfile({ theme:next });
  };
  $('#layoutSelect').onchange=async(e)=>{ applyLayout(e.target.value); await API.saveProfile({ layout:e.target.value }); };
  $('#bgBtn').onclick=()=>{ document.querySelector('#bgPicker').classList.toggle('hidden'); };
  document.querySelectorAll('.bg-opt').forEach(btn=> btn.onclick=async()=>{
    const bg=btn.dataset.bg;
    applyBackground(bg);
    await API.saveProfile({ background:bg||'none' });
  });
}

function applyTheme(theme){
  document.documentElement.classList.remove('light','forest','ocean','crimson');
  if(theme!=='dark') document.documentElement.classList.add(theme);
  document.documentElement.dataset.theme=theme;
}

function applyLayout(layout){
  const root=$('#widgets');
  root.classList.remove('one','two');
  root.classList.add(layout==='one'?'one':'two');
}

function setupWidgets(){
  const widgets = [...document.querySelectorAll('.widget')];
  let dragSrc=null;
  widgets.forEach(w=>{
    w.draggable=true;
    w.addEventListener('dragstart', e=>{ dragSrc=w; e.dataTransfer.effectAllowed='move'; w.classList.add('dragging'); });
    w.addEventListener('dragend', async()=>{ w.classList.remove('dragging'); await saveWidgetOrder(); });
    w.addEventListener('dragover', e=>{ e.preventDefault(); const root=$('#widgets'); const after=[...root.children].find(c=> c!==w && c.getBoundingClientRect().top + c.offsetHeight/2 > e.clientY ); root.insertBefore(dragSrc, after||null); });
    w.querySelector('.hide-btn').onclick=async()=>{ w.style.display='none'; await saveHiddenWidgets(); };
  });
  $('#customizeBtn').onclick=async()=>{
    widgets.forEach(w=>{ if(w.style.display==='none') w.style.display=''; });
    await saveHiddenWidgets([]);
  };
}

async function saveWidgetOrder(){
  const order=[...$('#widgets').children].map(w=>w.dataset.key);
  await API.saveProfile({ widgetOrder:order });
}

async function saveHiddenWidgets(force){
  const hidden = typeof force!== 'undefined' ? force : [...document.querySelectorAll('.widget')].filter(w=>w.style.display==='none').map(w=>w.dataset.key);
  await API.saveProfile({ hiddenWidgets:hidden });
}

async function refreshRecords(){
  const list = await API.listRecords();
  const wrap = $('#records');
  wrap.innerHTML = '';
  list.forEach(r=>{
    const div=document.createElement('div');
    div.className='item';
    div.innerHTML=`<div><b>${r.subject}</b> • ${r.topic} • ${r.minutes} dk • ${r.date}</div><button class="btn danger" data-id="${r.id}">Sil</button>`;
    div.querySelector('button').onclick=async()=>{ await API.delRecord(r.id); toast('Silindi'); refreshRecords(); refreshStats(); };
    wrap.appendChild(div);
  });
  $('#recordForm').onsubmit=async(e)=>{
    e.preventDefault();
    const rec={ subject:$('#subject').value, topic:$('#topic').value, minutes:Number($('#minutes').value), date:$('#date').value, note:$('#note').value };
    const res=await API.addRecord(rec);
    if(res.error) return toast(res.error,false);
    toast('Eklendi');
    e.target.reset();
    await refreshRecords();
    await refreshStats();
  };
}

let currentWeekStart = isoWeekStart(new Date());
function setupPlanner(){
  $('#prevWeek').onclick=()=>{ const d=new Date(currentWeekStart); d.setDate(d.getDate()-7); currentWeekStart=isoWeekStart(d); renderPlannerGrid(); refreshStats(); };
  $('#nextWeek').onclick=()=>{ const d=new Date(currentWeekStart); d.setDate(d.getDate()+7); currentWeekStart=isoWeekStart(d); renderPlannerGrid(); refreshStats(); };
  $('#savePlan').onclick=savePlan;
  renderPlannerGrid();
}

function renderPlannerGrid(){
  $('#weekLabel').textContent = currentWeekStart;
  const days=['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'];
  const root=$('#planner'); root.innerHTML='';
  for(let i=0;i<7;i++){
    const cell=document.createElement('div'); cell.className='cell';
    const d=new Date(currentWeekStart); d.setDate(d.getDate()+i);
    cell.innerHTML=`<h4>${days[i]} • ${d.toISOString().slice(0,10)}</h4><div class="tasks"></div><div class="row"><input placeholder="Ders"><input placeholder="Konu"><input type="number" placeholder="dk"><button class="btn">Ekle</button></div>`;
    cell.querySelector('button').onclick=()=>{
      const [a,b,c]=cell.querySelectorAll('input');
      const t=document.createElement('div'); t.className='task'; t.textContent=`${a.value} • ${b.value} • ${c.value} dk`;
      t.dataset.subject=a.value; t.dataset.topic=b.value; t.dataset.minutes=c.value; t.dataset.date=d.toISOString().slice(0,10);
      cell.querySelector('.tasks').appendChild(t);
      a.value=b.value=c.value='';
    };
    root.appendChild(cell);
  }
}

async function refreshPlanner(){
  const plans=await API.getPlans();
  const match=plans.find(p=>p.weekStart===currentWeekStart);
  if(!match) return;
  renderPlannerGrid();
  const root=$('#planner');
  for(const item of match.items){
    const idx=(new Date(item.date).getDay()+6)%7;
    const cell=root.children[idx];
    const t=document.createElement('div'); t.className='task'; t.textContent=`${item.subject} • ${item.topic} • ${item.minutes} dk`;
    Object.assign(t.dataset, item);
    cell.querySelector('.tasks').appendChild(t);
  }
}

async function savePlan(){
  const root=$('#planner');
  const items=[];
  for(const cell of root.children){
    for(const t of cell.querySelectorAll('.task')){
      items.push({ subject:t.dataset.subject, topic:t.dataset.topic, minutes:Number(t.dataset.minutes), date:t.dataset.date });
    }
  }
  const plans=await API.getPlans();
  const exist=plans.find(p=>p.weekStart===currentWeekStart);
  if(exist){ await API.updatePlan(exist.id,{ items }); toast('Plan güncellendi'); }
  else { await API.addPlan({ weekStart:currentWeekStart, items }); toast('Plan kaydedildi'); }
}

async function buildCalendar(){
  const cal=$('#calendar'); cal.innerHTML='';
  const base=new Date(); base.setDate(1);
  const start=(base.getDay()+6)%7; const total=new Date(base.getFullYear(), base.getMonth()+1, 0).getDate();
  const events=await API.getEvents();
  for(let i=0;i<start;i++){ const d=document.createElement('div'); d.className='day muted'; cal.appendChild(d); }
  for(let i=1;i<=total;i++){
    const d=document.createElement('div'); d.className='day';
    const iso=new Date(base.getFullYear(), base.getMonth(), i).toISOString().slice(0,10);
    d.innerHTML=`<div class="d">${iso}</div>`;
    const mine=events.filter(e=>e.date===iso);
    for(const e of mine){ const el=document.createElement('div'); el.className='event'; el.textContent=e.title; d.appendChild(el); }
    d.onclick=async()=>{
      const title=prompt('Etkinlik başlığı'); if(!title) return;
      const description=prompt('Açıklama (opsiyonel)')||'';
      await API.addEvent({ date:iso, title, description });
      toast('Etkinlik eklendi'); buildCalendar();
    };
    cal.appendChild(d);
  }
}

function buildWeekbar(){
  const wrap=$('#weekbar'); if(!wrap) return; wrap.innerHTML='';
  const start=new Date(); const day=(start.getDay()+6)%7; start.setDate(start.getDate()-day);
  const names=['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'];
  for(let i=0;i<7;i++){
    const d=new Date(start); d.setDate(start.getDate()+i);
    const div=document.createElement('div'); div.className='wday';
    const iso=d.toISOString().slice(0,10);
    div.textContent=names[i]+" • "+iso;
    if(i===day) div.classList.add('today');
    wrap.appendChild(div);
  }
}

function applyBackground(bg){
  const body=document.body;
  if(!bg || bg==='none'){
    body.style.backgroundImage='none';
    return;
  }
  body.style.backgroundImage=`url(${bg})`;
  body.style.backgroundSize='cover';
  body.style.backgroundAttachment='fixed';
  body.style.backgroundPosition='center';
}

async function refreshStats(){
  const s=await API.statsWeekly(currentWeekStart);
  $('#statTotal').textContent = (s.totalMinutes||0) + ' dk';
  $('#statTop').textContent = s.mostStudied || '-';
  const today=new Date().getDay();
  $('#statToday').textContent = (s.byDay?.[today]||0) + ' dk';
}

function setupPomodoro(){
  let seconds=25*60, timer=null;
  const el=$('#pomodoroTime');
  function render(){ const m=Math.floor(seconds/60).toString().padStart(2,'0'); const s=(seconds%60).toString().padStart(2,'0'); el.textContent=`${m}:${s}`; }
  function tick(){ if(seconds>0){ seconds--; render(); } else { clearInterval(timer); timer=null; toast('Pomodoro bitti'); } }
  $('#pomodoroStart').onclick=()=>{ if(timer) return; timer=setInterval(tick,1000); };
  $('#pomodoroPause').onclick=()=>{ if(timer){ clearInterval(timer); timer=null; } };
  $('#pomodoroReset').onclick=()=>{ seconds=25*60; render(); };
  render();
}

window.addEventListener('DOMContentLoaded', init);


