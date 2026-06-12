/* =====================================================
   ch.js  –  Birthday Gift Website
   ===================================================== */

// ──────────────────────────────────────────────
// INTRO SCREEN – Canvas Particle System
// ──────────────────────────────────────────────
(function initIntro() {
  const canvas  = document.getElementById('intro-canvas');
  const ctx     = canvas.getContext('2d');
  const nameEl  = document.getElementById('intro-name');
  const fillEl  = document.getElementById('loader-fill');
  const textEl  = document.getElementById('loader-text');
  const intro   = document.getElementById('intro-screen');
  const main    = document.getElementById('main-content');

  let W, H, particles = [], animFrame;

  // ── Resize ──
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // ── Particle class ──
  const EMOJIS   = ['❤️','🥹','💕','🫶🏻','💖','✨','🌸','💗','🌟'];
  const COLORS   = ['#ff6b8a','#ff8fab','#fbbf24','#a855f7','#c084fc','#ffd6e7'];

  function randomBetween(a, b) { return a + Math.random() * (b - a); }

  class Particle {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.x    = randomBetween(0, W);
      this.y    = initial ? randomBetween(0, H) : H + 40;
      this.size = randomBetween(10, 22);
      this.speedY = randomBetween(0.4, 1.1);
      this.speedX = randomBetween(-0.4, 0.4);
      this.opacity = randomBetween(0.25, 0.65);
      this.rot  = randomBetween(0, 360);
      this.rotSpeed = randomBetween(-1.2, 1.2);
      this.type = Math.random() > 0.45 ? 'emoji' : 'circle';
      this.emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    }
    update() {
      this.y   -= this.speedY;
      this.x   += this.speedX;
      this.rot += this.rotSpeed;
      if (this.y < -50) this.reset();
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rot * Math.PI) / 180);
      ctx.globalAlpha = this.opacity;
      if (this.type === 'emoji') {
        ctx.font = `${this.size}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.emoji, 0, 0);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
      ctx.restore();
    }
  }

  // Create particles
  for (let i = 0; i < 70; i++) particles.push(new Particle());

  // ── Canvas loop ──
  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    animFrame = requestAnimationFrame(loop);
  }
  loop();

  // ── Typewriter for name ──
  const nameStr = 'Happy Birthday chooti madm 🥺';
  let charIdx   = 0;
  function typeWriter() {
    if (charIdx <= nameStr.length) {
      nameEl.textContent = nameStr.slice(0, charIdx);
      charIdx++;
      setTimeout(typeWriter, 70);
    }
  }
  setTimeout(typeWriter, 600);

  // ── Loader bar ──
  const loadMessages = [
    'Loading your special gift...',
    'Collecting memories... 🥹',
    'Wrapping with love... ❤️',
    'Almost ready for you... 🎁',
    'Open with love 🫶🏻',
  ];
  let progress  = 0;
  let msgIdx    = 0;

  const loadInterval = setInterval(() => {
    progress += randomBetween(1.5, 4);
    if (progress >= 100) { progress = 100; clearInterval(loadInterval); }
    fillEl.style.width = progress + '%';

    const newMsgIdx = Math.floor((progress / 100) * (loadMessages.length - 1));
    if (newMsgIdx !== msgIdx) {
      msgIdx = newMsgIdx;
      textEl.style.opacity = 0;
      setTimeout(() => {
        textEl.textContent = loadMessages[msgIdx];
        textEl.style.transition = 'opacity 0.4s';
        textEl.style.opacity = 1;
      }, 250);
    }

    if (progress >= 100) {
      setTimeout(triggerTransition, 700);
    }
  }, 80);

  // ── Transition to main ──
  function triggerTransition() {
    cancelAnimationFrame(animFrame);
    intro.classList.add('fade-out');
    main.classList.remove('main-hidden');
    main.classList.add('main-visible');
    setTimeout(() => {
      intro.style.display = 'none';
      document.body.style.overflow = '';
      startMainPage();
    }, 950);
  }

  window.skipIntro = function () {
    clearInterval(loadInterval);
    triggerTransition();
  };

  // Prevent scrolling during intro
  document.body.style.overflow = 'hidden';
})();

// ──────────────────────────────────────────────
// MAIN PAGE INIT
// ──────────────────────────────────────────────
function startMainPage() {
  createFloatingHearts();
  initScrollAnimations();
}

// ──────────────────────────────────────────────
// FLOATING HEARTS  (background)
// ──────────────────────────────────────────────
function createFloatingHearts() {
  const container = document.getElementById('hearts-bg');
  const emojis = ['❤️','🥹','💕','🫶🏻','💖','🌸','✨','💗'];

  setInterval(() => {
    const heart = document.createElement('div');
    heart.classList.add('heart-float');
    heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    heart.style.left   = Math.random() * 100 + 'vw';
    heart.style.fontSize = (Math.random() * 1.2 + 0.8) + 'rem';
    heart.style.animationDuration = (Math.random() * 8 + 7) + 's';
    container.appendChild(heart);
    setTimeout(() => heart.remove(), 16000);
  }, 800);
}

// ──────────────────────────────────────────────
// SCROLL ANIMATIONS
// ──────────────────────────────────────────────
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity  = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.wish-card, .photo-item, .video-item, .gift-container')
    .forEach(el => {
      el.style.opacity   = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
      observer.observe(el);
    });
}

// ──────────────────────────────────────────────
// LIGHTBOX
// ──────────────────────────────────────────────
function openLightbox(item) {
  const img     = item.querySelector('img');
  const lightbox = document.getElementById('lightbox');
  const lbImg   = document.getElementById('lightbox-img');
  lbImg.src     = img.src;
  lbImg.alt     = img.alt;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

// ──────────────────────────────────────────────
// GIFT BOX REVEAL
// ──────────────────────────────────────────────
let giftOpened = false;

function revealGift() {
  if (giftOpened) return;
  giftOpened = true;

  const lid      = document.getElementById('gift-lid');
  const reveal   = document.getElementById('gift-reveal');
  const sparkles = document.getElementById('gift-sparkles');
  const tapText  = document.querySelector('.gift-tap-text');

  lid.classList.add('opened');

  // Sparkle burst
  for (let i = 0; i < 16; i++) {
    const dot   = document.createElement('div');
    dot.classList.add('sparkle-dot');
    const angle = (i / 16) * 360;
    const dist  = 60 + Math.random() * 50;
    dot.style.setProperty('--tx', Math.cos((angle * Math.PI) / 180) * dist + 'px');
    dot.style.setProperty('--ty', Math.sin((angle * Math.PI) / 180) * dist + 'px');
    dot.style.left = '50%';
    dot.style.top  = '50%';
    dot.style.animationDelay = (Math.random() * 0.3) + 's';
    const colors = ['#fbbf24','#ff6b8a','#a855f7','#ffffff','#ff8fab','#c084fc'];
    dot.style.background = colors[Math.floor(Math.random() * colors.length)];
    sparkles.appendChild(dot);
  }

  if (tapText) tapText.style.display = 'none';

  setTimeout(() => {
    reveal.classList.add('show');
    reveal.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 700);
}
