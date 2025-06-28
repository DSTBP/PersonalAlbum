/*
==========================================
index.html 移动端适配 JavaScript
==========================================
专门为首页设计的移动端交互优化
不影响其他页面的功能
*/

document.addEventListener('DOMContentLoaded', function() {
    // 检测是否为移动设备
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (!isMobile && !isTouchDevice) {
        return; // 非移动设备不执行移动端优化
    }

    // 移动端轮播优化
    initMobileCarousel();
    
    // 移动端触摸滑动优化
    initTouchSwipe();
    
    // 移动端导航优化
    initMobileNavigation();
    
    // 移动端性能优化
    initMobilePerformance();
});

// 移动端轮播优化
function initMobileCarousel() {
    const slider = document.querySelector('.slider');
    if (!slider) return;

    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let isDragging = false;
    let isHorizontalSwipe = false;

    // 触摸开始
    slider.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isDragging = true;
        isHorizontalSwipe = false;
        slider.style.transition = 'none';
    }, { passive: true });

    // 触摸移动
    slider.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        
        currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const diffX = Math.abs(currentX - startX);
        const diffY = Math.abs(currentY - startY);
        
        // 判断是否为水平滑动
        if (!isHorizontalSwipe && diffX > 10) {
            isHorizontalSwipe = true;
        }
        
        // 只有在水平滑动时才阻止默认行为
        if (isHorizontalSwipe && diffX > diffY) {
            e.preventDefault();
            const diff = currentX - startX;
            // 添加视觉反馈 - 注释掉，防止图片移动
            // slider.style.transform = `translateX(${diff * 0.1}px)`;
        }
    }, { passive: false });

    // 触摸结束
    slider.addEventListener('touchend', function(e) {
        if (!isDragging) return;
        isDragging = false;
        // 移除过渡效果和位移重置，防止图片移动
        // slider.style.transition = 'transform 0.3s ease';
        // slider.style.transform = 'translateX(0)';
        
        // 只有在水平滑动时才处理轮播切换
        if (isHorizontalSwipe) {
            const diff = currentX - startX;
            const threshold = 50;
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    // 向右滑动 - 上一张
                    if (typeof moveSlider === 'function') {
                        moveSlider('prev');
                        resetInterval();
                    }
                } else {
                    // 向左滑动 - 下一张
                    if (typeof moveSlider === 'function') {
                        moveSlider('next');
                        resetInterval();
                    }
                }
            }
        }
    }, { passive: true });
}

// 移动端触摸滑动优化
function initTouchSwipe() {
    // 时光脉络和知交影谱的横向滑动
    const timelineRow = document.querySelector('#timeline .row__inner');
    const charactersRow = document.querySelector('#characters .row__inner');
    
    [timelineRow, charactersRow].forEach(row => {
        if (!row) return;
        
        let startX = 0;
        let startY = 0;
        let scrollLeft = 0;
        let isScrolling = false;
        let isHorizontalSwipe = false;

        row.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            scrollLeft = row.scrollLeft;
            isScrolling = true;
            isHorizontalSwipe = false;
        }, { passive: true });

        row.addEventListener('touchmove', function(e) {
            if (!isScrolling) return;
            
            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const diffX = Math.abs(currentX - startX);
            const diffY = Math.abs(currentY - startY);
            
            // 判断是否为水平滑动
            if (!isHorizontalSwipe && diffX > 10) {
                isHorizontalSwipe = true;
            }
            
            // 只有在水平滑动时才阻止默认行为并处理滚动
            if (isHorizontalSwipe && diffX > diffY) {
                e.preventDefault();
                const walk = (startX - currentX) * 2;
                row.scrollLeft = scrollLeft + walk;
            }
        }, { passive: false });

        row.addEventListener('touchend', function() {
            isScrolling = false;
        }, { passive: true });
    });

    // 意象集录轮播的触摸控制
    const imageryCarousel = document.querySelector('#imagery #carousel');
    if (imageryCarousel) {
        let startX = 0;
        let startY = 0;
        let currentIndex = 3; // 默认选中中间项
        let isHorizontalSwipe = false;

        imageryCarousel.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isHorizontalSwipe = false;
        }, { passive: true });

        imageryCarousel.addEventListener('touchmove', function(e) {
            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const diffX = Math.abs(currentX - startX);
            const diffY = Math.abs(currentY - startY);
            
            // 判断是否为水平滑动
            if (!isHorizontalSwipe && diffX > 10) {
                isHorizontalSwipe = true;
            }
            
            // 只有在水平滑动时才阻止默认行为
            if (isHorizontalSwipe && diffX > diffY) {
                e.preventDefault();
            }
        }, { passive: false });

        imageryCarousel.addEventListener('touchend', function(e) {
            // 只有在水平滑动时才处理轮播切换
            if (isHorizontalSwipe) {
                const endX = e.changedTouches[0].clientX;
                const diff = startX - endX;
                const threshold = 30;

                if (Math.abs(diff) > threshold) {
                    if (diff > 0 && currentIndex < 6) {
                        // 向左滑动 - 下一张
                        currentIndex++;
                        updateCarouselPosition();
                    } else if (diff < 0 && currentIndex > 0) {
                        // 向右滑动 - 上一张
                        currentIndex--;
                        updateCarouselPosition();
                    }
                }
            }
        }, { passive: true });

        function updateCarouselPosition() {
            const items = imageryCarousel.querySelectorAll('div');
            items.forEach((item, index) => {
                item.className = '';
                if (index === currentIndex) {
                    item.classList.add('selected');
                } else if (index === currentIndex - 1) {
                    item.classList.add('prev');
                } else if (index === currentIndex - 2) {
                    item.classList.add('prevLeftSecond');
                } else if (index === currentIndex + 1) {
                    item.classList.add('next');
                } else if (index === currentIndex + 2) {
                    item.classList.add('nextRightSecond');
                } else if (index < currentIndex - 2) {
                    item.classList.add('hideLeft');
                } else if (index > currentIndex + 2) {
                    item.classList.add('hideRight');
                }
            });
        }
    }
}

