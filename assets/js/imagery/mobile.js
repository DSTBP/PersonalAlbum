/*
==========================================
imagery.html 移动端滑动优化
==========================================
专门为意象集录页面设计的移动端滑动优化
解决手机端划不动的问题
*/

document.addEventListener('DOMContentLoaded', function() {
    // 检测是否为移动设备
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (!isMobile && !isTouchDevice) {
        return; // 非移动设备不执行移动端优化
    }

    // 移动端滑动优化
    initMobileScroll();
    
    // 移动端触摸优化
    initMobileTouch();
    
    // 移动端性能优化
    initMobilePerformance();
});

// 移动端滑动优化
function initMobileScroll() {
    // 确保页面可以正常滚动
    document.body.style.overflow = 'auto';
    document.body.style.webkitOverflowScrolling = 'touch';
    
    // 保留动画效果，但优化滚动
    const main = document.querySelector('main');
    if (main) {
        // 不移除transform，而是优化滚动性能
        main.style.overflow = 'visible';
        main.style.position = 'relative';
        main.style.willChange = 'transform'; // 优化变换性能
    }
    
    // 确保header不会阻止滚动
    const header = document.querySelector('header');
    if (header) {
        header.style.position = 'fixed';
        header.style.top = '0';
        header.style.left = '0';
        header.style.width = '100%';
        header.style.zIndex = '1000';
        header.style.pointerEvents = 'auto';
    }
    
    // 为body添加适当的padding，避免内容被header遮挡
    document.body.style.paddingTop = '60px';
}

// 移动端触摸优化
function initMobileTouch() {
    // 优化图片网格的触摸体验
    const figures = document.querySelectorAll('figure');
    figures.forEach(figure => {
        // 确保图片可以正常触摸
        figure.style.touchAction = 'manipulation';
        figure.style.webkitTouchCallout = 'none';
        figure.style.webkitUserSelect = 'none';
        figure.style.userSelect = 'none';
        
        // 添加触摸反馈
        figure.addEventListener('touchstart', function(e) {
            this.style.transform = 'scale(0.98)';
        }, { passive: true });
        
        figure.addEventListener('touchend', function(e) {
            this.style.transform = 'scale(1)';
        }, { passive: true });
        
        figure.addEventListener('touchcancel', function(e) {
            this.style.transform = 'scale(1)';
        }, { passive: true });
    });
    
    // 优化导航菜单的触摸体验
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.style.touchAction = 'manipulation';
        link.style.minHeight = '44px';
        link.style.minWidth = '44px';
        link.style.display = 'flex';
        link.style.alignItems = 'center';
        link.style.justifyContent = 'center';
    });
}

// 移动端性能优化
function initMobilePerformance() {
    // 图片懒加载优化
    const images = document.querySelectorAll('img');
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
        if (img.src.includes('unsplash.com')) {
            // 为移动端优化图片尺寸
            const optimizedSrc = img.src.replace('w=400', 'w=300&q=80');
            img.dataset.src = optimizedSrc;
            img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PC9zdmc+';
            imageObserver.observe(img);
        }
    });

    // 减少重绘和回流
    let ticking = false;
    function updateLayout() {
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
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes');
    }
    
    // 移动端滚动动画优化
    initMobileScrollAnimation();
}

// 移动端滚动动画优化
function initMobileScrollAnimation() {
    // 确保CSS动画时间轴在移动端正常工作
    const body = document.body;
    
    // 监听滚动事件，手动触发动画更新
    let scrollProgress = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        scrollProgress = scrollTop / docHeight;
        
        // 更新CSS自定义属性
        body.style.setProperty('--prg', scrollProgress);
        
        // 触发动画更新
        requestAnimationFrame(() => {
            // 确保动画时间轴更新
            if (CSS.supports('animation-timeline: scroll()')) {
                // 现代浏览器支持
                body.style.animationTimeline = 'scroll()';
            } else {
                // 降级处理：手动更新变换
                updateManualAnimation(scrollProgress);
            }
        });
    }, { passive: true });
}

// 手动更新动画（降级处理）
function updateManualAnimation(progress) {
    const figures = document.querySelectorAll('figure');
    const main = document.querySelector('main');
    
    if (main) {
        // 根据滚动进度更新main的变换
        const skewAngle = progress * 30; // 最大30度倾斜
        main.style.transform = `skewy(${skewAngle}deg)`;
    }
    
    figures.forEach((figure, index) => {
        // 为每个图片添加基于滚动进度的动画
        const delay = index * 0.1;
        const opacity = Math.max(0.3, 1 - Math.abs(progress - delay) * 2);
        const scale = 0.8 + opacity * 0.4;
        
        figure.style.opacity = opacity;
        figure.style.transform = `scale(${scale})`;
    });
}

// 移动端CSS样式注入
function injectMobileStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @media screen and (max-width: 768px) {
            /* 确保页面可以正常滚动 */
            html, body {
                overflow: auto !important;
                -webkit-overflow-scrolling: touch !important;
                position: relative !important;
            }
            
            /* 保留动画效果，但优化滚动性能 */
            main {
                transform-style: preserve-3d !important;
                perspective: 1000px !important;
                overflow: visible !important;
                will-change: transform !important;
                /* 不移除skew变换，保留动画效果 */
            }
            
            /* 优化图片网格布局，保留动画 */
            figure {
                transition: transform 0.2s ease !important;
                will-change: transform !important;
            }
            
            figure:hover {
                transform: scale(1.02) !important;
            }
            
            /* 确保header不会阻止滚动 */
            header {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                z-index: 1000 !important;
                background: rgba(0,0,0,0.9) !important;
            }
            
            /* 为内容添加适当的间距 */
            #page-wrapper {
                padding-top: 60px !important;
            }
            
            /* 优化触摸体验 */
            * {
                -webkit-touch-callout: none !important;
                -webkit-user-select: none !important;
                -khtml-user-select: none !important;
                -moz-user-select: none !important;
                -ms-user-select: none !important;
                user-select: none !important;
            }
            
            /* 允许文本选择 */
            p, h1, h2, h3, span, a {
                -webkit-user-select: text !important;
                -moz-user-select: text !important;
                -ms-user-select: text !important;
                user-select: text !important;
            }
            
            /* 优化滚动性能 */
            img {
                will-change: transform !important;
                backface-visibility: hidden !important;
                -webkit-backface-visibility: hidden !important;
            }
            
            /* 确保动画时间轴正常工作 */
            body {
                animation-timeline: scroll() !important;
            }
        }
    `;
    document.head.appendChild(style);
}

// 初始化移动端样式
document.addEventListener('DOMContentLoaded', injectMobileStyles); 