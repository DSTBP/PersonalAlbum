/**
 * 加载页功能
 */
window.onload = function () {
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


/**
 * 时间脉络轮播功能
 */
function initializeTimeline() {
    const timeline = document.querySelector('#timeline');
    if (!timeline) return;

    const rowInner = timeline.querySelector('.row__inner');
    const tiles = Array.from(timeline.querySelectorAll('.tile'));

    if (!rowInner || !tiles.length) {
        console.error('Timeline carousel elements not found');
        return;
    }

    // 固定可见图片数量为7
    const visibleCount = 7;

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

    // 6. 滑动逻辑
    function goToSlide(targetIdx) {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex = targetIdx;
        rowInner.style.transition = 'transform 1.5s ease-in-out';
        rowInner.style.transform = `translateX(${-slideWidth * currentIndex}px)`;
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

    const viewMoreBtn = document.querySelector('.view-more-btn');
    if (viewMoreBtn) {
        viewMoreBtn.addEventListener('click', () => {
            window.location.href = 'http://album.dstbp.net/timeline.html';
        });
    }
}

// 等待图片加载完成后再初始化
if (window.imagesLoader) {
    // 如果图片加载器存在，等待它完成后再初始化
    window.imagesLoader.initializeContent().then(() => {
        // 图片加载完成后，原有的初始化逻辑会被imagesLoader处理
    });
} else {
    // 如果没有图片加载器，直接初始化
    document.addEventListener('DOMContentLoaded', () => {
        initializeTimeline();
        initializeImagery();
        initializeCharacters();
        initializeMoments();
    });
}


/**
 * 意象集录轮播功能
 */
function initializeImagery() {
    const allImages = $("#carousel div");
    const imageCount = allImages.length;
    let autoPlayInterval;

    // 初始化自动播放
    function initAutoPlay() {
        autoPlayInterval = setInterval(() => moveToSelected("next"), 5000);
    }

    // 移动到指定图片
    function moveToSelected(direction) {
        let selectedIndex;

        // 根据不同的方向或选择器确定目标索引
        if (direction === "next" || direction === "prev") {
            selectedIndex = allImages.index($(".selected"));

            if (direction === "next") {
                selectedIndex = (selectedIndex + 1) % imageCount;
            } else {
                selectedIndex = (selectedIndex - 1 + imageCount) % imageCount;
            }
        } else {
            selectedIndex = allImages.index(direction);
        }

        const selected = allImages.eq(selectedIndex);
        const nextIndex = (selectedIndex + 1) % imageCount;
        const prevIndex = (selectedIndex - 1 + imageCount) % imageCount;
        const nextSecondIndex = (selectedIndex + 2) % imageCount;
        const prevSecondIndex = (selectedIndex - 2 + imageCount) % imageCount;

        const next = allImages.eq(nextIndex);
        const prev = allImages.eq(prevIndex);
        const nextSecond = allImages.eq(nextSecondIndex);
        const prevSecond = allImages.eq(prevSecondIndex);

        // 清除所有类名
        allImages.removeClass();

        // 添加新的类名
        selected.addClass("selected");
        prev.addClass("prev");
        next.addClass("next");
        prevSecond.addClass("prevLeftSecond");
        nextSecond.addClass("nextRightSecond");

        // 隐藏不需要显示的图片
        for (let i = 0; i < imageCount; i++) {
            if (![selectedIndex, prevIndex, nextIndex, prevSecondIndex, nextSecondIndex].includes(i)) {
                if (i < selectedIndex) {
                    allImages.eq(i).addClass("hideLeft");
                } else {
                    allImages.eq(i).addClass("hideRight");
                }
            }
        }
    }

    // 键盘导航
    $(document).keydown(function (e) {
        if (e.which === 37) moveToSelected("prev"); // 左箭头
        if (e.which === 39) moveToSelected("next"); // 右箭头
    });

    // 图片点击切换
    $("#carousel div").click(function () {
        moveToSelected($(this));
        // 重置自动播放计时器
        clearInterval(autoPlayInterval);
        initAutoPlay();
    });

    // "查看更多"按钮点击事件
    $('#imagery .view-more-btn').on('click', function () {
        window.location.href = 'http://album.dstbp.net/imagery.html';
    });

    // 鼠标悬停暂停自动播放
    $("#carousel").hover(
        () => clearInterval(autoPlayInterval),
        () => initAutoPlay()
    );

    // 初始化
    initAutoPlay();
}


/**
 * 知交影谱轮播功能
 */
function initializeCharacters() {
    const characters = document.querySelector('#characters');
    if (!characters) return;

    const rowInner = characters.querySelector('.row__inner');
    const tiles = Array.from(characters.querySelectorAll('.tile'));

    if (!rowInner || !tiles.length) {
        console.error('characters carousel elements not found');
        return;
    }

    const visibleCount = 7;
    const totalSlides = tiles.length;
    const clonesBefore = [];
    const clonesAfter = [];

    for (let i = 0; i < visibleCount; i++) {
        clonesBefore.push(tiles[totalSlides - visibleCount + i]?.cloneNode(true) || tiles[i % totalSlides].cloneNode(true));
        clonesAfter.push(tiles[i % totalSlides].cloneNode(true));
    }
    clonesBefore.forEach(clone => rowInner.prepend(clone));
    clonesAfter.forEach(clone => rowInner.appendChild(clone));

    const allTiles = Array.from(rowInner.querySelectorAll('.tile'));
    const slideWidth = tiles[0].offsetWidth + parseInt(getComputedStyle(tiles[0]).marginRight, 10);
    let currentIndex = visibleCount;
    let isTransitioning = false;
    let intervalId = null;

    rowInner.style.transform = `translateX(${-slideWidth * currentIndex}px)`;

    function goToSlide(targetIdx) {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex = targetIdx;
        rowInner.style.transition = 'transform 1.5s ease-in-out';
        rowInner.style.transform = `translateX(${-slideWidth * currentIndex}px)`;
    }

    rowInner.addEventListener('transitionend', () => {
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

    // "查看更多"按钮点击事件
    const viewMoreBtn = characters.querySelector('.view-more-btn');
    if (viewMoreBtn) {
        viewMoreBtn.addEventListener('click', () => {
            window.location.href = 'http://album.dstbp.net/characters.html';
        });
    }

    // 清除已有定时器，防止多次叠加
    if (window._charactersIntervalId) {
        clearInterval(window._charactersIntervalId);
    }
    window._charactersIntervalId = setInterval(() => {
        if (document.hidden) return;
        goToSlide(currentIndex - 1);
    }, 5000);
}


/* 
---------------------------
瞬间纪闻：3D 轮播功能
---------------------------
*/
function initializeMoments() {
    const momentsContainer = document.querySelector('#moments');
    if (!momentsContainer) return;

    const carousel = momentsContainer.querySelector('.carousel-3d');
    if (!carousel) return;

    const cells = carousel.querySelectorAll('.carousel-cell');
    const cellCount = cells.length;
    if (cellCount === 0) return;
    
    const theta = 360 / cellCount;
    const radius = Math.round((300 / 2) / Math.tan(Math.PI / cellCount));

    let selectedIndex = 0;
    let rotateY = 0;
    let startX = 0;
    let isDragging = false;

    function positionCells() {
        cells.forEach((cell, i) => {
            const cellAngle = theta * i;
            cell.style.transform = `rotateY(${cellAngle}deg) translateZ(-${radius}px)`;
        });
    }

    function rotateCarousel() {
        const angle = theta * selectedIndex * -1;
        rotateY = angle;
        carousel.style.transform = `translateZ(-${radius}px) rotateY(${angle}deg)`;
    }
    
    function onPointerDown(event) {
        isDragging = true;
        startX = event.pageX || event.touches[0].pageX;
        carousel.style.transition = 'none';
        // Prevent default drag behavior like text selection
        if (event.type === 'mousedown') {
            event.preventDefault();
        }
    }

    function onPointerMove(event) {
        if (!isDragging) return;
        const x = event.pageX || event.touches[0].pageX;
        const dx = x - startX;
        // The multiplier adjusts drag sensitivity
        rotateY += dx * 0.25; 
        carousel.style.transform = `translateZ(-${radius}px) rotateY(${rotateY}deg)`;
        startX = x;
    }

    function onPointerUp() {
        if (!isDragging) return;
        isDragging = false;
        carousel.style.transition = 'transform 1s';
        
        selectedIndex = Math.round(-rotateY / theta);
        rotateCarousel();
    }

    momentsContainer.addEventListener('mousedown', onPointerDown);
    document.addEventListener('mousemove', onPointerMove);
    document.addEventListener('mouseup', onPointerUp);

    momentsContainer.addEventListener('touchstart', onPointerDown, { passive: true });
    document.addEventListener('touchmove', onPointerMove, { passive: true });
    document.addEventListener('touchend', onPointerUp);

    positionCells();
    rotateCarousel();

    // "查看更多"按钮点击事件
    const viewMoreBtn = momentsContainer.querySelector('.view-more-btn');
    if (viewMoreBtn) {
        viewMoreBtn.addEventListener('click', () => {
            window.location.href = 'http://album.dstbp.net/moments.html';
        });
    }
}

// 返回顶部按钮功能
document.addEventListener('DOMContentLoaded', function () {
    // 页面刷新时自动滚动到顶部
    window.scrollTo({ top: 0, behavior: 'auto' });
    
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;
    // 显示/隐藏按钮
    window.addEventListener('scroll', function () {
        if (window.scrollY > 200) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });
    // 初始隐藏
    backToTopBtn.style.display = 'none';
    // 点击平滑滚动到顶部
    backToTopBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// 为所有"查看更多"按钮添加点击事件
function initializeViewMoreButtons() {
    const viewMoreButtons = document.querySelectorAll('.view-more-btn');
    
    viewMoreButtons.forEach((button, index) => {
        // 根据按钮的位置确定跳转URL
        let targetUrl = '';
        
        // 获取按钮所在的section
        const section = button.closest('section');
        if (section) {
            const sectionId = section.id;
            switch (sectionId) {
                case 'timeline':
                    targetUrl = 'http://album.dstbp.net/timeline.html';
                    break;
                case 'imagery':
                    targetUrl = 'http://album.dstbp.net/imagery.html';
                    break;
                case 'characters':
                    targetUrl = 'http://album.dstbp.net/characters.html';
                    break;
                case 'moments':
                    targetUrl = 'http://album.dstbp.net/moments.html';
                    break;
                default:
                    // 如果没有找到对应的section，使用默认URL
                    targetUrl = 'http://album.dstbp.net/';
            }
        }
        
        // 添加点击事件
        button.addEventListener('click', function() {
            window.location.href = targetUrl;
        });
    });
}

// 在图片加载完成后初始化"查看更多"按钮
if (window.imagesLoader) {
    window.imagesLoader.initializeContent().then(() => {
        initializeViewMoreButtons();
    });
} else {
    document.addEventListener('DOMContentLoaded', initializeViewMoreButtons);
}
