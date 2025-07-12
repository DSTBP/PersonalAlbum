// Timeline图片数据加载器
class TimelineImagesLoader {
    constructor() {
        this.timelineData = null;
    }

    // 加载JSON数据
    async loadTimelineData() {
        try {
            const response = await fetch('photos/json/timeline.json');
            this.timelineData = await response.json();
            return this.timelineData;
        } catch (error) {
            console.error('加载时间轴数据失败:', error);
            return null;
        }
    }

    // 生成时间轴HTML
    generateTimelineHTML() {
        if (!this.timelineData || !this.timelineData.timeline) return '';
        
        return this.timelineData.timeline.map(item => `
            <div class="tl-item ${item.position}" tabindex="0">
                <div class="tl-bg" style="background-image: url('${item.image}');"></div>
                <div class="tl-year">
                    <p class="f2 heading--sanSerif">${item.year}</p>
                </div>
                <div class="tl-content">
                    <h1>${item.title}</h1>
                    <p>${item.description}</p>
                </div>
            </div>
        `).join('');
    }

    // 更新轮播图样式
    updateCarouselStyles() {
        if (!this.timelineData || !this.timelineData.carousel) return;
        
        const carousel = this.timelineData.carousel;
        
        // 动态更新CSS样式
        carousel.forEach((item, index) => {
            const styleId = `carousel-style-${index + 1}`;
            let styleElement = document.getElementById(styleId);
            
            if (!styleElement) {
                styleElement = document.createElement('style');
                styleElement.id = styleId;
                document.head.appendChild(styleElement);
            }
            
            styleElement.textContent = `
                .ms--images .ms-slide:nth-child(${index + 1}) .ms-slide__image {
                    background-image: url("${item.image}");
                }
            `;
        });
    }

    // 初始化所有内容
    async initializeContent() {
        await this.loadTimelineData();
        
        // 更新时间轴
        const timelineSection = document.querySelector('#timeline');
        if (timelineSection) {
            timelineSection.innerHTML = this.generateTimelineHTML();
        }

        // 更新轮播图样式
        this.updateCarouselStyles();

        // 等待DOM更新完成后再初始化动画
        setTimeout(() => {
            this.reinitializeAnimations();
        }, 100);
    }

    // 重新初始化动画
    reinitializeAnimations() {
        // 重新初始化时间轴动画
        if (typeof initTimeline === 'function') {
            initTimeline();
        }
        
        // 重新初始化轮播图动画
        if (typeof initCarousel === 'function') {
            initCarousel();
        }
    }
}

// 创建全局实例
window.timelineImagesLoader = new TimelineImagesLoader();

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 延迟一点时间确保DOM完全加载
    setTimeout(() => {
        window.timelineImagesLoader.initializeContent();
    }, 100);
}); 