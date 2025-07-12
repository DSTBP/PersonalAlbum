class ImageryImagesLoader {
    constructor() {
        this.jsonPath = 'photos/json/imagery.json';
        this.imageBasePath = 'photos/imagery/';
        this.mainContainer = document.querySelector('main.grid');
        this.init();
    }

    async init() {
        try {
            await this.loadImages();
            this.initAnimations();
        } catch (error) {
            console.error('Error loading imagery images:', error);
        }
    }

    async loadImages() {
        try {
            const response = await fetch(this.jsonPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.generateGrid(data.images);
        } catch (error) {
            console.error('Error fetching imagery data:', error);
        }
    }

    generateGrid(images) {
        if (!this.mainContainer) {
            console.error('Main grid container not found');
            return;
        }

        // Clear existing content
        this.mainContainer.innerHTML = '';

        // Generate grid items
        images.forEach((item, index) => {
            const figure = document.createElement('figure');
            figure.innerHTML = `
                <img src="${this.imageBasePath}${item.code}" alt="${item.text}">
                <figcaption>by <a href="https://${item.link}" target="_blank">${item.name}</a></figcaption>
            `;
            this.mainContainer.appendChild(figure);
        });
    }

    initAnimations() {
        // Reinitialize any imagery-specific animations after content is loaded
        // This ensures animations work with dynamically loaded content
        
        // Call the exposed initialization function if it exists
        if (typeof initImageryAnimations === 'function') {
            initImageryAnimations();
        }
    }
}

// Initialize the loader when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    new ImageryImagesLoader();
}); 