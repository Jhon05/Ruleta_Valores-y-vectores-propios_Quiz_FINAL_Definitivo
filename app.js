
const $ = id => document.getElementById(id);
const $$ = s => Array.from(document.querySelectorAll(s));

const RED = new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);
const WHEEL = [0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26];
const TOPICS = ['EV','DG','OR','CQ','RT','JC','CM','ST'];
const TOPIC_NAME = {EV:'Valores propios',DG:'Diagonalización',OR:'Ortogonal',CQ:'Cónicas',RT:'Rototraslación',JC:'Jordan',CM:'Complejos',ST:'Covarianza'};
const ROUTES = [
  {id:'rojo', label:'Rojo', favorable:18, detail:'Coincide con una balota roja. Cubre 18 de las 37 casillas.'},
  {id:'negro', label:'Negro', favorable:18, detail:'Coincide con una balota negra. Cubre 18 de las 37 casillas.'},
  {id:'verde', label:'Verde 0', favorable:1, detail:'Coincide únicamente con la balota 0. Cubre 1 de las 37 casillas.'},
  {id:'par', label:'Par', favorable:18, detail:'Coincide con números pares distintos de 0. Cubre 18 de las 37 casillas.'},
  {id:'impar', label:'Impar', favorable:18, detail:'Coincide con números impares. Cubre 18 de las 37 casillas.'},
  {id:'bajo', label:'1 a 18', favorable:18, detail:'Coincide con balotas entre 1 y 18. Cubre 18 de las 37 casillas.'},
  {id:'alto', label:'19 a 36', favorable:18, detail:'Coincide con balotas entre 19 y 36. Cubre 18 de las 37 casillas.'},
  {id:'d1', label:'1.ª docena', favorable:12, detail:'Coincide con números de 1 a 12. Cubre 12 de las 37 casillas.'},
  {id:'d2', label:'2.ª docena', favorable:12, detail:'Coincide con números de 13 a 24. Cubre 12 de las 37 casillas.'},
  {id:'d3', label:'3.ª docena', favorable:12, detail:'Coincide con números de 25 a 36. Cubre 12 de las 37 casillas.'}
];

const VIOLATION_LIMIT = 5;

let state = {
  score: 1.0,
  risk: null,
  route: null,
  used: [],
  current: null,
  spin: false,
  time: 3600,
  timer: null,
  rot: 0,
  ball: 0,
  history: [],
  fullscreen: false,
  security: [],
  violations: 0,
  annulled: false,
  blockActive: false,
  allowExit: false,
  teacherAction: null,
  lastViolationAt: 0,
  lastRoundSummary: ''
};

