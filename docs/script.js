// 导航滚动状态
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// 移动端菜单
const toggle = document.getElementById('navToggle');
const links = document.getElementById('navLinks');
toggle.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  toggle.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
});
links.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    links.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }
});

// 滚动进入动画
const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

// 首屏内容随滚动淡出
const heroInner = document.querySelector('.hero-inner');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (heroInner && !reducedMotion) {
  const fadeHero = () => {
    const progress = Math.min(1, window.scrollY / (window.innerHeight * 0.55));
    if (progress <= 0) {
      // 顶部时清掉内联样式，避免合成层让渐变文字渲染异常
      heroInner.style.opacity = '';
      heroInner.style.transform = '';
    } else {
      heroInner.style.opacity = String(1 - progress);
      heroInner.style.transform = `translateY(${progress * -64}px)`;
    }
  };
  fadeHero();
  window.addEventListener('scroll', fadeHero, { passive: true });
}

/* ============================================================
   数字滚动：滚动到视口时 easeOutExpo 递增
   ============================================================ */
const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

function formatNumber(value, decimals) {
  if (decimals > 0) {
    return value.toFixed(decimals);
  }
  return Math.round(value).toLocaleString('en-US');
}

function runCounter(el) {
  const target = parseFloat(el.dataset.count);
  const decimals = parseInt(el.dataset.dec || '0', 10);
  if (Number.isNaN(target)) return;
  const duration = 1600;
  const start = performance.now();
  const tick = (now) => {
    const t = Math.min(1, (now - start) / duration);
    el.textContent = formatNumber(target * easeOutExpo(t), decimals);
    if (t < 1) requestAnimationFrame(tick);
    else el.textContent = formatNumber(target, decimals);
  };
  requestAnimationFrame(tick);
}

const counters = document.querySelectorAll('[data-count]');
if (counters.length) {
  if (reducedMotion) {
    // 尊重系统设置：直接显示最终值，不做动画
    counters.forEach((el) => {
      el.textContent = formatNumber(
        parseFloat(el.dataset.count),
        parseInt(el.dataset.dec || '0', 10)
      );
    });
  } else {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            runCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.4, rootMargin: '0px 0px -60px 0px' }
    );
    counters.forEach((el) => counterObserver.observe(el));
  }
}

/* ============================================================
   卡片 3D 倾斜：鼠标移动时更新 CSS 变量（rAF 节流）
   ============================================================ */
const tiltCards = document.querySelectorAll('.tilt');
if (tiltCards.length && !reducedMotion && window.matchMedia('(hover: hover)').matches) {
  const MAX = 7; // 最大倾斜角度（度）
  let pending = null;
  let frame = 0;

  const applyTilt = (card, nx, ny) => {
    const rx = (-ny * MAX).toFixed(2);
    const ry = (nx * MAX).toFixed(2);
    card.style.setProperty('--rx', `${rx}deg`);
    card.style.setProperty('--ry', `${ry}deg`);
  };

  const flush = () => {
    frame = 0;
    if (!pending) return;
    applyTilt(pending.card, pending.nx, pending.ny);
    pending = null;
  };

  const schedule = (card, nx, ny) => {
    pending = { card, nx, ny };
    if (!frame) frame = requestAnimationFrame(flush);
  };

  tiltCards.forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      schedule(card, nx, ny);
    });
    card.addEventListener('pointerleave', () => {
      schedule(card, 0, 0);
    });
  });
}

/* ============================================================
   新增章节进场：背景光晕淡入
   ============================================================ */
const glowSections = document.querySelectorAll('.section-glow');
if (glowSections.length) {
  const glowObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const host = entry.target.parentElement;
        if (entry.isIntersecting) {
          host.classList.add('in-view');
          glowObserver.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.05 }
  );
  glowSections.forEach((el) => glowObserver.observe(el));
}
