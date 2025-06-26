const NUM_ROWS = 3;
const NUM_IMAGES = 36;

// 使用本地 photos 目录下的图片
const CUSTOM_IMAGES = [
  'photos/1.jpg','photos/2.jpg','photos/3.jpg','photos/4.jpg','photos/5.jpg','photos/6.jpg','photos/7.jpg','photos/8.jpg','photos/9.jpg','photos/10.jpg',
  'photos/11.jpg','photos/12.jpg','photos/13.jpg','photos/14.jpg','photos/15.jpg','photos/21.jpg','photos/25.jpg','photos/26.jpg','photos/27.jpg','photos/28.jpg',
  'photos/29.jpg','photos/30.jpg','photos/31.jpg','photos/34.jpg','photos/43.jpg','photos/54.jpg','photos/65.jpg','photos/IMG_20221020_144400.jpg'
];

const IMAGES = [];
for (let i = 0; i < NUM_IMAGES; i++) {
  let randomIndex = Math.floor(Math.random() * CUSTOM_IMAGES.length);
  IMAGES.push(CUSTOM_IMAGES[randomIndex]);
}

let rows = [];
for (let i = 0; i < NUM_ROWS; i++) {
  let row = document.createElement('div');
  row.classList.add('row');
  rows.push(row);
}

let wall = document.getElementById('wall');
for (let i = 0; i < IMAGES.length; i++) {
  let index = i % rows.length;
  let row = rows[index];
  let onBottomRow = index === rows.length - 1;
  if (onBottomRow) {
    let frame = document.createElement('div');
    frame.classList.add('frame');
    frame.innerHTML = `
      <img src="${IMAGES[i]}">
      <div class="reflection">
        <img src="${IMAGES[i]}">
      </div>
    `;
    row.appendChild(frame);
  } else {
    let img = document.createElement('img');
    img.src = IMAGES[i];
    row.appendChild(img);
  }
}

rows.forEach((row) => {
  wall.appendChild(row);
});

let debounce = (func, wait, immediate) => {
  var timeout;
  return function () {
    var context = this, args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

let scrollPosition = 0;
let scrollWall = debounce((event) => {
  scrollPosition -= event.deltaY;
  wall.style.transform = `rotateY(45deg) translateX(${scrollPosition}px)`;
}, 10);

window.addEventListener('wheel', scrollWall);
