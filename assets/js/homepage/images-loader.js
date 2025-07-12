// 图片数据加载器
class ImagesLoader {
    constructor() {
        this.imagesData = null;
    }

    // 加载JSON数据
    async loadImagesData() {
        try {
            const response = await fetch('photos/json/home.json');
            this.imagesData = await response.json();
            return this.imagesData;
        } catch (error) {
            console.error('加载图片数据失败:', error);
            return null;
        }
    }

    // 生成轮播图HTML
    generateCarouselHTML() {
        if (!this.imagesData || !this.imagesData.carousel) return '';
        
        return this.imagesData.carousel.map(item => `
            <li class='item' data-id="${item.id}" style="background-image: url('${item.src}')">
                <div class='content'>
                    <h2 class='title'>"${item.title}"</h2>
                    <p class='description'>${item.description}</p>
                    <!-- <button>Read More</button> -->
                </div>
            </li>
        `).join('');
    }

    // 生成时间线HTML
    generateTimelineHTML() {
        if (!this.imagesData || !this.imagesData.timeline) return '';
        
        return this.imagesData.timeline.map(item => `
            <div class="tile">
                <div class="tile__media">
                    <img class="tile__img" src="${item.src}" alt="" />
                </div>
                <div class="tile__details">
                    <div class="tile__title">
                        ${item.title}
                    </div>
                </div>
            </div>
        `).join('');
    }

    // 生成意象集录HTML
    generateImageryHTML() {
        if (!this.imagesData || !this.imagesData.imagery) return '';
        
        const imagery = this.imagesData.imagery;
        return `
            <div class="hideLeft"><img src="${imagery[0].src}" alt="${imagery[0].alt}" /></div>
            <div class="prevLeftSecond"><img src="${imagery[1].src}" alt="${imagery[1].alt}" /></div>
            <div class="prev"><img src="${imagery[2].src}" alt="${imagery[2].alt}" /></div>
            <div class="selected"><img src="${imagery[3].src}" alt="${imagery[3].alt}" /></div>
            <div class="next"><img src="${imagery[4].src}" alt="${imagery[4].alt}" /></div>
            <div class="nextRightSecond"><img src="${imagery[5].src}" alt="${imagery[5].alt}" /></div>
            <div class="hideRight"><img src="${imagery[6].src}" alt="${imagery[6].alt}" /></div>
        `;
    }

    // 生成知交影谱HTML
    generateCharactersHTML() {
        if (!this.imagesData || !this.imagesData.characters) return '';
        
        return this.imagesData.characters.map(item => `
            <div class="tile">
                <div class="tile__media">
                    <img class="tile__img" src="${item.src}" alt="${item.alt}" />
                </div>
                <div class="tile__details">
                    <div class="tile__title">
                        ${item.title}
                    </div>
                </div>
            </div>
        `).join('');
    }

    // 生成瞬间纪闻HTML
    generateMomentsHTML() {
        if (!this.imagesData || !this.imagesData.moments) return '';
        
        return this.imagesData.moments.map(item => `
            <div class="carousel-cell"><img src="${item.src}" alt="${item.alt}"></div>
        `).join('');
    }

    // 初始化所有内容
    async initializeContent() {
        await this.loadImagesData();
        
        // 更新轮播图
        const carouselSlider = document.querySelector('#carousel-section .slider');
        if (carouselSlider) {
            carouselSlider.innerHTML = this.generateCarouselHTML();
        }

        // 更新时间线
        const timelineRow = document.querySelector('#timeline .row__inner');
        if (timelineRow) {
            timelineRow.innerHTML = this.generateTimelineHTML();
        }

        // 更新意象集录
        const imageryCarousel = document.querySelector('#imagery #carousel');
        if (imageryCarousel) {
            imageryCarousel.innerHTML = this.generateImageryHTML();
        }

        // 更新知交影谱
        const charactersRow = document.querySelector('#characters .row__inner');
        if (charactersRow) {
            charactersRow.innerHTML = this.generateCharactersHTML();
        }

        // 更新瞬间纪闻
        const momentsCarousel = document.querySelector('#moments .carousel-3d');
        if (momentsCarousel) {
            momentsCarousel.innerHTML = this.generateMomentsHTML();
        }

        // 等待DOM更新完成后再初始化脚本
        setTimeout(() => {
            this.reinitializeScripts();
        }, 100);
    }

    // 重新初始化相关脚本
    reinitializeScripts() {
        // 重新初始化轮播图
        this.reinitializeCarousel();
        
        // 重新初始化时间线
        this.reinitializeTimeline();
        
        // 重新初始化意象集录
        this.reinitializeImagery();
        
        // 重新初始化知交影谱
        this.reinitializeCharacters();
        
        // 重新初始化瞬间纪闻
        this.reinitializeMoments();
    }

