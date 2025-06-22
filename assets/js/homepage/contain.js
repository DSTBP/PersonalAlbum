window.onload = function() {
    const loading = document.querySelector('.loading');
    const pageWrapper = document.getElementById('page-wrapper');

    if (loading) {
        loading.style.transition = 'opacity 1s';
        loading.style.opacity = '0';
        setTimeout(() => {
            loading.style.display = 'none';
            // 先确保主内容可见但透明
            pageWrapper.style.visibility = 'visible';
            setTimeout(() => {
                pageWrapper.style.opacity = '1';
            }, 50); // 50ms后再淡入，避免重叠
        }, 1000);
    } else {
        pageWrapper.style.visibility = 'visible';
        pageWrapper.style.opacity = '1';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const timeline = document.querySelector('#timeline');
    if (!timeline) return;

    const rowInner = timeline.querySelector('.row__inner');
    const tiles = Array.from(timeline.querySelectorAll('.tile'));
    const dotsContainer = timeline.querySelector('.timeline-dots');

    if (!rowInner || !tiles.length || !dotsContainer) {
        console.error('Timeline carousel elements not found');
        return;
    }

    // 1. 计算可见图片数量（以10为最大，自动适配）
    function getVisibleCount() {
        const containerWidth = rowInner.offsetWidth || rowInner.parentElement.offsetWidth;
        const tileWidth = tiles[0].offsetWidth + parseInt(getComputedStyle(tiles[0]).marginRight, 10);
        return Math.min(10, Math.floor(containerWidth / tileWidth) || 10);
    }
    let visibleCount = getVisibleCount();
    window.addEventListener('resize', () => {
        visibleCount = getVisibleCount();
    });

    // 2. 首尾各克隆visibleCount张slide
    const totalSlides = tiles.length;
    const clonesBefore = [];
    const clonesAfter = [];
    for (let i = 0; i < visibleCount; i++) {
        clonesBefore.push(tiles[totalSlides - visibleCount + i]?.cloneNode(true) || tiles[i % totalSlides].cloneNode(true));
        clonesAfter.push(tiles[i % totalSlides].cloneNode(true));
    }
    clonesBefore.forEach(clone => rowInner.prepend(clone));
    clonesAfter.forEach(clone => rowInner.appendChild(clone));

    // 3. 重新获取所有slide
    const allTiles = Array.from(rowInner.querySelectorAll('.tile'));
    const slideWidth = tiles[0].offsetWidth + parseInt(getComputedStyle(tiles[0]).marginRight, 10);
    let currentIndex = visibleCount; // 初始为第一个真实slide前的第visibleCount个克隆slide
    let isTransitioning = false;

    // 4. 设置初始位置
    rowInner.style.transform = `translateX(${-slideWidth * currentIndex}px)`;

    // 5. Dots
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        dot.addEventListener('click', () => {
            if (isTransitioning) return;
            goToSlide(i + visibleCount);
        });
        dotsContainer.appendChild(dot);
    }
    const dots = dotsContainer.querySelectorAll('.dot');
    function updateDots() {
        let dotIndex = (currentIndex - visibleCount + totalSlides) % totalSlides;
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === dotIndex);
        });
    }

    // 6. 滑动逻辑
    function goToSlide(targetIdx) {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex = targetIdx;
        rowInner.style.transition = 'transform 1.5s ease-in-out';
        rowInner.style.transform = `translateX(${-slideWidth * currentIndex}px)`;
        updateDots();
    }

    rowInner.addEventListener('transitionend', () => {
        // 到达首/尾克隆区时，瞬间跳转到真实slide区
        if (currentIndex < visibleCount) {
            rowInner.style.transition = 'none';
            currentIndex = currentIndex + totalSlides;
            rowInner.style.transform = `translateX(${-slideWidth * currentIndex}px)`;
            rowInner.offsetHeight;
            setTimeout(() => {
                rowInner.style.transition = 'transform 1.5s ease-in-out';
            }, 20);
        } else if (currentIndex >= totalSlides + visibleCount) {
            rowInner.style.transition = 'none';
            currentIndex = currentIndex - totalSlides;
            rowInner.style.transform = `translateX(${-slideWidth * currentIndex}px)`;
            rowInner.offsetHeight;
            setTimeout(() => {
                rowInner.style.transition = 'transform 1.5s ease-in-out';
            }, 20);
        }
        isTransitioning = false;
    });

    // 7. 自动滚动
    setInterval(() => {
        if (document.hidden) return;
        goToSlide(currentIndex + 1);
    }, 5000);

    // 8. 初始化
    updateDots();
});