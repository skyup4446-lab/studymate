// ===== 1. 모바일 메뉴 열고 닫기 =====
const menuBtn = document.getElementById('menu-btn');
const nav = document.getElementById('nav');

menuBtn.addEventListener('click', function () {
  const isOpen = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', isOpen);
  menuBtn.textContent = isOpen ? '✕' : '☰';
});

// 메뉴 항목을 누르면 메뉴가 닫혀요
nav.querySelectorAll('a').forEach(function (link) {
  link.addEventListener('click', function () {
    nav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', false);
    menuBtn.textContent = '☰';
  });
});


// ===== 2. 스터디카페 샘플 데이터 (가상의 데이터예요) =====
// x, y 는 지도 위의 위치(%), distance 는 미터, price 는 시간당 요금(원)
const cafes = [
  { name: '집중 스터디카페',   area: '강남', distance: 350,  price: 2000, rating: 4.8, reviews: 214, x: 56, y: 40 },
  { name: '플랜비 스터디',     area: '강남', distance: 620,  price: 1800, rating: 4.6, reviews: 158, x: 30, y: 25 },
  { name: '모두의 열람실',     area: '홍대', distance: 900,  price: 1500, rating: 4.5, reviews: 97,  x: 20, y: 62 },
  { name: '라온 스터디라운지', area: '홍대', distance: 450,  price: 2200, rating: 4.7, reviews: 183, x: 66, y: 66 },
  { name: '하루공부 신촌점',   area: '신촌', distance: 280,  price: 1700, rating: 4.4, reviews: 76,  x: 45, y: 78 },
  { name: '북적북적 스터디',   area: '신촌', distance: 760,  price: 1400, rating: 4.3, reviews: 64,  x: 80, y: 30 },
  { name: '건대 몰입존',       area: '건대', distance: 540,  price: 1900, rating: 4.9, reviews: 241, x: 38, y: 55 },
  { name: '오늘도 열공',       area: '건대', distance: 1100, price: 1300, rating: 4.2, reviews: 52,  x: 85, y: 75 }
];

const areaSelect = document.getElementById('area-select');
const sortSelect = document.getElementById('sort-select');
const listEl = document.getElementById('cafe-list');
const mapEl = document.getElementById('map');
const countEl = document.getElementById('result-count');

let activeName = null; // 지금 선택된 카페 이름

function formatPrice(n) { return n.toLocaleString('ko-KR') + '원'; }
function formatDistance(m) { return m >= 1000 ? (m / 1000).toFixed(1) + 'km' : m + 'm'; }

// 동네 선택 + 정렬을 적용해서 화면을 다시 그려요
function renderCafes() {
  const area = areaSelect.value;
  const sortBy = sortSelect.value;

  // 1) 동네로 거르기
  let result = cafes.filter(function (c) {
    return area === '전체' || c.area === area;
  });

  // 2) 정렬하기
  result.sort(function (a, b) {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'distance') return a.distance - b.distance;
    return a.price - b.price;
  });

  countEl.textContent = '총 ' + result.length + '곳';

  // 3) 목록 그리기
  listEl.innerHTML = '';
  if (result.length === 0) {
    listEl.innerHTML = '<p class="empty">조건에 맞는 스터디카페가 없어요.</p>';
  }
  result.forEach(function (c, i) {
    const card = document.createElement('div');
    card.className = 'cafe-card' + (c.name === activeName ? ' active' : '');
    card.innerHTML =
      '<div class="cafe-top">' +
        '<span class="cafe-name">' + (i === 0 ? '<span class="tag">1위</span>' : '') + c.name + '</span>' +
        '<span class="cafe-rating">★ ' + c.rating.toFixed(1) + '</span>' +
      '</div>' +
      '<div class="cafe-info">' +
        '<span>📍 ' + c.area + '</span>' +
        '<span>🚶 ' + formatDistance(c.distance) + '</span>' +
        '<span>💰 시간당 ' + formatPrice(c.price) + '</span>' +
      '</div>';
    card.addEventListener('click', function () { selectCafe(c.name); });
    listEl.appendChild(card);
  });

  // 4) 지도 핀 그리기 (기존 핀은 지우고 다시 만들어요)
  mapEl.querySelectorAll('.pin').forEach(function (p) { p.remove(); });
  result.forEach(function (c) {
    const pin = document.createElement('button');
    pin.type = 'button';
    pin.className = 'pin' + (c.name === activeName ? ' active' : '');
    pin.style.left = c.x + '%';
    pin.style.top = c.y + '%';
    pin.textContent = c.name;
    pin.addEventListener('click', function () { selectCafe(c.name); });
    mapEl.appendChild(pin);
  });
}

// 카페를 누르면 목록과 지도에서 같이 강조돼요
function selectCafe(name) {
  activeName = name;
  renderCafes();
}

areaSelect.addEventListener('change', function () { activeName = null; renderCafes(); });
sortSelect.addEventListener('change', renderCafes);
renderCafes();


// ===== 3. 베스트 스터디카페 TOP 3 (평점 → 후기 수 순) =====
const medals = ['🥇', '🥈', '🥉'];
const bestEl = document.getElementById('best-list');

cafes
  .slice() // 원본 순서를 바꾸지 않으려고 복사해요
  .sort(function (a, b) { return b.rating - a.rating || b.reviews - a.reviews; })
  .slice(0, 3)
  .forEach(function (c, i) {
    const card = document.createElement('div');
    card.className = 'best-card';
    card.innerHTML =
      '<div class="medal">' + medals[i] + '</div>' +
      '<h3>' + c.name + '</h3>' +
      '<div class="area">' + c.area + ' · 시간당 ' + formatPrice(c.price) + '</div>' +
      '<div class="score">★ ' + c.rating.toFixed(1) + '</div>' +
      '<div class="cnt">후기 ' + c.reviews + '개</div>';
    bestEl.appendChild(card);
  });


// ===== 4. 가입 폼: 내 브라우저에 저장해요 =====
// localStorage는 "이 컴퓨터의 이 브라우저" 안에만 저장돼요. (서버가 아니에요)
const form = document.getElementById('signup-form');
const message = document.getElementById('message');
const countText = document.getElementById('signup-count');
const STORAGE_KEY = 'studymate_signups';

function loadSignups() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function showCount() {
  const n = loadSignups().length;
  countText.textContent = n > 0 ? '이 브라우저에 저장된 가입 신청: ' + n + '건' : '';
}

form.addEventListener('submit', function (event) {
  event.preventDefault(); // 페이지가 새로고침되지 않게 막아요

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim().toLowerCase();
  const signups = loadSignups();

  // 같은 이메일이 이미 있는지 확인
  const already = signups.some(function (s) { return s.email === email; });
  if (already) {
    message.textContent = '이미 가입 신청된 이메일이에요.';
    message.classList.add('error');
    return;
  }

  signups.push({ name: name, email: email, date: new Date().toISOString() });
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(signups));
  } catch (e) {
    message.textContent = '저장에 실패했어요. 브라우저 설정을 확인해 주세요.';
    message.classList.add('error');
    return;
  }

  message.classList.remove('error');
  message.textContent = name + '님, 가입해 주셔서 감사합니다! 🎉';
  form.reset();
  showCount();
});

showCount();
