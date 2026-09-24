// Dev-paneel: alleen geladen bij lokaal openen (file:// of localhost), zie index.html.
(function(){
  const FONTS = [
    { name:'Fredoka',      q:'Fredoka:wght@400;500;600;700',      note:'vorige — rond, speels' },
    { name:'Nunito',       q:'Nunito:wght@400;500;600;700',       note:'rond, rustig, zeer leesbaar' },
    { name:'Baloo 2',      q:'Baloo+2:wght@400;500;600;700',      note:'huidig — vrolijk, stevig' },
    { name:'Quicksand',    q:'Quicksand:wght@400;500;600;700',    note:'licht, geometrisch, luchtig' },
    { name:'Lexend',       q:'Lexend:wght@400;500;600;700',       note:'ontworpen voor leesgemak' },
    { name:'Grandstander', q:'Grandstander:wght@400;500;600;700', note:'kinderlijk, handgemaakt' },
    { name:'Mali',         q:'Mali:wght@400;500;600;700',         note:'handschrift, schoolschrift-gevoel' },
  ];
  const KEY = 'dev-font';
  const loaded = new Set(['Baloo 2']);

  function apply(f){
    if(!loaded.has(f.name)){
      const l = document.createElement('link');
      l.rel = 'stylesheet';
      l.href = `https://fonts.googleapis.com/css2?family=${f.q}&display=swap`;
      document.head.appendChild(l);
      loaded.add(f.name);
    }
    document.body.style.fontFamily = `"${f.name}", ui-rounded, system-ui, sans-serif`;
    try{ localStorage.setItem(KEY, f.name); }catch(e){}
    panel.querySelectorAll('[data-font]').forEach(b => b.setAttribute('aria-pressed', b.dataset.font === f.name));
  }

  const css = document.createElement('style');
  css.textContent = `
    .devp{position:fixed; top:10px; right:10px; z-index:9999; width:230px; padding:10px; border-radius:14px;
      background:#1B1A2E; color:#F2F1FA; font:13px/1.3 system-ui, sans-serif; box-shadow:0 8px 24px rgba(0,0,0,.25)}
    .devp.min .devp-body{display:none}
    .devp-head{display:flex; justify-content:space-between; align-items:center; font-weight:600; cursor:pointer}
    .devp-body{margin-top:8px; display:grid; gap:4px}
    .devp button{all:unset; box-sizing:border-box; display:block; width:100%; padding:6px 8px; border-radius:8px; cursor:pointer}
    .devp button:hover{background:rgba(255,255,255,.08)}
    .devp button[aria-pressed="true"]{background:#3E63DD}
    .devp b{display:block; font-size:16px; font-weight:600}
    .devp small{opacity:.7}
    .devp .row{display:flex; gap:4px; margin-top:6px}
    .devp .row button{text-align:center; background:rgba(255,255,255,.1)}
    .devp .lbl{margin-top:8px; opacity:.6; font-size:11px; text-transform:uppercase; letter-spacing:.06em}
  `;
  document.head.appendChild(css);

  const panel = document.createElement('div');
  panel.className = 'devp';
  panel.innerHTML = `<div class="devp-head"><span>🛠 Dev · lettertype</span><span>–</span></div>
    <div class="devp-body">
      ${FONTS.map(f => `<button data-font="${f.name}" aria-pressed="false"><b style="font-family:'${f.name}'">${f.name}</b><small>${f.note}</small></button>`).join('')}
      <div class="lbl">Geluid testen</div>
      <div class="row"><button data-snd="1">Goed</button><button data-snd="0">Fout</button></div>
    </div>`;
  document.body.appendChild(panel);

  // Laad alle kandidaten meteen zodat de namen in hun eigen lettertype getoond worden.
  FONTS.forEach(f => { if(!loaded.has(f.name)){ const l=document.createElement('link'); l.rel='stylesheet'; l.href=`https://fonts.googleapis.com/css2?family=${f.q}&display=swap`; document.head.appendChild(l); loaded.add(f.name); } });

  panel.querySelector('.devp-head').onclick = () => panel.classList.toggle('min');
  panel.addEventListener('click', e => {
    const fb = e.target.closest('[data-font]');
    if(fb) apply(FONTS.find(f => f.name === fb.dataset.font));
    const sb = e.target.closest('[data-snd]');
    if(sb){
      actx = actx || new (window.AudioContext||window.webkitAudioContext)();
      if(actx.state === 'suspended') actx.resume();
      const t = actx.currentTime + .05;
      sb.dataset.snd === '1' ? piano(freqOf('c/5'), t, 1.6) : prot(t, .5);
    }
  });

  let saved = 'Baloo 2';
  try{ saved = localStorage.getItem(KEY) || saved; }catch(e){}
  apply(FONTS.find(f => f.name === saved) || FONTS[2]);
})();
