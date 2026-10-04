/* ============================================================
   Video Converter · GitHub Pages 主站脚本
   ============================================================ */

// 年份
document.getElementById('year').textContent = new Date().getFullYear();

// 滚动渐显
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.card, .codec-card, .steps li, .download-card')
  .forEach(el => {
    el.classList.add('fade-up');
    observer.observe(el);
  });

// 导航栏滚动加深
const nav = document.querySelector('.nav');
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  nav.style.boxShadow = y > 10 ? '0 4px 24px rgba(0,0,0,.4)' : 'none';
  lastScroll = y;
}, { passive: true });
