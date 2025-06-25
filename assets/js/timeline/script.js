// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function () {
    // 获取滑块容器元素
    var slidersContainer = document.querySelector('.sliders-container');

    // 标题数据
    var titles = [
        '一月：霜雪初绽的扉页',
        '二月：寒枝待春的伏笔',
        '三月：东风裁绿的信笺',
        '四月：花影漫过的回廊'
    ];

    // 获取分页元素
    var pagination = document.querySelector('.pagination');
    var paginationItems = [].slice.call(pagination.children);

    // 初始化数字滑块
    var msNumbers = new MomentumSlider({
        el: slidersContainer,
        cssClass: 'ms--numbers',
        range: [1, 4],
        rangeContent: function (i) {
            return '0' + i;
        },
        style: {
            transform: [{ scale: [0.4, 1] }],
            opacity: [0, 1]
        },
        interactive: false
    });

    // 初始化标题滑块
    var msTitles = new MomentumSlider({
        el: slidersContainer,
        cssClass: 'ms--titles',
        range: [0, 3],
        rangeContent: function (i) {
            return '<h3>' + titles[i] + '</h3>';
        },
        vertical: true,
        reverse: true,
        style: {
            opacity: [0, 1]
        },
        interactive: false
    });

    // 初始化链接滑块
    var msLinks = new MomentumSlider({
        el: slidersContainer,
        cssClass: 'ms--links',
        range: [0, 3],
        rangeContent: function () {
            return '<a class="ms-slide__link">进入时光机</a>';
        },
        vertical: true,
        interactive: false
    });

    // 初始化图片滑块（主滑块，同步其他滑块）
    var msImages = new MomentumSlider({
        el: slidersContainer,
        cssClass: 'ms--images',
        range: [0, 3],
        rangeContent: function () {
            return '<div class="ms-slide__image-container"><div class="ms-slide__image"></div></div>';
        },
        // 同步其他三个滑块
        sync: [msNumbers, msTitles, msLinks],
        style: {
            '.ms-slide__image': {
                transform: [{ scale: [1.5, 1] }]
            }
        },
        // 滑块切换时更新分页状态
        change: function (newIndex, oldIndex) {
            if (typeof oldIndex !== 'undefined') {
                paginationItems[oldIndex].classList.remove('pagination__item--active');
            }
            paginationItems[newIndex].classList.add('pagination__item--active');
        }
    });

    // 分页点击事件处理
    pagination.addEventListener('click', function (e) {
        if (e.target.matches('.pagination__button')) {
            var index = paginationItems.indexOf(e.target.parentNode);
            msImages.select(index);
        }
    });

    // 时间轴交互功能
    function initTimeline() {
        const timelineItems = document.querySelectorAll('.tl-item');
        
        // 滚动动画观察器
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // 观察所有时间轴项目
        timelineItems.forEach(item => {
            observer.observe(item);
        });
        
        // 点击事件处理
        timelineItems.forEach(item => {
            item.addEventListener('click', function() {
                // 添加点击动画效果
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
                
                // 可以在这里添加更多交互功能，比如打开模态框等
                console.log('时间轴项目被点击:', this.querySelector('.tl-content h1').textContent);
            });
        });
        
        // 键盘导航支持
        document.addEventListener('keydown', function(e) {
            const activeItem = document.querySelector('.tl-item:hover');
            if (!activeItem) return;
            
            const allItems = Array.from(timelineItems);
            const currentIndex = allItems.indexOf(activeItem);
            
            switch(e.key) {
                case 'ArrowDown':
                case 'ArrowRight':
                    e.preventDefault();
                    const nextIndex = (currentIndex + 1) % allItems.length;
                    allItems[nextIndex].focus();
                    break;
                case 'ArrowUp':
                case 'ArrowLeft':
                    e.preventDefault();
                    const prevIndex = currentIndex === 0 ? allItems.length - 1 : currentIndex - 1;
                    allItems[prevIndex].focus();
                    break;
            }
        });
    }
    
    // 初始化时间轴功能
    initTimeline();
});