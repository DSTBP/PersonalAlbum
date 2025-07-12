class MomentsImagesLoader {
    constructor() {
        this.jsonPath = 'photos/json/moments.json';
        this.spinContainer = document.getElementById('spin-container');
        this.hexContainer = document.querySelector('.hex-container');
        this.init();
    }

    async init() {
        try {
            await this.loadMoments();
            this.initAnimations();
        } catch (error) {
            console.error('Error loading moments images:', error);
        }
    }

    async loadMoments() {
        try {
            const response = await fetch(this.jsonPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.generateSpinContainer(data.moments.spinContainer);
            this.generateHexContainer(data.moments.hexContainer);
        } catch (error) {
            console.error('Error fetching moments data:', error);
        }
    }

    generateSpinContainer(spinItems) {
        if (!this.spinContainer) {
            console.error('Spin container not found');
            return;
        }

        // Clear existing content except the center text
        const centerText = this.spinContainer.querySelector('p');
        this.spinContainer.innerHTML = '';
        if (centerText) {
            this.spinContainer.appendChild(centerText);
        }

        // Generate spin container items
        spinItems.forEach((item) => {
            if (item.type === 'image') {
                if (item.link) {
                    const link = document.createElement('a');
                    link.target = '_blank';
                    link.href = item.link;
                    
                    const img = document.createElement('img');
                    img.src = item.src;
                    img.alt = item.alt;
                    
                    link.appendChild(img);
                    this.spinContainer.appendChild(link);
                } else {
                    const img = document.createElement('img');
                    img.src = item.src;
                    img.alt = item.alt;
                    this.spinContainer.appendChild(img);
                }
            } else if (item.type === 'video') {
                const video = document.createElement('video');
                video.controls = true;
                video.autoplay = true;
                video.loop = true;
                video.className = 'max-w-full h-auto';
                
                const source = document.createElement('source');
                source.src = item.src;
                source.type = 'video/mp4';
                
                video.appendChild(source);
                this.spinContainer.appendChild(video);
            }
        });
    }

    generateHexContainer(hexItems) {
        if (!this.hexContainer) {
            console.error('Hex container not found');
            return;
        }

        // Clear existing content
        this.hexContainer.innerHTML = '';

        // Generate hex container items
        hexItems.forEach((item) => {
            const li = document.createElement('li');
            li.className = 'hex-item';
            
            const link = document.createElement('a');
            link.href = item.link;
            link.title = item.title;
            
            const img = document.createElement('img');
            img.className = 'hex-IMG';
            img.src = item.src;
            img.alt = item.alt;
            
            link.appendChild(img);
            li.appendChild(link);
            this.hexContainer.appendChild(li);
        });
    }

    initAnimations() {
        // Call the exposed initialization function if it exists
        if (typeof initMomentsAnimations === 'function') {
            initMomentsAnimations();
        }
    }
}

// Initialize the loader when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    new MomentsImagesLoader();
}); 