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
