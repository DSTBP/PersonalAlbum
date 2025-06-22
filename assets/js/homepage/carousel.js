const slider = document.querySelector('.slider');
const nextBtn = document.querySelector('.next');
const prevBtn = document.querySelector('.prev');
const dotsContainer = document.querySelector('.dots');

let items = document.querySelectorAll('.item');
let intervalId;

function createDots() {
    dotsContainer.innerHTML = '';
    items.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        dot.dataset.index = i;
        dot.addEventListener('click', () => {
            handleDotClick(i);
        });
        dotsContainer.appendChild(dot);
    });
}

function updateDots() {
    const activeItem = slider.children[1];
    if (!activeItem) return;
    
    const activeId = parseInt(activeItem.dataset.id, 10) - 1;
    const dots = document.querySelectorAll('.dots .dot');
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === activeId);
    });
}

function moveSlider(direction) {
    if (direction === 'next') {
        slider.append(slider.firstElementChild);
    } else if (direction === 'prev') {
        slider.prepend(slider.lastElementChild);
    }
    updateDots();
}

function handleDotClick(index) {
    const targetId = index + 1;
    let currentItems = Array.from(slider.children);
    let targetItemElement = slider.querySelector(`.item[data-id='${targetId}']`);
    
    if (!targetItemElement) return;

    let targetIndexInCurrentList = currentItems.indexOf(targetItemElement);

    const pivotIndex = (targetIndexInCurrentList - 1 + currentItems.length) % currentItems.length;

    const reorderedItems = [
        ...currentItems.slice(pivotIndex),
        ...currentItems.slice(0, pivotIndex)
    ];
    
    slider.innerHTML = '';
    reorderedItems.forEach(item => slider.appendChild(item));
    
    updateDots();
    resetInterval();
}


function startInterval() {
    clearInterval(intervalId);
    intervalId = setInterval(() => {
        moveSlider('next');
    }, 8000);
}

function resetInterval() {
    startInterval();
}

function init() {
    createDots();
    updateDots();
    startInterval();

    nextBtn.addEventListener('click', () => {
        moveSlider('next');
        resetInterval();
    });
    
    prevBtn.addEventListener('click', () => {
        moveSlider('prev');
        resetInterval();
    });
}

init();