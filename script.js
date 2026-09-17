const gate = document.getElementById('gate');
const openBtn = document.getElementById('openBtn');
const invite = document.getElementById('invite');
const flash = document.getElementById('openingFlash');
const music = document.getElementById('bgMusic');
const soundBtn = document.getElementById('soundBtn');
const petalRain = document.getElementById('petalRain');
let opened = false;

function safePlayMusic(){
  music.volume = 0.55;
  music.play().then(()=>{
    soundBtn.hidden = false;
    soundBtn.classList.remove('muted');
  }).catch(()=>{
    // Файл музыки пока не добавлен или браузер запретил автозапуск.
    soundBtn.hidden = false;
    soundBtn.classList.add('muted');
  });
}

function buildPetals(){
  if(!petalRain || petalRain.childElementCount) return;
  const mobile = matchMedia('(max-width: 760px)').matches;
  const count = mobile ? 13 : 20;
  for(let i = 0; i < count; i++){
    const p = document.createElement('span');
    p.className = 'falling-petal';
    const img = document.createElement('img');
    img.src = 'assets/petal.png';
    img.alt = '';
    p.appendChild(img);

    const start = Math.random() * 100;
    const size = mobile ? 18 + Math.random() * 24 : 22 + Math.random() * 34;
    const dur = 9 + Math.random() * 10;
    const delay = -Math.random() * dur;
    const alpha = .22 + Math.random() * .45;
    const d1 = (-7 + Math.random() * 14) + 'vw';
    const d2 = (-10 + Math.random() * 20) + 'vw';
    const d3 = (-13 + Math.random() * 26) + 'vw';
    const tilt = (-45 + Math.random() * 90) + 'deg';

    p.style.setProperty('--x0', start + 'vw');
    p.style.setProperty('--size', size + 'px');
    p.style.setProperty('--dur', dur + 's');
    p.style.setProperty('--delay', delay + 's');
    p.style.setProperty('--alpha', alpha.toFixed(2));
    p.style.setProperty('--drift1', d1);
    p.style.setProperty('--drift2', d2);
    p.style.setProperty('--drift3', d3);
    p.style.setProperty('--tilt', tilt);
    petalRain.appendChild(p);
  }
}

openBtn.addEventListener('click', () => {
  if(opened) return;
  opened = true;
  gate.classList.add('cutting');
  safePlayMusic();
  buildPetals();

  setTimeout(()=> gate.classList.add('cut'), 980);
  setTimeout(()=> flash.classList.add('show'), 1450);
  setTimeout(()=>{
    gate.classList.add('opened');
    invite.setAttribute('aria-hidden','false');
    document.body.classList.remove('locked');
    petalRain.classList.add('active');
    window.scrollTo(0,0);
  }, 2350);
  setTimeout(()=> flash.classList.remove('show'), 2750);
});

soundBtn.addEventListener('click', () => {
  if(music.paused){
    music.play().then(()=>soundBtn.classList.remove('muted')).catch(()=>{});
  }else{
    music.pause();
    soundBtn.classList.add('muted');
  }
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
},{threshold:.14, rootMargin:'0px 0px -4% 0px'});
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!reduce){
  const items = [...document.querySelectorAll('.parallax')];
  let ticking = false;
  function updateParallax(){
    const vh = innerHeight;
    const mobile = innerWidth <= 760;
    items.forEach(el => {
      const r = el.getBoundingClientRect();
      const speed = parseFloat(el.dataset.speed || 0) * (mobile ? .58 : 1);
      const distance = (r.top + r.height/2 - vh/2) * speed;
      el.style.translate = `0 ${distance}px`;
    });
    ticking = false;
  }
  addEventListener('scroll',()=>{
    if(!ticking){ requestAnimationFrame(updateParallax); ticking = true; }
  },{passive:true});
  addEventListener('resize',()=>requestAnimationFrame(updateParallax),{passive:true});
  updateParallax();
}

// Countdown uses local event time for Shymkent/Kazakhstan (UTC+5).
const target = new Date('2026-09-22T13:00:00+05:00').getTime();
const dayEl = document.getElementById('days');
const hourEl = document.getElementById('hours');
const minuteEl = document.getElementById('minutes');
const secondEl = document.getElementById('seconds');
const countdownEl = document.getElementById('countdown');
const countdownDone = document.getElementById('countdownDone');

function pad2(n){ return String(n).padStart(2,'0'); }
function updateCountdown(){
  const diff = target - Date.now();
  if(diff <= 0){
    if(countdownEl) countdownEl.hidden = true;
    if(countdownDone) countdownDone.hidden = false;
    return;
  }
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  dayEl.textContent = String(days).padStart(2,'0');
  hourEl.textContent = pad2(hours);
  minuteEl.textContent = pad2(minutes);
  secondEl.textContent = pad2(seconds);
}
updateCountdown();
setInterval(updateCountdown,1000);

// Make the first content animate even if it entered before unlock.
setTimeout(()=>document.querySelectorAll('.hero .reveal').forEach(x=>x.classList.add('visible')),2500);
