onload = () =>{
    document.body.classList.remove("container");
};
window.addEventListener('load', () => {
  // kode lama tetap
  document.body.classList.remove('container');

  // generate bintang hanya kalau kontainernya ada
  const starsContainer = document.querySelector('.stars');
  if (!starsContainer) return;

  const numStars = 300; // boleh 150-300
  for (let i = 0; i < numStars; i++) {
    const star = document.createElement('div');
    star.className = 'star';

    // posisi random (hanya 50% tinggi layar = langit)
    star.style.top  = (Math.random() * 50) + '%';
    star.style.left = (Math.random() * 100) + '%';

    // ukuran & animasi acak biar natural
    const size = 1 + Math.random() * 3;      // 1–4px
    star.style.width  = size + 'px';
    star.style.height = size + 'px';
    star.style.animationDelay    = (Math.random() * 3) + 's';
    star.style.animationDuration = (2 + Math.random() * 3) + 's';

    starsContainer.appendChild(star);
  }
});

window.addEventListener('load', () => {
  // kode lama kamu
  document.body.classList.remove('container');

  const starsContainer = document.querySelector('.stars');
  if (!starsContainer) return;

  const numStars = 280; // atur kepadatan (200–350 enak)
  for (let i = 0; i < numStars; i++) {
    const star = document.createElement('div');
    star.className = 'star';

    // posisikan di DALAM container .stars (tingginya 50% layar)
    star.style.top  = (Math.random() * 100) + '%';  // 0–100% dari tinggi .stars
    star.style.left = (Math.random() * 100) + '%';

    // ukuran & animasi acak biar natural
    const size = 1 + Math.random() * 3;            // 1–4px
    star.style.width  = size + 'px';
    star.style.height = size + 'px';
    star.style.animationDelay    = (Math.random() * 3) + 's';
    star.style.animationDuration = (2 + Math.random() * 3) + 's';

    starsContainer.appendChild(star);
  }
});
// ==== SHOOTING STAR: putih, menukik lurus, durasi diperlambat ====
function createShootingStar(){
  const layer = document.querySelector('.shooting-stars');
  if(!layer) return;

  // pembungkus yang akan di-rotate
  const wrap = document.createElement('div');
  wrap.className = 'shooting-wrap';

  // start vertical agak atas biar "turun" terasa
  const topVh = 5 + Math.random()*25;         // 5–30vh
  wrap.style.setProperty('--top', topVh + 'vh');

  // sudut menukik (negatif = ke kiri bawah)
  const ang = -24 - Math.random()*10;         // -24° … -34°
  wrap.style.setProperty('--ang', ang + 'deg');

  // core meteor
  const star = document.createElement('div');
  star.className = 'shooting-star';

  // lebih panjang + durasi lebih lambat
  const len   = 260 + Math.random()*300;      // 260–560 px
  const thick = 2 + Math.random()*2;          // 2–4 px
  const dur   = 2.2 + Math.random()*2.0;      // 2.2–4.2 s (lebih lambat)

  star.style.setProperty('--len',   len + 'px');
  star.style.setProperty('--thick', thick + 'px');
  star.style.setProperty('--dur',   dur + 's');

  wrap.appendChild(star);
  layer.appendChild(wrap);

  // cleanup setelah animasi selesai
  setTimeout(() => wrap.remove(), dur*1000 + 300);
}

// loop: jarak kemunculan diperlambat biar elegan
(function meteorLoop(){
  createShootingStar();
  const delay = 1800 + Math.random()*3200;    // 1.8–5.0 s
  setTimeout(meteorLoop, delay);
})();

window.addEventListener('load', () => {
  const night   = document.querySelector('.night');
  const gate    = document.getElementById('gate');
  const flowers = document.querySelector('.flowers');
  const audio   = document.getElementById('bgm');

  // aktifkan transition setelah state awal terkunci
  document.body.classList.add('gate-ready');

  // ---- util: fade-in volume ----
  function fadeInAudio(el, target = 0.75, duration = 1800) {
    if (!el) return;
    const start = performance.now();
    el.volume = 0;
    const tick = (now) => {
      let p = (now - start) / duration;
      if (p < 0) p = 0;
      if (p > 1) p = 1;
      el.volume = target * p;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  let started = false;

  function startExperience() {
    if (started) return;
    started = true;

    // kunci state awal + reflow pada elemen bunga
    if (flowers) {
      flowers.style.opacity   = '0';
      flowers.style.transform = 'translateY(16px) scale(.985)';
      flowers.style.filter    = 'blur(2px)';
      void flowers.offsetHeight;
    }

    // toggle di frame berikut → transisi pasti jalan
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.body.classList.add('started');

        // rapikan inline setelah transisi selesai
        flowers?.addEventListener('transitionend', () => {
          flowers.style.opacity = flowers.style.transform = flowers.style.filter = '';
        }, { once: true });

        // ---- play music + fade-in ----
        if (audio) {
          try {
            audio.currentTime = 0;
            audio.volume = 0;                // mulai dari senyap
            const p = audio.play();          // HARUS di user gesture
            if (p && typeof p.then === 'function') {
              p.then(() => fadeInAudio(audio, 0.75, 1800)).catch(() => {});
            } else {
              fadeInAudio(audio, 0.75, 1800);
            }
          } catch (_) { /* autoplay bisa diblokir—abaikan */ }
        }
      });
    });
  }

  const start = () => startExperience();

  // tap/klik di langit atau teks; plus fallback di document
  ['pointerdown','touchstart','click'].forEach(evt => {
    night?.addEventListener(evt, start, { once:true, passive:true });
    gate?.addEventListener(evt,  start, { once:true, passive:true });
    document.addEventListener(evt, start, { once:true, passive:true });
  });
});
