const tabs = document.querySelectorAll('nav button');
const sections = document.querySelectorAll('.tab');
tabs.forEach(btn=>{
  btn.addEventListener('click',()=>{
    tabs.forEach(b=>b.classList.remove('active'));
    sections.forEach(s=>s.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

let banks = [];
let jobs = [];

Promise.all([
  fetch('banks.json').then(r=>r.json()),
  fetch('jobs.json').then(r=>r.json())
]).then(([b,j])=>{
  banks = b;
  jobs = j;
  initBanks();
  initJobs();
  initMirrors();
});

function initBanks(){
  const grid = document.getElementById('banksGrid');
  const search = document.getElementById('search');
  const catSel = document.getElementById('categoryFilter');
  const categories = [...new Set(banks.map(b=>b.category).filter(Boolean))].sort();
  categories.forEach(c=>{
    const opt=document.createElement('option');
    opt.value=c; opt.textContent=c;
    catSel.appendChild(opt);
  });
  function render(){
    const q = search.value.toLowerCase();
    const cat = catSel.value;
    const filtered = banks.filter(b=>{
      const matchesQ = !q || b.bank.toLowerCase().includes(q) || (b.category||'').toLowerCase().includes(q);
      const matchesCat = !cat || b.category===cat;
      return matchesQ && matchesCat;
    });
    grid.innerHTML = filtered.map(b=>`
      <div class="card">
        <h3>${b.bank}</h3>
        <div class="meta">${b.category||''} • ${b.status||''}</div>
        <div>${b.description||''}</div>
        <div style="margin-top:.5rem">
          ${b.website?`<a href="${b.website}" target="_blank" rel="noopener">Website</a>`:''}
          ${b.careers?`<a href="${b.careers}" target="_blank" rel="noopener">Careers</a>`:''}
        </div>
      </div>
    `).join('');
  }
  search.addEventListener('input',render);
  catSel.addEventListener('change',render);
  render();
}

function initJobs(){
  const list = document.getElementById('jobsList');
  list.innerHTML = jobs.map(url=>`<li><a href="${url}" target="_blank" rel="noopener">${url}</a></li>`).join('');
}

function initMirrors(){
  const select = document.getElementById('mirrorBankSelect');
  const details = document.getElementById('mirrorDetails');
  banks.forEach((b,i)=>{
    const opt=document.createElement('option');
    opt.value=i; opt.textContent=b.bank;
    select.appendChild(opt);
  });
  let idx=0;
  function renderMirror(i){
    const b=banks[i];
    if(!b) return;
    select.value=i;
    const mirrors = (b.mirrors_raw||'').split(';').map(s=>s.trim()).filter(Boolean);
    details.innerHTML = `
      <h3>${b.bank}</h3>
      <div class="meta">${b.category}</div>
      <ul>${mirrors.map(m=>`<li><a href="${m}" target="_blank" rel="noopener">${m}</a></li>`).join('')}</ul>
      <p style="margin-top:.5rem;color:#666">Notes: ${b.notes||''}</p>
    `;
    idx=i;
  }
  select.addEventListener('change',e=>renderMirror(parseInt(e.target.value)));
  document.getElementById('prevBank').addEventListener('click',()=>renderMirror((idx-1+banks.length)%banks.length));
  document.getElementById('nextBank').addEventListener('click',()=>renderMirror((idx+1)%banks.length));
  renderMirror(0);
}