// 移动端导航优化
function initMobileNavigation() {
    const header = document.querySelector('header');
    const nav = header?.querySelector('nav');
    
    if (!nav) return;

    // 添加汉堡菜单（小屏幕）
    if (window.innerWidth <= 480) {
        const hamburger = document.createElement('button');
        hamburger.className = 'mobile-menu-toggle';
        hamburger.innerHTML = '<ion-icon name="menu-outline"></ion-icon>';
        hamburger.style.cssText = `
            display: none;
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0.5rem;
        `;

        header.insertBefore(hamburger, nav);
        
        // 移动端菜单切换
        hamburger.addEventListener('click', function() {
            nav.classList.toggle('mobile-open');
            hamburger.innerHTML = nav.classList.contains('mobile-open') 
                ? '<ion-icon name="close-outline"></ion-icon>' 
                : '<ion-icon name="menu-outline"></ion-icon>';
        });

        // 点击导航链接后关闭菜单
        nav.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                nav.classList.remove('mobile-open');
                hamburger.innerHTML = '<ion-icon name="menu-outline"></ion-icon>';
            }
        });

        // 添加移动端菜单样式
        const style = document.createElement('style');
        style.textContent = `
            @media screen and (max-width: 480px) {
                .mobile-menu-toggle {
                    display: block !important;
                }
                
                header nav {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background-color: rgba(0, 0, 0, 0.9);
                    flex-direction: column;
                    padding: 1rem;
                    transform: translateY(-100%);
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                }
                
                header nav.mobile-open {
                    transform: translateY(0);
                    opacity: 1;
                    visibility: visible;
                }
                
                header nav a {
                    margin: 0.5rem 0;
                    padding: 0.8rem;
                    border-radius: 8px;
                    text-align: center;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // 平滑滚动优化
    nav.addEventListener('click', function(e) {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            const targetId = e.target.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
}

// 移动端性能优化
function initMobilePerformance() {
    // 图片懒加载
    const images = document.querySelectorAll('img[src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        if (img.src.includes('photos/')) {
            img.dataset.src = img.src;
            img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PC9zdmc+';
            imageObserver.observe(img);
        }
    });

    // 减少重绘和回流
    let ticking = false;
    function updateLayout() {
        // 批量更新DOM操作
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateLayout);
            ticking = true;
        }
    }

    // 监听滚动事件优化
    window.addEventListener('scroll', function() {
        requestTick();
    }, { passive: true });

    // 移动端视口优化
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }

    // 注释掉防止双击缩放的代码，因为它可能影响页面滚动
    /*
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    */
}

// 移动端返回顶部优化
function initMobileBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;

    // 显示/隐藏按钮
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    }, { passive: true });

    // 平滑滚动到顶部
    backToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 移动端触摸反馈
    backToTopBtn.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.95)';
    }, { passive: true });

    backToTopBtn.addEventListener('touchend', function() {
        this.style.transform = 'scale(1)';
    }, { passive: true });
}

// 初始化返回顶部功能
document.addEventListener('DOMContentLoaded', initMobileBackToTop); 