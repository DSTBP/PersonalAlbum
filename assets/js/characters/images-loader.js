class CharactersImagesLoader {
    constructor() {
        this.jsonPath = 'photos/json/characters.json';
        this.carouselTrack = document.querySelector('.carousel-track');
        this.memberInfo = document.querySelector('.member-info');
        this.dotsContainer = document.querySelector('.dots');
        this.init();
    }

    async init() {
        try {
            await this.loadCharacters();
            this.initAnimations();
        } catch (error) {
            console.error('Error loading characters images:', error);
        }
    }

    async loadCharacters() {
        try {
            const response = await fetch(this.jsonPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.generateCarousel(data.characters);
        } catch (error) {
            console.error('Error fetching characters data:', error);
        }
    }

    generateCarousel(characters) {
        if (!this.carouselTrack) {
            console.error('Carousel track container not found');
            return;
        }

        // Clear existing content
        this.carouselTrack.innerHTML = '';

        // Generate carousel cards
        characters.forEach((character, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.index = index;
            card.innerHTML = `
                <img src="${character.image}" alt="${character.name}">
            `;
            this.carouselTrack.appendChild(card);
        });

        // Update member info with first character
        if (characters.length > 0 && this.memberInfo) {
            const memberName = this.memberInfo.querySelector('.member-name');
            const memberRole = this.memberInfo.querySelector('.member-role');
            const memberBio = this.memberInfo.querySelector('.member-bio');
            
            if (memberName) memberName.textContent = characters[0].name;
            if (memberRole) memberRole.textContent = characters[0].role;
            if (memberBio) memberBio.textContent = characters[0].bio;
        }

        // Generate dots
        if (this.dotsContainer) {
            this.dotsContainer.innerHTML = '';
            characters.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                dot.dataset.index = index;
                this.dotsContainer.appendChild(dot);
            });
        }

        // Store characters data for animation function
        window.charactersData = characters;
    }

    initAnimations() {
        // Call the exposed initialization function if it exists
        if (typeof initCharactersAnimations === 'function') {
            initCharactersAnimations();
        }
    }
}

// Initialize the loader when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    new CharactersImagesLoader();
}); 