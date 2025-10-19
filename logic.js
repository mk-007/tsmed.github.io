class ProductCarousel {
    constructor(containerId, products) {
        this.container = document.getElementById(containerId);
        this.track = this.container.querySelector('.carousel-track');
        this.dotsContainer = this.container.querySelector('.carousel-dots');
        this.prevBtn = this.container.querySelector('.carousel-btn.prev');
        this.nextBtn = this.container.querySelector('.carousel-btn.next');
        
        this.products = products;
        this.currentSlide = 0;
        this.slidesToShow = 3;
        this.totalSlides = products.length;
        
        this.init();
    }
    
    init() {
        this.updateSlidesToShow();
        this.renderProducts();
        this.renderDots();
        this.setupEventListeners();
        this.updateCarousel();
        
        window.addEventListener('resize', () => {
            this.updateSlidesToShow();
            this.renderDots();
            this.updateCarousel();
        });
    }
    
    updateSlidesToShow() {
        if (window.innerWidth <= 768) {
            this.slidesToShow = 1;
        } else if (window.innerWidth <= 1024) {
            this.slidesToShow = 2;
        } else {
            this.slidesToShow = 3;
        }
    }
    
    renderProducts() {
        this.track.innerHTML = this.products.map(product => `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" 
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <div class="image-fallback" style="display: none; flex-direction: column; align-items: center; gap: 10px;">
                        <i class="fas fa-cube" style="font-size: 3rem; color: #2563eb; opacity: 0.7;"></i>
                        <span style="color: var(--text-light); font-size: 0.9rem; text-align: center;">${product.name}</span>
                    </div>
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <a href="${product.link}" class="product-link">
                        <span>Подробнее</span>
                        <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        `).join('');
    }
    
    renderDots() {
        const totalDots = Math.ceil(this.totalSlides / this.slidesToShow);
        this.dotsContainer.innerHTML = '';
        
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('button');
            dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
            dot.setAttribute('aria-label', `Перейти к слайду ${i + 1}`);
            dot.addEventListener('click', () => this.goToSlide(i));
            this.dotsContainer.appendChild(dot);
        }
    }
    
    updateCarousel() {
        const cardWidth = this.track.querySelector('.product-card')?.offsetWidth + 24 || 300;
        const translateX = -this.currentSlide * cardWidth * this.slidesToShow;
        this.track.style.transform = `translateX(${translateX}px)`;
        
        // Update dots
        const dots = this.dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
        
        // Update button states
        const maxSlide = Math.ceil(this.totalSlides / this.slidesToShow) - 1;
        this.prevBtn.disabled = this.currentSlide === 0;
        this.nextBtn.disabled = this.currentSlide >= maxSlide;
    }
    
    nextSlide() {
        const maxSlide = Math.ceil(this.totalSlides / this.slidesToShow) - 1;
        if (this.currentSlide < maxSlide) {
            this.currentSlide++;
            this.updateCarousel();
        }
    }
    
    prevSlide() {
        if (this.currentSlide > 0) {
            this.currentSlide--;
            this.updateCarousel();
        }
    }
    
    goToSlide(slideIndex) {
        this.currentSlide = slideIndex;
        this.updateCarousel();
    }
    
    setupEventListeners() {
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        
        // Touch support for mobile
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        
        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            this.track.style.transition = 'none';
        });
        
        this.track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
            const diff = currentX - startX;
            const cardWidth = this.track.querySelector('.product-card')?.offsetWidth + 24 || 300;
            const translateX = -this.currentSlide * cardWidth * this.slidesToShow + diff;
            this.track.style.transform = `translateX(${translateX}px)`;
        });
        
        this.track.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;
            this.track.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            
            const diff = currentX - startX;
            const swipeThreshold = 50;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    this.prevSlide();
                } else {
                    this.nextSlide();
                }
            } else {
                this.updateCarousel();
            }
        });
    }
}

