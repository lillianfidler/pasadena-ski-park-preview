document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const slideshow = document.querySelector('.hero-slideshow');
  if (!slideshow) return;

  const images = Array.from(slideshow.querySelectorAll('.hero-bg'));
  const seasons = {};
  images.forEach((img) => {
    const season = img.dataset.season;
    (seasons[season] = seasons[season] || []).push(img);
  });

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const defaultSeason = 'winter';
  let currentSeason = defaultSeason;
  let currentIndex = 0;
  let timer = null;

  function show(season, index) {
    const set = seasons[season];
    if (!set || !set.length) return;
    images.forEach((img) => img.classList.remove('active'));
    set[((index % set.length) + set.length) % set.length].classList.add('active');
  }

  function startRotation(season) {
    currentSeason = season;
    currentIndex = 0;
    show(currentSeason, currentIndex);
    if (timer) clearInterval(timer);
    if (reduceMotion) return;
    timer = setInterval(() => {
      currentIndex += 1;
      show(currentSeason, currentIndex);
    }, 5000);
  }

  startRotation(defaultSeason);

  document.querySelectorAll('.hero-season-buttons [data-season]').forEach((link) => {
    const season = link.dataset.season;
    link.addEventListener('mouseenter', () => startRotation(season));
    link.addEventListener('focus', () => startRotation(season));
    link.addEventListener('mouseleave', () => startRotation(defaultSeason));
    link.addEventListener('blur', () => startRotation(defaultSeason));
  });
});