function esc(s){ return String(s ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
function norm(s){ return String(s ?? '').trim().toLowerCase().replace(',', '.').replace(/\s+/g,''); }
function typeset(){ if(window.MathJax?.typesetPromise) MathJax.typesetPromise().catch(err => console.warn('MathJax:', err)); }
function color(n){ return n === 0 ? 'verde' : RED.has(n) ? 'rojo' : 'negro'; }
function fmtTime(s){ const m=Math.floor(s/60), r=s%60; return `${String(m).padStart(2,'0')}:${String(r).padStart(2,'0')}`; }
function clampNote(x){ return Math.max(0, Math.min(5, Number(x))); }
function applyScore(delta){
  state.score = clampNote(Number(state.score || 0) + Number(delta || 0));
  // No existe piso mínimo de permanencia. Si después de una pérdida la nota queda
  // por debajo de una décima, el quiz se considera perdido y pasa a 0.0.
  if(state.score > 0 && state.score < 0.1) state.score = 0;
  return state.score;
}
function noPlayableScore(){ return state.score <= 0 || (state.score > 0 && state.score < 0.1); }
function routeLabel(id){ return ROUTES.find(r=>r.id===id)?.label || '--'; }
function routeConfig(id){ return ROUTES.find(r=>r.id===id) || null; }
function routeProbability(id){ const r=routeConfig(id); return r ? r.favorable/37 : 0; }
function routeBonus(id){ const p=routeProbability(id); return 1-p; }
function routeFraction(id){ const r=routeConfig(id); return r ? `${r.favorable}/37` : '--'; }
function probabilityText(id){ const p=routeProbability(id); return p ? `${routeFraction(id)} ≈ ${(100*p).toFixed(1)}%` : '--'; }
function bonusText(id){ const b=routeBonus(id); return Number.isFinite(b) && b>0 ? b.toFixed(2) : '--'; }
function routeBonusFormula(id){ const r=routeConfig(id); return r ? `1-${r.favorable}/37 = ${bonusText(id)}` : '--'; }
function routeBonusExact(id){ const r=routeConfig(id); return r ? `${37-r.favorable}/37` : '--'; }
function signedValue(value){ const n=Number(value||0); return `${n>=0?'+':''}${n.toFixed(2)}`; }

function routeMatch(route, n){
  if(route === 'rojo') return color(n)==='rojo';
  if(route === 'negro') return color(n)==='negro';
  if(route === 'verde') return n===0;
  if(route === 'par') return n!==0 && n%2===0;
  if(route === 'impar') return n%2===1;
  if(route === 'bajo') return n>=1 && n<=18;
  if(route === 'alto') return n>=19 && n<=36;
  if(route === 'd1') return n>=1 && n<=12;
  if(route === 'd2') return n>=13 && n<=24;
  if(route === 'd3') return n>=25 && n<=36;
  return false;
}
function topicFor(n){ return TOPICS[n===0 ? Math.floor(Math.random()*TOPICS.length) : (n-1)%TOPICS.length]; }
function levelForRisk(r){ r=Number(r); if(r<=0.1) return 2; if(r<=0.2) return 3; if(r<=0.5) return 4; return 5; }
function levelLabel(l){ return {2:'Básico',3:'Intermedio',4:'Avanzado',5:'Experto'}[l] || 'Intermedio'; }
function chipLabel(v){ return `${Math.round(v*10)} décima${Math.round(v*10)===1?'':'s'}`; }
function availableRisks(){
  if(noPlayableScore()) return [];
  return [0.1,0.2,0.3,0.5,0.7,1.0].filter(x => x <= state.score + 1e-9);
}

function normalizeLatex(s){
  return String(s ?? '')
    .replace(/\\\\([\[\]\(\)])/g,'\\$1')
    .replace(/\\\\([A-Za-z])/g,'\\$1')
    .replace(/\\\\([,;:!{}])/g,'\\$1');
}
function mathHTML(s){ return `<div class="math-rich">${normalizeLatex(s)}</div>`; }

function hintFor(q){
  const byTopic = {
    EV:'Calcula primero traza y determinante. Si hay que hallar valores propios, construye el polinomio característico antes de mirar las opciones.',
    DG:'Verifica dos cosas: que las columnas de \(P\) sean vectores propios y que estén en el mismo orden que los valores de \(D\).',
    OR:'Si la matriz es simétrica, puedes usar una base ortonormal de vectores propios. No olvides normalizar.',
    CQ:'En una forma \(ax^2+bxy+cy^2\), la matriz simétrica tiene entradas \(m_{12}=m_{21}=b/2\).',
    RT:'Primero diagonaliza la parte cuadrática con una matriz ortogonal. Luego interpreta el signo de los valores propios.',
    JC:'Para un bloque de Jordan \(J=\lambda I+N\), usa \(N^2=0\) en dimensión dos.',
    CM:'Usa el discriminante de \(\lambda^2-\operatorname{tr}(A)\lambda+\det(A)\). Si es negativo, aparecen conjugados complejos.',
    ST:'En PCA, los valores propios de la matriz de covarianza son varianzas principales.'
  };
  const byKind = {
    numeric:'La respuesta debe ser solo el número final. Haz el cálculo en borrador y evita escribir texto.',
    statements:'Evalúa I, II, III y IV por separado; una afirmación falsa cambia toda la selección.',
    tf:'Busca una condición necesaria o un contraejemplo rápido antes de decidir.',
    mcq:'Descarta opciones usando invariantes: traza, determinante, signo del discriminante u orden de vectores propios.'
  };
  return `${byTopic[q.topic] || ''} ${byKind[q.kind] || ''}`;
}

function buildTable(){
  const grid=$('numberGrid');
  const rows=[[3,6,9,12,15,18,21,24,27,30,33,36],[2,5,8,11,14,17,20,23,26,29,32,35],[1,4,7,10,13,16,19,22,25,28,31,34]];
  grid.innerHTML='';
  rows.flat().forEach(n=>{
    const d=document.createElement('div');
    d.className=`num-cell ${color(n)==='rojo'?'red':'black'}`;
    d.textContent=n; d.dataset.n=n;
    grid.appendChild(d);
  });
}
function buildWheel(){
  const seg=360/WHEEL.length;
  const parts=[];
  WHEEL.forEach((n,i)=>{
    const c=n===0?'#047857':RED.has(n)?'#c8272d':'#050505';
    parts.push(`${c} ${i*seg}deg ${(i+1)*seg}deg`);
  });
  $('wheel').style.setProperty('--wheel', parts.join(','));
  const nums=$('wheelNumbers'); nums.innerHTML='';
  WHEEL.forEach((n,i)=>{
    const sp=document.createElement('span'); sp.textContent=n;
    sp.style.transform=`rotate(${i*seg+seg/2}deg) translateY(calc(-1 * min(18.5vmin,170px))) rotate(90deg)`;
    nums.appendChild(sp);
  });
}
function renderRoutes(){
  const box=$('routeButtons');
  box.innerHTML=ROUTES.map(r=>`<button class="route-btn ${state.route===r.id?'selected':''}" data-route="${r.id}">${r.label}</button>`).join('');
  const info=$('routeInfo');
  if(!state.route){ info.textContent='Selecciona primero una ficha de la ruleta.'; return; }
  const r=ROUTES.find(x=>x.id===state.route);
  info.innerHTML=`Ficha elegida: <b>${r.label}</b>. ${r.detail}<br><b>Probabilidad:</b> ${probabilityText(r.id)} · <b>Bonificación si acierta:</b> +${bonusText(r.id)}.`;
}
function renderRisks(){
  const values=availableRisks();
  if(!values.includes(state.risk)) state.risk=null;
  $('riskButtons').innerHTML = values.map(v=>`<button class="risk-btn ${state.risk===v?'selected':''}" data-risk="${v}"><span>${chipLabel(v)}</span><small>${v.toFixed(1)}</small></button>`).join('');
  $('riskInfo').innerHTML = state.risk
    ? `Arriesgas <b>${state.risk.toFixed(1)}</b> décimas académicas. ${state.route ? `Si tu ficha ${routeLabel(state.route)} coincide, recibes <b>+${bonusText(state.route)}</b> porque P=${probabilityText(state.route)}.` : 'Cuando elijas ficha, se mostrará la bonificación por probabilidad.'} Si respondes bien, sumas <b>+${(2*state.risk).toFixed(1)}</b>; si respondes mal, bajas solo <b>-${(state.risk/2).toFixed(2)}</b>. Nivel: <b>${levelLabel(levelForRisk(state.risk))}</b>.`
    : 'Selecciona cuántas décimas académicas deseas arriesgar.';
}
function updateCurrentBet(){
  const hasBet = !!(state.route && state.risk);
  const route = state.route ? routeLabel(state.route) : '--';
  const risk = state.risk ? state.risk.toFixed(1) : '--';
  const level = state.risk ? levelLabel(levelForRisk(state.risk)) : '--';
  if($('currentRouteText')) $('currentRouteText').textContent=route;
  if($('currentRiskText')) $('currentRiskText').textContent=risk;
  if($('currentLevelText')) $('currentLevelText').textContent=level;
  if($('currentBetRule')) $('currentBetRule').textContent = hasBet
    ? `Coincidencia: +${bonusText(state.route)} · P=${probabilityText(state.route)} · Correcta: +${(2*state.risk).toFixed(1)} · Incorrecta: -${(state.risk/2).toFixed(2)}`
    : 'Configura ficha y décimas para activar el giro';
  const preview=$('betPreview');
  if(preview){
    preview.classList.toggle('ready', hasBet);
    preview.innerHTML = hasBet
      ? `Apuesta actual: <b>${route}</b> · <b>${risk}</b> décimas · nivel <b>${level}</b>. Probabilidad <b>${probabilityText(state.route)}</b> y bonificación si aciertas <b>+${bonusText(state.route)}</b>.`
      : 'Apuesta actual: elige ficha y décimas para activar el giro.';
  }
  if($('spinBtn')) $('spinBtn').disabled=!hasBet || !!state.spin || !!state.current;
}
function showBetMessage(message){
  const box=$('betError');
  if(box){
    box.textContent=message;
    box.classList.remove('hidden');
    box.classList.add('pulse');
    setTimeout(()=>box.classList.remove('pulse'),900);
  }
  if($('log')) $('log').textContent=message;
  requestFS();
}
function clearBetMessage(){
  const box=$('betError');
  if(box){ box.textContent=''; box.classList.add('hidden'); }
}
function betMissingMessage(){
  if(!state.route && !state.risk) return 'Falta elegir la ficha de ruleta y las décimas académicas. Esto no cuenta como infracción; completa esos datos para continuar.';
  if(!state.route) return 'Falta elegir una ficha de ruleta. Esto no cuenta como infracción; selecciona rojo, negro, verde, par, impar, rango o docena.';
  if(!state.risk) return 'Falta elegir cuántas décimas académicas vas a arriesgar. Esto no cuenta como infracción; selecciona una ficha de valor.';
  return '';
}
function renderScore(){
  state.score=clampNote(state.score);
  $('scoreText').textContent=`${state.score.toFixed(1)}/5.0`;
  renderRisks(); renderRoutes(); updateCurrentBet();
}
function updateClock(){
  const d=new Date();
  const txt=d.toLocaleTimeString('es-CO',{hour:'numeric',minute:'2-digit',second:'2-digit',hour12:true});
  if($('clock')) $('clock').textContent=txt;
  $$('.clockCopy').forEach(el=>el.textContent=txt);
}
function full(){ return !!document.fullscreenElement; }
async function requestFS(){
  try{
    if(!full() && document.documentElement.requestFullscreen){
      await document.documentElement.requestFullscreen({navigationUI:'hide'});
    }
  }catch(e){ console.warn('Pantalla completa no disponible todavía:', e?.message || e); }
}
async function exitFS(){
  try{ if(full() && document.exitFullscreen) await document.exitFullscreen(); }catch(e){}
}
function teacherCodeSet(){
  const d=new Date(), hh=String(d.getHours()).padStart(2,'0'), mm=String(d.getMinutes()).padStart(2,'0');
  return new Set([`${hh}${mm}`,`${hh}:${mm}`,`${hh}.${mm}`]);
}
function validTeacherCode(value){ return teacherCodeSet().has(String(value||'').trim()); }
function logSecurity(type, detail=''){
  state.security.push({type, detail, at:new Date().toLocaleString('es-CO',{hour12:true})});
}
function showBlock(type='Acción no permitida', detail=''){
  if(!state.fullscreen || state.allowExit || state.annulled) return;
  const now=Date.now();
  if(now-state.lastViolationAt<350) return;
  state.lastViolationAt=now;
  state.violations = (state.violations || 0) + 1;
  const count = state.violations;
  const messageDetail = `${detail || 'La mesa queda bloqueada hasta validación docente.'} Advertencia ${count}/${VIOLATION_LIMIT}: a la quinta infracción se anula el quiz con nota cero.`;
  logSecurity(type, messageDetail);

  if(count >= VIOLATION_LIMIT){
    state.annulled = true;
    state.score = 0;
    renderScore();
    if($('blocker')) $('blocker').classList.add('hidden');
    finish('Quiz anulado por completar 5 infracciones de seguridad. Nota final: 0.0', {teacher:false, exitFullscreen:false});
    return;
  }

  state.blockActive=true;
  if($('blockReason')) $('blockReason').textContent=`Se detectó: ${type}. ${messageDetail}`;
  if($('blockPass')) $('blockPass').value='';
  if($('blockError')) $('blockError').textContent=`Advertencia ${count}/${VIOLATION_LIMIT}. Si llega a 5 infracciones, el quiz se anula con nota 0.0.`;
  $('blocker').classList.remove('hidden');
}
function checkFS(){
  if(state.fullscreen && !full() && !state.allowExit){
    showBlock('salida de pantalla completa','Debe reingresarse la clave docente para continuar.');
  }
}
function startTimer(){
  clearInterval(state.timer);
  state.time=3600;
  $('timeText').textContent=fmtTime(state.time);
  state.timer=setInterval(()=>{
    state.time--;
    $('timeText').textContent=fmtTime(Math.max(0,state.time));
    if(state.time<=0) finish('Tiempo agotado', {teacher:false, exitFullscreen:false});
  },1000);
}

function pickQuestion(topic){
  const target=levelForRisk(state.risk);
  const candidates = target===2 ? [2,3] : target===3 ? [3,4] : target===4 ? [4,5] : [5,4];
  let pool=[];
  for(const d of candidates){
    pool=QUESTION_BANK.filter(q=>q.topic===topic && q.difficulty===d && !state.used.includes(q.id));
    if(pool.length) break;
  }
  if(!pool.length){
    for(const d of candidates){
      pool=QUESTION_BANK.filter(q=>q.difficulty===d && !state.used.includes(q.id));
      if(pool.length) break;
    }
  }
  if(!pool.length){ state.used=[]; pool=QUESTION_BANK.filter(q=>candidates.includes(q.difficulty)); }
  return pool[Math.floor(Math.random()*pool.length)];
}
function openQuestion(q, spin){
  state.current={q, spin, selected:null}; state.used.push(q.id);
  $('questionModal').classList.remove('hidden');
  $('qMeta').textContent=`${TOPIC_NAME[q.topic]} · ${kindLabel(q.kind)} · Nivel ${levelLabel(spin.level)} · Décimas ${state.risk.toFixed(1)}`;
  $('qTitle').textContent=q.title;
  const hint=normalizeLatex(q.hint || hintFor(q));
  $('qPrompt').innerHTML=`${mathHTML(q.prompt)}<details class="hint-box"><summary>▶ Pista estratégica</summary><div>${hint}</div></details>`;
  $('feedback').className='feedback hidden'; $('feedback').innerHTML='';
  $('continueBtn').classList.add('hidden'); $('submitAnswer').classList.remove('hidden');
  if(q.kind==='numeric'){
    $('qAnswerArea').innerHTML=`<div class="answer-label">Respuesta con número entero o decimal exacto</div><input id="numAnswer" class="numeric-input" inputmode="decimal" placeholder="Escribe solo el número final" />`;
  } else {
    $('qAnswerArea').innerHTML=`<div class="options ${q.kind}">${q.options.map((o,i)=>`<button class="option" data-i="${i}"><b>${String.fromCharCode(65+i)}.</b><span>${normalizeLatex(o)}</span></button>`).join('')}</div>`;
  }
  typeset();
}
function kindLabel(k){ return {mcq:'Opción múltiple', tf:'Verdadero/Falso', statements:'Afirmaciones I-IV', numeric:'Respuesta numérica'}[k] || 'Pregunta'; }
function isCorrect(q,val){ if(q.kind==='numeric') return Math.abs(Number(norm(val))-Number(q.answer))<1e-9; return Number(val)===Number(q.answer); }

function spin(){
  if(state.spin || state.current) return;
  const msg=betMissingMessage();
  if(msg){ openBetDialog(); showBetMessage(msg); return; }
  if(state.risk > state.score + 1e-9){ openBetDialog(); showBetMessage('La cantidad elegida supera tu nota actual. Esto no cuenta como infracción; selecciona una cantidad menor.'); renderScore(); return; }
  clearBetMessage();
  state.spin=true; updateCurrentBet();
  const betLevel=levelForRisk(state.risk);
  const idx=Math.floor(Math.random()*WHEEL.length), n=WHEEL[idx], col=color(n), topic=topicFor(n), seg=360/WHEEL.length;
  const targetAngle=360-(idx*seg+seg/2);
  state.rot += 360*6 + targetAngle;
  $('wheel').style.transform=`rotate(${state.rot}deg)`;
  $('log').textContent='La ruleta está girando. Espera la caída de la pelota.';
  setTimeout(()=>{
    state.ball -= 360*7 + targetAngle;
    $('ball').style.setProperty('--ballrot', `${state.ball}deg`);
    $('log').textContent='La pelota está cayendo en la ruleta...';
  }, 2600);
  setTimeout(()=>{
    state.spin=false; updateCurrentBet();
    $$('.num-cell').forEach(c=>c.classList.toggle('hot', Number(c.dataset.n)===n));
    $('lastBall').textContent=n; $('lastColor').textContent=col.toUpperCase(); $('lastLevel').textContent=levelLabel(betLevel); $('lastRoute').textContent=routeLabel(state.route);
    if($('lastResult')){ $('lastResult').textContent='Pregunta pendiente'; $('lastResult').className=''; }
    if($('lastDelta')){ $('lastDelta').textContent='--'; $('lastDelta').className=''; }
    const match=routeMatch(state.route, n);
    const bonusByProbability = match ? routeBonus(state.route) : 0;
    if(bonusByProbability>0){ applyScore(bonusByProbability); renderScore(); }
    $('log').innerHTML=`Cayó la balota <b>${n}</b> (${col}). Tu ficha <b>${routeLabel(state.route)}</b> ${match?`coincidió y ganaste <b>+${bonusByProbability.toFixed(2)}</b>`:'no coincidió'} con la caída. Ahora resuelve la pregunta.`;
    const q=pickQuestion(topic);
    openQuestion(q, {n, col, topic, risk:state.risk, route:state.route, routeMatch:match, routeBonus:bonusByProbability, routeProbability:routeProbability(state.route), routeFavorable:routeConfig(state.route)?.favorable || 0, routeBonusPotential:routeBonus(state.route), level:betLevel});
  }, 5200);
}
function answer(){
  const cur=state.current; if(!cur) return;
  const q=cur.q;
  const val=q.kind==='numeric' ? $('numAnswer')?.value : cur.selected;
  if(val===null || val===undefined || val===''){ alert('Selecciona o escribe una respuesta.'); return; }
  const ok=isCorrect(q,val);
  const questionDelta=ok ? (2*cur.spin.risk) : -(cur.spin.risk/2);
  applyScore(questionDelta);
  const totalDelta = (cur.spin.routeBonus||0) + questionDelta;
  state.history.push({id:q.id,title:q.title,kind:q.kind,topic:q.topic,difficulty:cur.spin.level,questionDifficulty:q.difficulty,risk:cur.spin.risk,route:cur.spin.route,routeMatch:cur.spin.routeMatch,routeBonus:cur.spin.routeBonus||0,routeProbability:cur.spin.routeProbability||routeProbability(cur.spin.route),routeFavorable:cur.spin.routeFavorable||routeConfig(cur.spin.route)?.favorable||0,routeBonusPotential:cur.spin.routeBonusPotential||routeBonus(cur.spin.route),ball:cur.spin.n,color:cur.spin.col,ok,questionDelta,totalDelta,score:state.score,prompt:q.prompt,hint:q.hint || hintFor(q),selected:q.kind==='numeric'?val:(q.options[Number(val)]||''),answer:q.kind==='numeric'?q.answer:q.options[q.answer],feedback:q.feedback});
  const roundResult = `${ok?'Respuesta correcta':'Respuesta incorrecta'} · ${cur.spin.routeMatch?`ficha coincidente +${(cur.spin.routeBonus||0).toFixed(2)}`:'sin bono de ficha'}`;
  state.lastRoundSummary = `Última balota lanzada: ${cur.spin.n} (${cur.spin.col}). Ficha ${routeLabel(cur.spin.route)}: ${cur.spin.routeMatch?`coincidió y otorgó +${(cur.spin.routeBonus||0).toFixed(2)}`:'no coincidió'}. ${ok?'Respuesta correcta':'Respuesta incorrecta'}. Movimiento total ${signedValue(totalDelta)}.`;
  if($('lastBall')) $('lastBall').textContent=cur.spin.n;
  if($('lastColor')) $('lastColor').textContent=String(cur.spin.col).toUpperCase();
  if($('lastLevel')) $('lastLevel').textContent=levelLabel(cur.spin.level);
  if($('lastRoute')) $('lastRoute').textContent=routeLabel(cur.spin.route);
  if($('lastResult')){ $('lastResult').textContent=roundResult; $('lastResult').className=ok?'good':'bad'; }
  if($('lastDelta')){ $('lastDelta').textContent=signedValue(totalDelta); $('lastDelta').className=totalDelta>=0?'good':'bad'; }
  $('feedback').className=`feedback ${ok?'good':'bad'}`;
  $('feedback').innerHTML=`<b>${ok?'Correcto':'Incorrecto'}.</b><br><b>Bonificación por ficha:</b> ${cur.spin.routeBonus>0?'+'+(cur.spin.routeBonus||0).toFixed(2):'0.00'} · <b>Movimiento por pregunta:</b> ${questionDelta>0?'+':''}${questionDelta.toFixed(2)} · <b>Movimiento total de la ronda:</b> ${totalDelta>0?'+':''}${totalDelta.toFixed(2)}.<br><br><div class="answer-line"><b>Tu respuesta:</b> ${q.kind==='numeric'?esc(val):normalizeLatex(q.options[Number(val)]||'')}</div><div class="answer-line"><b>Respuesta correcta:</b> ${q.kind==='numeric'?esc(q.answer):normalizeLatex(q.options[q.answer])}</div><div class="answer-line"><b>Ficha de ruleta:</b> ${routeLabel(cur.spin.route)} · P=${probabilityText(cur.spin.route)} · Bono máximo +${bonusText(cur.spin.route)} · Balota ${cur.spin.n} (${cur.spin.col}) · ${cur.spin.routeMatch?`coincidió y otorgó +${(cur.spin.routeBonus||0).toFixed(2)}`:'no coincidió'}.</div><br>${normalizeLatex(q.feedback)}<br><br><b>Nota actual:</b> ${state.score.toFixed(1)}/5.0${state.score<=0?' · El quiz queda finalizado con nota 0.0.':''}`;
  $('submitAnswer').classList.add('hidden'); $('continueBtn').classList.remove('hidden'); renderScore(); typeset();
  if(state.score>=5) setTimeout(()=>finish('Meta de 5.0 alcanzada', {teacher:false, exitFullscreen:false}),1200);
  if(state.score<=0) setTimeout(()=>finish('La nota llegó a 0.0. El quiz termina porque no quedan décimas disponibles', {teacher:false, exitFullscreen:false}),1200);
}
function closeQ(){ $('questionModal').classList.add('hidden'); state.current=null; state.route=null; state.risk=null; $('log').textContent=(state.lastRoundSummary ? state.lastRoundSummary + ' Abre el cuadro de apuesta para la siguiente ronda.' : 'Abre el cuadro de apuesta para la siguiente ronda.'); renderScore(); openBetDialog(); }

function openBetDialog(){
  if(noPlayableScore()){
    state.score = 0;
    renderScore();
    setTimeout(()=>finish('La nota llegó a 0.0. El quiz termina porque no quedan décimas disponibles', {teacher:false, exitFullscreen:false}),150);
    return;
  }
  if($('betModal')){ clearBetMessage(); renderScore(); $('betModal').classList.remove('hidden'); requestFS(); setTimeout(typeset,30); }
}
function closeBetDialog(){ const msg=betMissingMessage(); if(msg){ showBetMessage(msg); return; } clearBetMessage(); $('betModal').classList.add('hidden'); updateCurrentBet(); requestFS(); $('log').textContent=`Apuesta actual guardada: ${routeLabel(state.route)} · ${state.risk.toFixed(1)} décimas · nivel ${levelLabel(levelForRisk(state.risk))} · P=${probabilityText(state.route)} · bono si acierta +${bonusText(state.route)}. Ahora puedes girar la ruleta.`; }

function reportHtml(reason){
  const correct=state.history.filter(h=>h.ok).length;
  const total=state.history.length;
  const incorrect=Math.max(0,total-correct);
  const pct=total ? Math.round((correct/total)*100) : 0;
  const finalNote=state.score.toFixed(1);
  const student=esc($('studentName').value||'Estudiante');
  const generatedAt=new Date().toLocaleString('es-CO',{hour12:true});
  const htm = value => esc(normalizeLatex(value));
  const signed = value => `${Number(value)>=0?'+':''}${Number(value).toFixed(2)}`;
  const plan=state.score<=0
    ? 'El quiz terminó con nota 0.0. Reinicia el repaso desde valores propios, diagonalización básica, forma matricial de cónicas y lectura cuidadosa de la ficha antes de asumir riesgos altos.'
    : state.score>=5
      ? 'Mantener el nivel: resolver ejercicios integradores sin opciones, justificar los pasos con polinomio característico, espacios propios, cambio de base y forma canónica.'
      : state.score>=3.5
        ? 'Reforzar problemas largos: construir matrices de cambio, normalizar bases propias, diagonalizar formas cuadráticas y revisar errores de signo en determinantes y discriminantes.'
        : 'Plan urgente: practicar valores propios, diagonalización, cónicas, Jordan y valores complejos con procedimientos escritos antes de volver al juego.';
  const secRows = state.security.length
    ? state.security.map((s,i)=>`<tr><td>${i+1}</td><td>${esc(s.at)}</td><td>${esc(s.type)}</td><td>${esc(s.detail)}</td></tr>`).join('')
    : '<tr><td colspan="4">No se registraron infracciones durante la partida.</td></tr>';
  const rows=state.history.map((h,i)=>`<tr>
      <td>${i+1}</td>
      <td>${TOPIC_NAME[h.topic]}</td>
      <td>${kindLabel(h.kind)}</td>
      <td><span class="badge level">${levelLabel(h.difficulty)}</span></td>
      <td>${routeLabel(h.route)}</td>
      <td>${h.ball} <small>(${h.color})</small></td>
      <td>${h.risk.toFixed(1)}</td>
      <td>${h.routeFavorable||Math.round((h.routeProbability||0)*37)}/37 ≈ ${((h.routeProbability||0)*100).toFixed(1)}%</td>
      <td>${signed(h.routeBonus||0)}</td>
      <td class="${h.ok?'ok':'bad'}">${h.ok?'Correcta':'Incorrecta'}</td>
      <td>${signed(h.questionDelta ?? h.delta ?? 0)}</td>
      <td>${signed(h.totalDelta ?? (h.delta||0))}</td>
      <td><b>${h.score.toFixed(1)}</b></td>
    </tr>`).join('');
  const details=state.history.map((h,i)=>`<section class="question-detail">
      <div class="detail-header">
        <div>
          <span class="eyebrow">Pregunta ${i+1}</span>
          <h3>${esc(h.title || (TOPIC_NAME[h.topic]+' · '+kindLabel(h.kind)))}</h3>
        </div>
        <div class="detail-meta">
          <span>${TOPIC_NAME[h.topic]}</span>
          <span>${kindLabel(h.kind)}</span>
          <span>${levelLabel(h.difficulty)}</span>
        </div>
      </div>
      <div class="math-card prompt-report">${htm(h.prompt)}</div>
      <div class="hint-report"><b>Pista usada:</b> ${htm(h.hint || '')}</div>
      <div class="answer-grid">
        <div><b>Respuesta del estudiante</b><div class="answer-box ${h.ok?'answer-ok':'answer-bad'}">${htm(h.selected)}</div></div>
        <div><b>Respuesta correcta</b><div class="answer-box answer-correct">${htm(h.answer)}</div></div>
      </div>
      <div class="round-grid">
        <span><b>Ficha:</b> ${routeLabel(h.route)}</span>
        <span><b>Balota:</b> ${h.ball} (${h.color})</span>
        <span><b>Décimas:</b> ${h.risk.toFixed(1)}</span>
        <span><b>Probabilidad:</b> ${h.routeFavorable||Math.round((h.routeProbability||0)*37)}/37 ≈ ${((h.routeProbability||0)*100).toFixed(1)}%</span>
        <span><b>Bono ficha:</b> ${signed(h.routeBonus||0)} <small>(máx. +${Number(h.routeBonusPotential||routeBonus(h.route)||0).toFixed(2)})</small></span>
        <span><b>Pregunta:</b> ${signed(h.questionDelta ?? h.delta ?? 0)}</span>
        <span><b>Total ronda:</b> ${signed(h.totalDelta ?? (h.delta||0))}</span>
      </div>
      <div class="math-card feedback-report"><b>Retroalimentación matemática.</b><br>${htm(h.feedback)}</div>
    </section>`).join('');
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Informe HTML · Ruleta Lineal 5</title>
<script>
window.MathJax={
  tex:{inlineMath:[["\\(","\\)"],["$","$"]],displayMath:[["\\[","\\]"]],processEscapes:true,packages:{'[+]':['ams']}},
  loader:{load:['[tex]/ams']},
  chtml:{scale:1.08,mtextInheritFont:true,matchFontHeight:false},
  options:{skipHtmlTags:['script','noscript','style','textarea','pre','code']}
};
</script>
<script defer src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
<style>
:root{--green:#064e3b;--green2:#0f766e;--red:#b91c1c;--black:#111827;--gold:#f59e0b;--bg:#f3f6f3;--paper:#ffffff;--muted:#64748b;--line:#d8e1df;}
*{box-sizing:border-box} body{margin:0;background:radial-gradient(circle at top left,#e8fff4 0,#f8fafc 36%,#eef4ef 100%);color:#0f172a;font-family:Inter,Segoe UI,Arial,sans-serif;line-height:1.55}.page{max-width:1180px;margin:0 auto;padding:28px}.cover{position:relative;overflow:hidden;background:linear-gradient(135deg,#052e23,#065f46 48%,#111827);color:white;border-radius:28px;padding:34px;box-shadow:0 24px 60px rgba(15,23,42,.22)}.cover:after{content:"";position:absolute;right:-80px;top:-80px;width:260px;height:260px;border-radius:50%;border:28px solid rgba(245,158,11,.35)}.brand{letter-spacing:.18em;text-transform:uppercase;color:#fde68a;font-weight:900}.cover h1{font-size:clamp(2rem,5vw,4.2rem);line-height:.98;margin:.25rem 0}.cover p{max-width:820px;color:#dcfce7}.toolbar{display:flex;gap:12px;flex-wrap:wrap;margin-top:22px}.toolbar button{border:0;border-radius:999px;padding:11px 18px;font-weight:800;cursor:pointer}.print{background:#fbbf24;color:#111827}.summary{display:grid;grid-template-columns:repeat(4,minmax(150px,1fr));gap:14px;margin:20px 0}.metric{background:var(--paper);border:1px solid var(--line);border-radius:20px;padding:18px;box-shadow:0 12px 30px rgba(15,23,42,.07)}.metric span{color:var(--muted);font-size:.82rem;text-transform:uppercase;letter-spacing:.08em;font-weight:800}.metric b{display:block;font-size:2rem;color:var(--green);margin-top:4px}.card,.question-detail{background:rgba(255,255,255,.96);border:1px solid var(--line);border-radius:24px;padding:22px;margin:18px 0;box-shadow:0 14px 35px rgba(15,23,42,.08)}h2{color:var(--green);font-size:1.55rem;margin:0 0 14px}.table-wrap{overflow-x:auto;border-radius:18px;border:1px solid var(--line)}table{width:100%;border-collapse:collapse;background:white;font-size:.92rem}th{background:#111827;color:white;text-align:left;padding:10px;white-space:nowrap}td{border-top:1px solid #e2e8f0;padding:9px;vertical-align:top}tr:nth-child(even) td{background:#f8fafc}.ok{color:#15803d;font-weight:900}.bad{color:#dc2626;font-weight:900}.badge{display:inline-flex;border-radius:999px;padding:4px 9px;font-weight:900;font-size:.78rem}.level{background:#ecfdf5;color:#065f46;border:1px solid #a7f3d0}.detail-header{display:flex;justify-content:space-between;gap:16px;align-items:flex-start;border-bottom:1px solid var(--line);padding-bottom:12px;margin-bottom:16px}.eyebrow{color:var(--gold);font-weight:900;text-transform:uppercase;letter-spacing:.12em;font-size:.76rem}.detail-header h3{margin:.2rem 0 0;color:#111827;font-size:1.25rem}.detail-meta{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}.detail-meta span{background:#111827;color:#fff;border-radius:999px;padding:5px 9px;font-size:.78rem;font-weight:800}.math-card{overflow-x:auto;border-radius:18px;padding:16px}.prompt-report{background:linear-gradient(180deg,#0f172a,#111827);color:#f8fafc;border-left:7px solid var(--gold)}.feedback-report{background:#ecfdf5;border:1px solid #86efac;color:#052e16}.hint-report{margin:12px 0;padding:12px 14px;border-radius:16px;background:#fff7ed;border:1px solid #fed7aa;color:#7c2d12}.answer-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin:14px 0}.answer-box{margin-top:7px;min-height:56px;padding:12px;border-radius:16px;overflow-x:auto;background:#f8fafc;border:1px solid #cbd5e1}.answer-ok{border-color:#22c55e;background:#f0fdf4}.answer-bad{border-color:#ef4444;background:#fef2f2}.answer-correct{border-color:#16a34a;background:#ecfdf5}.round-grid{display:grid;grid-template-columns:repeat(3,minmax(150px,1fr));gap:8px;margin:14px 0}.round-grid span{background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:10px}.security-table td{font-size:.88rem}.footer{color:#64748b;text-align:center;padding:26px}.MJX-TEX{font-size:108%!important}.prompt-report mjx-container{color:#f8fafc!important}.prompt-report mjx-container *{color:#f8fafc!important}@media(max-width:780px){.page{padding:14px}.summary,.answer-grid,.round-grid{grid-template-columns:1fr}.detail-header{display:block}.detail-meta{justify-content:flex-start;margin-top:10px}}@media print{body{background:white}.page{max-width:none;padding:0}.cover,.card,.question-detail,.metric{box-shadow:none}.toolbar{display:none}.question-detail{break-inside:avoid}a{color:inherit}}
</style>
</head>
<body>
<div class="page">
  <section class="cover">
    <div class="brand">Ruleta Lineal 5</div>
    <h1>Informe HTML interactivo</h1>
    <p>Reporte matemático con LaTeX visible, retroalimentación detallada, bonificación probabilística por ficha de ruleta, movimientos de nota y registro de seguridad.</p>
    <div class="toolbar"><button class="print" onclick="window.print()">Imprimir o guardar como PDF</button><button onclick="window.MathJax&&MathJax.typesetPromise&&MathJax.typesetPromise()">Renderizar LaTeX</button></div>
  </section>
  <section class="summary">
    <div class="metric"><span>Estudiante</span><b style="font-size:1.15rem">${student}</b></div>
    <div class="metric"><span>Nota final</span><b>${finalNote}</b></div>
    <div class="metric"><span>Correctas</span><b>${correct}/${total}</b></div>
    <div class="metric"><span>Desempeño</span><b>${pct}%</b></div>
  </section>
  <section class="card"><h2>Resultado general</h2><p><b>Resultado:</b> ${esc(reason)}</p><p><b>Generado:</b> ${generatedAt}</p><p><b>Regla de ronda:</b> la ficha acertada suma una bonificación probabilística \[B(A)=1-P(A),\qquad P(A)=\frac{|A|}{37}.\] Una respuesta correcta suma \(2d\), donde \(d\) son las décimas arriesgadas; una respuesta incorrecta resta \(d/2\).</p><p><b>Infracciones registradas:</b> ${state.violations || 0}/5.</p></section>
  <section class="card"><h2>Plan de mejora</h2><p>${esc(plan)}</p></section>
  <section class="card"><h2>Resumen de intentos</h2><div class="table-wrap"><table><thead><tr><th>#</th><th>Tema</th><th>Tipo</th><th>Nivel</th><th>Ficha</th><th>Balota</th><th>Décimas</th><th>Probabilidad</th><th>Bono ficha</th><th>Resultado</th><th>Pregunta</th><th>Total</th><th>Nota</th></tr></thead><tbody>${rows || '<tr><td colspan="13">No hubo preguntas respondidas.</td></tr>'}</tbody></table></div></section>
  <section class="card"><h2>Registro de seguridad</h2><div class="table-wrap"><table class="security-table"><thead><tr><th>#</th><th>Fecha y hora</th><th>Evento</th><th>Detalle</th></tr></thead><tbody>${secRows}</tbody></table></div></section>
  <section><h2>Preguntas, respuestas y retroalimentación</h2>${details || '<div class="card">No se registraron preguntas para mostrar.</div>'}</section>
  <div class="footer">Informe generado automáticamente por Ruleta Lineal 5 · Álgebra Lineal</div>
</div>
</body>
</html>`;
}

function downloadReport(reason){ const html=reportHtml(reason); const blob=new Blob([html],{type:'text/html;charset=utf-8'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`Informe_Ruleta_Lineal5_${Date.now()}.html`; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),1000); }
async function finish(reason='Partida finalizada por el docente', opts={}){
  const {teacher=true, exitFullscreen=true}=opts || {};
  clearInterval(state.timer);
  downloadReport(reason);
  alert(`${reason}. Nota final: ${state.score.toFixed(1)}/5.0. Se descargó el informe.`);
  state.fullscreen=false;
  state.allowExit=true;
  state.blockActive=false;
  $('blocker')?.classList.add('hidden');
  $('teacherModal')?.classList.add('hidden');
  if(exitFullscreen) await exitFS();
}
function openTeacherModal(action='finish'){
  state.teacherAction=action;
  if($('teacherPass')) $('teacherPass').value='';
  if($('teacherError')) $('teacherError').textContent='';
  $('teacherModal').classList.remove('hidden');
  setTimeout(()=>$('teacherPass')?.focus(),80);
}
async function confirmTeacher(){
  if(!validTeacherCode($('teacherPass')?.value)){
    $('teacherError').textContent='Clave incorrecta.';
    logSecurity('intento fallido de clave docente','Se ingresó una clave docente inválida.');
    return;
  }
  $('teacherModal').classList.add('hidden');
  $('teacherError').textContent='';
  state.allowExit=true;
  if(state.teacherAction==='finish') await finish('Partida finalizada por el docente', {teacher:true, exitFullscreen:true});
  else if(state.teacherAction==='exit') await exitFS();
}

function bind(){
  const tryInitialFullscreen=()=>{ if(!full()) requestFS(); };
  ['pointerdown','keydown','touchstart'].forEach(ev=>document.addEventListener(ev, tryInitialFullscreen, {once:false, passive:true}));
  if($('howToPlayBtn')) $('howToPlayBtn').onclick=()=>{ $('howToPlayModal')?.classList.remove('hidden'); setTimeout(typeset,80); };
  if($('closeHowToPlay')) $('closeHowToPlay').onclick=()=>$('howToPlayModal')?.classList.add('hidden');
  if($('closeHowToPlay2')) $('closeHowToPlay2').onclick=()=>$('howToPlayModal')?.classList.add('hidden');
  $('unlockBtn').onclick=async()=>{
    if(norm($('password').value)!=='lineal5'){ $('lockError').textContent='Contraseña incorrecta.'; return; }
    state.fullscreen=true;
    await requestFS();
    $('lockScreen').classList.remove('active');
    $('setupScreen').classList.add('active');
  };
  $('startBtn').onclick=async()=>{
    state.score=1.0; state.history=[]; state.used=[]; state.risk=null; state.route=null; state.current=null; state.security=[]; state.violations=0; state.annulled=false; state.allowExit=false; state.blockActive=false; state.fullscreen=true; state.lastRoundSummary=''; if($('lastResult')){ $('lastResult').textContent='Pendiente'; $('lastResult').className=''; } if($('lastDelta')){ $('lastDelta').textContent='--'; $('lastDelta').className=''; }
    await requestFS();
    $('setupScreen').classList.remove('active');
    $('gameScreen').classList.remove('hidden');
    startTimer(); renderScore(); setTimeout(openBetDialog,250);
  };
  $('spinBtn').onclick=spin;
  $('openBetBtn').onclick=openBetDialog;
  $('confirmBet').onclick=closeBetDialog;
  $('closeBet').onclick=()=>{ const msg=betMissingMessage(); if(msg){ showBetMessage(msg); return; } clearBetMessage(); $('betModal').classList.add('hidden'); updateCurrentBet(); requestFS(); };
  $('finishBtn').onclick=()=>openTeacherModal('finish');
  $('cancelTeacher').onclick=async()=>{ $('teacherModal').classList.add('hidden'); state.teacherAction=null; await requestFS(); };
  $('confirmTeacher').onclick=confirmTeacher;
  $('teacherPass').addEventListener('keydown',e=>{ if(e.key==='Enter') confirmTeacher(); });
  document.addEventListener('click',e=>{
    const route=e.target.closest('.route-btn');
    if(route){ state.route=route.dataset.route; clearBetMessage(); renderRoutes(); updateCurrentBet(); }
    const rb=e.target.closest('.risk-btn');
    if(rb){ state.risk=Number(rb.dataset.risk); clearBetMessage(); renderRisks(); updateCurrentBet(); }
    const op=e.target.closest('.option');
    if(op){ $$('.option').forEach(x=>x.classList.remove('selected')); op.classList.add('selected'); if(state.current) state.current.selected=Number(op.dataset.i); }
  });
  $('submitAnswer').onclick=answer;
  $('continueBtn').onclick=closeQ;
  $('closeQuestion').onclick=()=>alert('Primero responde la pregunta para continuar.');
  $('unlockBlock').onclick=async()=>{
    if(validTeacherCode($('blockPass').value)){
      await requestFS();
      $('blocker').classList.add('hidden');
      $('blockError').textContent='';
      state.blockActive=false;
      $('blockPass').value='';
    } else {
      $('blockError').textContent='Clave incorrecta.';
      logSecurity('intento fallido de desbloqueo','Se ingresó una clave docente inválida en el bloqueo.');
    }
  };
  $('blockPass').addEventListener('keydown',e=>{ if(e.key==='Enter') $('unlockBlock').click(); });
  document.addEventListener('fullscreenchange',()=>setTimeout(checkFS,100));
  document.addEventListener('visibilitychange',()=>{ if(document.hidden&&state.fullscreen&&!state.allowExit) showBlock('cambio de pestaña o minimización','La actividad perdió visibilidad.'); });
  window.addEventListener('blur',()=>{ if(state.fullscreen&&!state.allowExit) setTimeout(()=>showBlock('cambio de ventana','La ventana del juego perdió el foco.'),300); });
  document.addEventListener('contextmenu',e=>{ if(state.fullscreen){ e.preventDefault(); showBlock('clic derecho','El menú contextual está bloqueado durante la partida.'); } });
  document.addEventListener('copy',e=>{ if(state.fullscreen){ e.preventDefault(); showBlock('copia de contenido','No se permite copiar contenido durante la partida.'); } });
  document.addEventListener('cut',e=>{ if(state.fullscreen){ e.preventDefault(); showBlock('corte de contenido','No se permite cortar contenido durante la partida.'); } });
  document.addEventListener('keydown',e=>{
    if(!state.fullscreen) return;
    const k=(e.key||'').toLowerCase();
    const code=e.code||'';
    const suspicious =
      k==='escape' || k==='f12' || k==='f5' || code==='PrintScreen' || k==='printscreen' ||
      (e.ctrlKey && ['p','s','u','r','w'].includes(k)) ||
      ((e.ctrlKey||e.metaKey) && e.shiftKey && ['i','j','c','s','3','4','5'].includes(k)) ||
      (e.altKey && ['tab','f4','arrowleft','arrowright'].includes(k));
    if(suspicious){
      e.preventDefault(); e.stopPropagation();
      const label = code==='PrintScreen'||k==='printscreen' ? 'intento de pantallazo' : k==='escape' ? 'tecla Escape' : 'atajo restringido';
      showBlock(label, 'Se detectó una combinación de teclas no permitida.');
    }
  }, true);
  window.addEventListener('beforeprint',e=>{ if(state.fullscreen){ showBlock('intento de impresión o captura','Se intentó imprimir o capturar la actividad.'); } });
  window.addEventListener('beforeunload',e=>{ if(state.fullscreen&&!state.allowExit){ e.preventDefault(); e.returnValue=''; } });
}
function boot(){ buildTable(); buildWheel(); bind(); updateClock(); setInterval(updateClock,1000); renderScore(); }
boot();
