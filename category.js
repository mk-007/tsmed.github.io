// Category page functionality
class CategoryPage {
    constructor(category) {
        this.category = category;
        this.products = this.getCategoryProducts(category);
        this.filteredProducts = [...this.products];
        this.currentSort = 'name';
        this.sortDirection = 'asc';
        this.carouselState = {
            currentSlide: 0,
            slidesToShow: 3,
            track: null,
            prevBtn: null,
            nextBtn: null,
            dotsContainer: null
        };
        this.init();
    }

    getCategoryProducts(category) {
        const categoryMap = {
            'chambers': 'chambers',
            'sterilizers': 'sterilizers', 
            'equipment': 'equipment'
        };
        
        const actualCategory = categoryMap[category] || 'chambers';
        return productsByCategory[actualCategory] || [];
    }

    init() {
        this.initCarousel();
        this.initComparisonTable();
        this.setupEventListeners();
        this.updateTable();
    }

    initCarousel() {
        if (this.products.length === 0) {
            document.getElementById('carouselTrack').innerHTML = 
                '<div class="no-products">Товары не найдены</div>';
            return;
        }

        this.renderCarousel();
        this.setupCarousel();
    }

    renderCarousel() {
        const track = document.getElementById('carouselTrack');
        if (!track) {
            console.error('Carousel track element not found');
            return;
        }

        track.innerHTML = this.products.map(product => `
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

    setupCarousel() {
        this.carouselState.track = document.getElementById('carouselTrack');
        this.carouselState.prevBtn = document.querySelector('.products-carousel .carousel-btn.prev');
        this.carouselState.nextBtn = document.querySelector('.products-carousel .carousel-btn.next');
        this.carouselState.dotsContainer = document.getElementById('carouselDots');

        if (!this.carouselState.track || !this.carouselState.prevBtn || !this.carouselState.nextBtn) {
            console.error('Carousel elements not found');
            return;
        }

        this.updateSlidesToShow();
        this.renderDots();
        this.setupCarouselEvents();
        this.updateCarousel();
    }

    updateSlidesToShow() {
        if (window.innerWidth <= 768) {
            this.carouselState.slidesToShow = 1;
        } else if (window.innerWidth <= 1024) {
            this.carouselState.slidesToShow = 2;
        } else {
            this.carouselState.slidesToShow = 3;
        }
    }

    renderDots() {
        if (!this.carouselState.dotsContainer) return;

        const totalDots = Math.ceil(this.products.length / this.carouselState.slidesToShow);
        this.carouselState.dotsContainer.innerHTML = '';
        
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('button');
            dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
            dot.setAttribute('aria-label', `Перейти к слайду ${i + 1}`);
            dot.addEventListener('click', () => this.goToSlide(i));
            this.carouselState.dotsContainer.appendChild(dot);
        }
    }

    setupCarouselEvents() {
        // Кнопки вперед/назад
        this.carouselState.nextBtn.addEventListener('click', () => this.nextSlide());
        this.carouselState.prevBtn.addEventListener('click', () => this.prevSlide());

        // Touch events для мобильных
        this.setupTouchEvents();

        // Ресайз
        window.addEventListener('resize', () => {
            this.updateSlidesToShow();
            this.renderDots();
            this.updateCarousel();
        });
    }

    setupTouchEvents() {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        this.carouselState.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            this.carouselState.track.style.transition = 'none';
        });

        this.carouselState.track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
            const diff = currentX - startX;
            const cardWidth = this.carouselState.track.querySelector('.product-card')?.offsetWidth + 24 || 300;
            const translateX = -this.carouselState.currentSlide * cardWidth * this.carouselState.slidesToShow + diff;
            this.carouselState.track.style.transform = `translateX(${translateX}px)`;
        });

        this.carouselState.track.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;
            this.carouselState.track.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            
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

    nextSlide() {
        const maxSlide = Math.ceil(this.products.length / this.carouselState.slidesToShow) - 1;
        if (this.carouselState.currentSlide < maxSlide) {
            this.carouselState.currentSlide++;
            this.updateCarousel();
        }
    }

    prevSlide() {
        if (this.carouselState.currentSlide > 0) {
            this.carouselState.currentSlide--;
            this.updateCarousel();
        }
    }

    goToSlide(slideIndex) {
        this.carouselState.currentSlide = slideIndex;
        this.updateCarousel();
    }

    updateCarousel() {
        if (!this.carouselState.track) return;

        const card = this.carouselState.track.querySelector('.product-card');
        if (!card) return;

        const cardWidth = card.offsetWidth + 24;
        const translateX = -this.carouselState.currentSlide * cardWidth * this.carouselState.slidesToShow;
        this.carouselState.track.style.transform = `translateX(${translateX}px)`;
        
        // Обновляем точки
        if (this.carouselState.dotsContainer) {
            const dots = this.carouselState.dotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === this.carouselState.currentSlide);
            });
        }
        
        // Обновляем состояние кнопок
        const maxSlide = Math.ceil(this.products.length / this.carouselState.slidesToShow) - 1;
        this.carouselState.prevBtn.disabled = this.carouselState.currentSlide === 0;
        this.carouselState.nextBtn.disabled = this.carouselState.currentSlide >= maxSlide;
    }

    // ... остальные методы (для таблицы сравнения) остаются без изменений ...
    initComparisonTable() {
        this.updateTable();
    }

    setupEventListeners() {
        // Sort select
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.sortDirection = 'asc';
                this.updateTable();
            });
        }

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                const filter = e.target.dataset.filter;
                this.applyFilter(filter);
            });
        });

        // Table header sorting
        document.querySelectorAll('.comparison-table th[data-sort]').forEach(th => {
            th.addEventListener('click', () => {
                const sortField = th.dataset.sort;
                if (this.currentSort === sortField) {
                    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
                } else {
                    this.currentSort = sortField;
                    this.sortDirection = 'asc';
                }
                this.updateTable();
            });
        });

        // Print table
        const printBtn = document.getElementById('printTable');
        if (printBtn) {
            printBtn.addEventListener('click', () => {
                this.printTable();
            });
        }

        // Contact button
        const contactBtn = document.getElementById('contactForDetails');
        if (contactBtn) {
            contactBtn.addEventListener('click', () => {
                window.location.href = 'index.html#contacts';
            });
        }
    }

    applyFilter(filter) {
        switch(filter) {
            case 'compact':
                this.filteredProducts = this.products.filter(p => {
                    const volume = p.specifications?.volume || p.volume || 0;
                    return volume < 1.0;
                });
                break;
            case 'professional':
                this.filteredProducts = this.products.filter(p => {
                    const volume = p.specifications?.volume || p.volume || 0;
                    return volume >= 1.0;
                });
                break;
            default:
                this.filteredProducts = [...this.products];
        }
        this.updateTable();
    }

    sortProducts() {
        this.filteredProducts.sort((a, b) => {
            let aValue, bValue;

            switch(this.currentSort) {
                case 'name':
                    aValue = a.name;
                    bValue = b.name;
                    break;
                case 'volume':
                    aValue = a.specifications?.volume || a.volume || 0;
                    bValue = b.specifications?.volume || b.volume || 0;
                    break;
                case 'power':
                    aValue = a.specifications?.power || a.power || 0;
                    bValue = b.specifications?.power || b.power || 0;
                    break;
                case 'temperature':
                    aValue = a.specifications?.temperature || a.temperature || 0;
                    bValue = b.specifications?.temperature || b.temperature || 0;
                    break;
                case 'price':
                    aValue = a.specifications?.price || a.price || 0;
                    bValue = b.specifications?.price || b.price || 0;
                    break;
                default:
                    aValue = a.name;
                    bValue = b.name;
            }

            if (this.sortDirection === 'desc') {
                [aValue, bValue] = [bValue, aValue];
            }

            if (typeof aValue === 'string') {
                return aValue.localeCompare(bValue);
            } else {
                return aValue - bValue;
            }
        });
    }

    updateTable() {
        if (this.filteredProducts.length === 0) {
            document.getElementById('comparisonTableBody').innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 40px;">
                        <i class="fas fa-search" style="font-size: 3rem; color: var(--text-light); margin-bottom: 15px; display: block;"></i>
                        <p>Товары не найдены</p>
                    </td>
                </tr>
            `;
            return;
        }

        this.sortProducts();
        const tbody = document.getElementById('comparisonTableBody');
        
        tbody.innerHTML = this.filteredProducts.map(product => `
            <tr>
                <td>
                    <div class="product-cell">
                        <div class="product-image-small">
                            <img src="${product.image}" alt="${product.name}" 
                                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                            <div class="image-fallback" style="display: none;">
                                <i class="fas fa-cube"></i>
                            </div>
                        </div>
                        <div class="product-info-small">
                            <strong>${product.name}</strong>
                            <span class="product-category">${this.getCategoryName()}</span>
                        </div>
                    </div>
                </td>
                <td>${product.specifications?.volume || product.volume || '-'}</td>
                <td>${product.specifications?.power || product.power || '-'}</td>
                <td>${product.specifications?.temperature || product.temperature || '-'}</td>
                <td>${product.specifications?.dimensions || product.dimensions || '-'}</td>
                <td>${product.specifications?.weight || product.weight || '-'}</td>
                <td>
                    <div class="action-buttons">
                        <a href="${product.link}" class="action-btn detail-btn" title="Подробнее">
                            <i class="fas fa-eye"></i>
                        </a>
                        <button class="action-btn contact-btn" title="Запросить цену" onclick="contactAboutProduct(${product.id})">
                            <i class="fas fa-envelope"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        this.updateSortIndicators();
    }

    updateSortIndicators() {
        document.querySelectorAll('.comparison-table th .sort-indicator').forEach(indicator => {
            indicator.innerHTML = '';
        });

        const currentTh = document.querySelector(`.comparison-table th[data-sort="${this.currentSort}"] .sort-indicator`);
        if (currentTh) {
            currentTh.innerHTML = this.sortDirection === 'asc' ? ' ↑' : ' ↓';
        }
    }

    getCategoryName() {
        const categoryNames = {
            'chambers': 'Дезинфекционная камера',
            'sterilizers': 'Стерилизатор',
            'equipment': 'Оборудование'
        };
        return categoryNames[this.category] || 'Товар';
    }

    printTable() {
        // ... код printTable остается без изменений ...
    }
}

// Mobile menu functionality
class MobileMenu {
    constructor() {
        this.menuBtn = document.getElementById('mobileMenuBtn');
        this.navMenu = document.getElementById('navMenu');
        this.init();
    }

    init() {
        if (this.menuBtn && this.navMenu) {
            this.setupEventListeners();
        }
    }

    setupEventListeners() {
        this.menuBtn.addEventListener('click', () => {
            this.toggleMenu();
        });

        document.querySelectorAll('#navMenu a').forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('nav') && !e.target.closest('.mobile-menu-btn')) {
                this.closeMenu();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        this.navMenu.classList.toggle('active');
        const icon = this.menuBtn.querySelector('i');
        
        if (this.navMenu.classList.contains('active')) {
            icon.className = 'fas fa-times';
            document.body.style.overflow = 'hidden';
        } else {
            icon.className = 'fas fa-bars';
            document.body.style.overflow = '';
        }
    }

    closeMenu() {
        this.navMenu.classList.remove('active');
        const icon = this.menuBtn.querySelector('i');
        icon.className = 'fas fa-bars';
        document.body.style.overflow = '';
    }
}

// Global functions
function contactAboutProduct(productId) {
    try {
        const allProducts = [];
        for (const category in productsByCategory) {
            allProducts.push(...productsByCategory[category]);
        }
        
        const product = allProducts.find(p => p.id === productId);
        if (product) {
            const subject = `Запрос по товару: ${product.name}`;
            const body = `Здравствуйте!\n\nМеня интересует товар: ${product.name}\n\nПрошу предоставить коммерческое предложение.\n\nС уважением,\n[Ваше имя]`;
            
            window.location.href = `mailto:sales@tsmed.ru?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        }
    } catch (error) {
        alert('Пожалуйста, свяжитесь с нами:\nТелефон: +7 (831) 462-05-47\nEmail: sales@tsmed.ru');
    }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu
    new MobileMenu();
    
    // Initialize category page
    const path = window.location.pathname;
    let category = 'chambers';
    
    if (path.includes('sterilizers')) {
        category = 'sterilizers';
    } else if (path.includes('equipment')) {
        category = 'equipment';
    }
    
    if (typeof productsByCategory !== 'undefined') {
        new CategoryPage(category);
    } else {
        console.error('productsByCategory is not defined');
    }
});