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

/* Home page weather box: live reading for Pasadena from Open-Meteo (free, no key). */
(function () {
  var box = document.getElementById('weather-live');
  if (!box) return;
  var codes = {0: 'Clear sky', 1: 'Mostly clear', 2: 'Partly cloudy', 3: 'Overcast', 45: 'Fog', 48: 'Freezing fog',
    51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle', 56: 'Freezing drizzle', 57: 'Freezing drizzle',
    61: 'Light rain', 63: 'Rain', 65: 'Heavy rain', 66: 'Freezing rain', 67: 'Freezing rain',
    71: 'Light snow', 73: 'Snow', 75: 'Heavy snow', 77: 'Snow grains', 80: 'Rain showers', 81: 'Rain showers',
    82: 'Heavy showers', 85: 'Snow showers', 86: 'Heavy snow showers', 95: 'Thunderstorm', 96: 'Thunderstorm with hail', 99: 'Thunderstorm with hail'};
  function clock(iso) {
    var t = iso.split('T')[1].split(':'), h = parseInt(t[0], 10);
    return ((h + 11) % 12 + 1) + ':' + t[1] + (h < 12 ? ' am' : ' pm');
  }
  var url = 'https://api.open-meteo.com/v1/forecast?latitude=48.96&longitude=-57.55' +
    '&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,wind_gusts_10m,relative_humidity_2m' +
    '&daily=sunrise,sunset&timezone=America%2FSt_Johns&forecast_days=1';
  fetch(url).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }).then(function (d) {
    var c = d.current;
    box.innerHTML =
      '<p class="weather-temp">' + Math.round(c.temperature_2m) + '&deg;C <span>' + (codes[c.weather_code] || '') + '</span></p>' +
      '<p class="weather-line">Feels like ' + Math.round(c.apparent_temperature) + '&deg;C &middot; Humidity ' + c.relative_humidity_2m + '%</p>' +
      '<p class="weather-line">Wind ' + Math.round(c.wind_speed_10m) + ' km/h, gusts ' + Math.round(c.wind_gusts_10m) + ' km/h</p>' +
      '<p class="weather-line">Sunrise ' + clock(d.daily.sunrise[0]) + ' &middot; Sunset ' + clock(d.daily.sunset[0]) + '</p>' +
      '<p class="weather-credit">Weather from Open-Meteo</p>';
  }).catch(function () {
    box.innerHTML = '<p class="widget-placeholder">The weather is taking a nap. Check Facebook for today’s trail conditions.</p>';
  });
})();