    // 重新初始化轮播图
    reinitializeCarousel() {
        const slider = document.querySelector('.slider');
        const nextBtn = document.querySelector('.next');
        const prevBtn = document.querySelector('.prev');
        const dotsContainer = document.querySelector('.dots');
        
        if (!slider || !nextBtn || !prevBtn || !dotsContainer) return;
        
        // 重新获取元素
        let items = document.querySelectorAll('.item');
        
        // 清除之前的事件监听器
        nextBtn.replaceWith(nextBtn.cloneNode(true));
        prevBtn.replaceWith(prevBtn.cloneNode(true));
        
        // 重新获取按钮元素
        const newNextBtn = document.querySelector('.next');
        const newPrevBtn = document.querySelector('.prev');
        
        // 创建圆点
        dotsContainer.innerHTML = '';
        items.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            dot.dataset.index = i;
            dot.addEventListener('click', () => {
                this.handleDotClick(i);
            });
            dotsContainer.appendChild(dot);
        });
        
        // 更新圆点状态
        this.updateDots();
        
        // 添加按钮事件
        newNextBtn.addEventListener('click', () => {
            this.moveSlider('next');
            this.resetInterval();
        });
        
        newPrevBtn.addEventListener('click', () => {
            this.moveSlider('prev');
            this.resetInterval();
        });
        
        // 开始自动播放
        this.startInterval();
    }

    // 轮播图相关方法
    updateDots() {
        const slider = document.querySelector('.slider');
        const activeItem = slider.children[1];
        if (!activeItem) return;
        
        const activeId = parseInt(activeItem.dataset.id, 10) - 1;
        const dots = document.querySelectorAll('.dots .dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === activeId);
        });
    }

    moveSlider(direction) {
        const slider = document.querySelector('.slider');
        if (direction === 'next') {
            slider.append(slider.firstElementChild);
        } else if (direction === 'prev') {
            slider.prepend(slider.lastElementChild);
        }
        this.updateDots();
    }

    handleDotClick(index) {
        const slider = document.querySelector('.slider');
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
        
        this.updateDots();
        this.resetInterval();
    }

    startInterval() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        this.intervalId = setInterval(() => {
            this.moveSlider('next');
        }, 8000);
    }

    resetInterval() {
        this.startInterval();
    }

    // 重新初始化时间线
    reinitializeTimeline() {
        const timeline = document.querySelector('#timeline');
        if (!timeline) return;

        const rowInner = timeline.querySelector('.row__inner');
        const tiles = Array.from(timeline.querySelectorAll('.tile'));

        if (!rowInner || !tiles.length) {
            console.error('Timeline carousel elements not found');
            return;
        }

        // 清除之前的克隆元素
        const existingClones = rowInner.querySelectorAll('.tile');
        existingClones.forEach(tile => tile.remove());

        // 重新添加原始元素
        tiles.forEach(tile => rowInner.appendChild(tile));

        // 固定可见图片数量为7
        const visibleCount = 7;
        const totalSlides = tiles.length;
        
        // 首尾各克隆visibleCount张slide
        const clonesBefore = [];
        const clonesAfter = [];
        for (let i = 0; i < visibleCount; i++) {
            clonesBefore.push(tiles[totalSlides - visibleCount + i]?.cloneNode(true) || tiles[i % totalSlides].cloneNode(true));
            clonesAfter.push(tiles[i % totalSlides].cloneNode(true));
        }
        clonesBefore.forEach(clone => rowInner.prepend(clone));
        clonesAfter.forEach(clone => rowInner.appendChild(clone));

        // 重新获取所有slide
        const allTiles = Array.from(rowInner.querySelectorAll('.tile'));
        const slideWidth = tiles[0].offsetWidth + parseInt(getComputedStyle(tiles[0]).marginRight, 10);
        let currentIndex = visibleCount;
        let isTransitioning = false;

        // 设置初始位置
        rowInner.style.transform = `translateX(${-slideWidth * currentIndex}px)`;

        // 滑动逻辑
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

        // 自动滚动
        setInterval(() => {
            if (document.hidden) return;
            goToSlide(currentIndex + 1);
        }, 5000);
    }

    // 重新初始化意象集录
    reinitializeImagery() {
        // 直接调用原有的初始化函数
        if (typeof initializeImagery === 'function') {
            initializeImagery();
        }
    }

    // 重新初始化知交影谱
    reinitializeCharacters() {
        // 直接调用原有的初始化函数
        if (typeof initializeCharacters === 'function') {
            initializeCharacters();
        }
    }

    // 重新初始化瞬间纪闻
    reinitializeMoments() {
        // 直接调用原有的初始化函数
        if (typeof initializeMoments === 'function') {
            initializeMoments();
        }
    }
}

// 创建全局实例
window.imagesLoader = new ImagesLoader();

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 延迟一点时间确保DOM完全加载
    setTimeout(() => {
        window.imagesLoader.initializeContent();
    }, 100);
});

// 如果没有图片加载器，直接初始化原有功能
if (!window.imagesLoader) {
    document.addEventListener('DOMContentLoaded', function() {
        if (typeof initializeTimeline === 'function') {
            initializeTimeline();
        }
        if (typeof initializeImagery === 'function') {
            initializeImagery();
        }
        if (typeof initializeCharacters === 'function') {
            initializeCharacters();
        }
        if (typeof initializeMoments === 'function') {
            initializeMoments();
        }
    });
} 