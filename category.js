// Category page functionality
class CategoryPage {
    constructor(category) {
        this.category = category;
        this.config = tableConfig[category] || tableConfig.chambers;
        this.products = this.getCategoryProducts(category);
        this.filteredProducts = [...this.products];
        this.currentSort = this.config.sortOptions[0]?.value || 'name';
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
        this.carouselState.nextBtn.addEventListener('click', () => this.nextSlide());
        this.carouselState.prevBtn.addEventListener('click', () => this.prevSlide());

        this.setupTouchEvents();

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
        
        if (this.carouselState.dotsContainer) {
            const dots = this.carouselState.dotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === this.carouselState.currentSlide);
            });
        }
        
        const maxSlide = Math.ceil(this.products.length / this.carouselState.slidesToShow) - 1;
        this.carouselState.prevBtn.disabled = this.carouselState.currentSlide === 0;
        this.carouselState.nextBtn.disabled = this.carouselState.currentSlide >= maxSlide;
    }

    initComparisonTable() {
        this.renderTableHeaders();
        this.updateTable();
    }

    renderTableHeaders() {
        const thead = document.querySelector('.comparison-table thead tr');
        const sortSelect = document.getElementById('sortSelect');
        
        if (!thead) {
            console.error('Table header not found');
            return;
        }

        thead.innerHTML = '';
        
        this.config.columns
            .filter(column => column.showInTable)
            .forEach(column => {
                const th = document.createElement('th');
                
                if (column.sortable) {
                    th.setAttribute('data-sort', column.key);
                    th.innerHTML = `
                        ${column.label}
                        <span class="sort-indicator"></span>
                    `;
                    th.style.cursor = 'pointer';
                } else {
                    th.textContent = column.label;
                }
                
                thead.appendChild(th);
            });

        if (sortSelect) {
            sortSelect.innerHTML = this.config.sortOptions
                .map(option => `<option value="${option.value}">${option.label}</option>`)
                .join('');
        }

        this.renderFilters();
    }

    renderFilters() {
        const filtersContainer = document.querySelector('.filter-buttons');
        if (!filtersContainer || !this.config.filters) return;

        filtersContainer.innerHTML = this.config.filters
            .map(filter => `
                <button class="filter-btn ${filter.key === 'all' ? 'active' : ''}" 
                        data-filter="${filter.key}">
                    ${filter.label}
                </button>
            `).join('');
    }

    setupEventListeners() {
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.sortDirection = 'asc';
                this.updateTable();
            });
        }

        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                const filter = e.target.dataset.filter;
                this.applyFilter(filter);
            }
        });

        document.addEventListener('click', (e) => {
            if (e.target.closest('th[data-sort]')) {
                const th = e.target.closest('th[data-sort]');
                const sortField = th.dataset.sort;
                
                if (this.currentSort === sortField) {
                    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
                } else {
                    this.currentSort = sortField;
                    this.sortDirection = 'asc';
                }
                this.updateTable();
            }
        });

        const printBtn = document.getElementById('printTable');
        if (printBtn) {
            printBtn.addEventListener('click', () => {
                this.printTable();
            });
        }

        const contactBtn = document.getElementById('contactForDetails');
        if (contactBtn) {
            contactBtn.addEventListener('click', () => {
                window.location.href = 'index.html#contacts';
            });
        }
    }

    applyFilter(filterKey) {
        const filter = this.config.filters?.find(f => f.key === filterKey);
        
        if (filter && filter.condition) {
            this.filteredProducts = this.products.filter(filter.condition);
        } else {
            this.filteredProducts = [...this.products];
        }
        
        this.updateTable();
    }

    sortProducts() {
        this.filteredProducts.sort((a, b) => {
            let aValue = this.getProductValue(a, this.currentSort);
            let bValue = this.getProductValue(b, this.currentSort);

            if (this.sortDirection === 'desc') {
                [aValue, bValue] = [bValue, aValue];
            }

            if (typeof aValue === 'string') {
                return aValue.localeCompare(bValue);
            } else {
                const numA = this.parseNumericValue(aValue);
                const numB = this.parseNumericValue(bValue);
                return (numA || 0) - (numB || 0);
            }
        });
    }

    parseNumericValue(value) {
        if (typeof value === 'number') return value;
        if (typeof value !== 'string') return 0;
        
        const numericString = value.replace(/[^\d,.-]/g, '').replace(',', '.');
        return parseFloat(numericString) || 0;
    }

    getProductValue(product, key) {
        return product.specifications?.[key] || product[key] || '-';
    }

    updateTable() {
        const tbody = document.getElementById('comparisonTableBody');
        if (!tbody) {
            console.error('Table body not found');
            return;
        }

        if (this.filteredProducts.length === 0) {
            const columnsCount = this.config.columns.filter(col => col.showInTable).length;
            tbody.innerHTML = `
                <tr>
                    <td colspan="${columnsCount}" style="text-align: center; padding: 40px;">
                        <i class="fas fa-search" style="font-size: 3rem; color: var(--text-light); margin-bottom: 15px; display: block;"></i>
                        <p>Товары не найдены</p>
                    </td>
                </tr>
            `;
            return;
        }

        this.sortProducts();
        
        const visibleColumns = this.config.columns.filter(col => col.showInTable);
        
        tbody.innerHTML = this.filteredProducts.map(product => `
            <tr>
                ${visibleColumns.map(column => `
                    <td>
                        ${this.renderTableCell(product, column)}
                    </td>
                `).join('')}
            </tr>
        `).join('');

        this.updateSortIndicators();
    }

    renderTableCell(product, column) {
        const value = this.getProductValue(product, column.key);
        
        if (column.key === 'name' && column.isLink) {
            return `
                <div class="product-cell">
                    <a href="${product.link}" class="product-link-cell">
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
                    </a>
                </div>
            `;
        }
        
        return value;
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
        try {
            const printWindow = window.open('', '_blank');
            if (!printWindow) {
                alert('Пожалуйста, разрешите всплывающие окна для печати таблицы');
                return;
            }
            
            const visibleColumns = this.config.columns.filter(col => col.showInTable);
            
            const simplifiedTable = document.createElement('table');
            simplifiedTable.className = 'comparison-table';
            simplifiedTable.style.width = '100%';
            simplifiedTable.style.borderCollapse = 'collapse';
            
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            
            visibleColumns.forEach(column => {
                const newTh = document.createElement('th');
                newTh.textContent = column.label;
                newTh.style.border = '1px solid #000';
                newTh.style.padding = '8px';
                newTh.style.backgroundColor = '#f5f5f5';
                newTh.style.fontWeight = 'bold';
                headerRow.appendChild(newTh);
            });
            
            thead.appendChild(headerRow);
            simplifiedTable.appendChild(thead);
            
            const tbody = document.createElement('tbody');
            
            this.filteredProducts.forEach(product => {
                const newRow = document.createElement('tr');
                
                visibleColumns.forEach(column => {
                    const newCell = document.createElement('td');
                    newCell.style.border = '1px solid #000';
                    newCell.style.padding = '8px';
                    newCell.style.verticalAlign = 'top';
                    
                    if (column.key === 'name') {
                        newCell.innerHTML = `<strong>${product.name}</strong><br><small>${this.getCategoryName()}</small>`;
                    } else {
                        const value = this.getProductValue(product, column.key);
                        newCell.textContent = value || '-';
                    }
                    
                    newRow.appendChild(newCell);
                });
                
                tbody.appendChild(newRow);
            });
            
            simplifiedTable.appendChild(tbody);
            
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Сравнительная таблица - Торгсин</title>
                    <meta charset="UTF-8">
                    <style>
                        body { 
                            font-family: Arial, sans-serif; 
                            margin: 20px; 
                            font-size: 12px;
                            color: #000;
                        }
                        table { 
                            width: 100%; 
                            border-collapse: collapse; 
                            margin: 15px 0;
                            font-size: 11px;
                        }
                        th, td { 
                            border: 1px solid #333; 
                            padding: 8px 6px; 
                            text-align: left; 
                            vertical-align: top;
                        }
                        th { 
                            background-color: #f5f5f5; 
                            font-weight: bold;
                        }
                        .header { 
                            text-align: center; 
                            margin-bottom: 20px;
                            border-bottom: 2px solid #333;
                            padding-bottom: 15px;
                        }
                        .header h1 {
                            margin: 0 0 10px 0;
                            font-size: 18px;
                            color: #333;
                        }
                        .header p {
                            margin: 5px 0;
                            font-size: 12px;
                            color: #666;
                        }
                        .footer { 
                            margin-top: 30px; 
                            font-size: 10px; 
                            color: #666;
                            text-align: center;
                            border-top: 1px solid #ccc;
                            padding-top: 10px;
                        }
                        @media print {
                            body { margin: 0.5cm; }
                            table { page-break-inside: auto; }
                            tr { page-break-inside: avoid; }
                            .header { border-bottom-color: #000; }
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>Сравнительная таблица оборудования</h1>
                        <p><strong>Торгсин - ${this.getCategoryName()}</strong></p>
                        <p>Дата формирования: ${new Date().toLocaleDateString('ru-RU')}</p>
                        <p>Время: ${new Date().toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'})}</p>
                    </div>
                    ${simplifiedTable.outerHTML}
                    <div class="footer">
                        <p><strong>Контактная информация:</strong></p>
                        <p>Телефон: +7 (831) 462-05-47 | Email: sales@tsmed.ru</p>
                        <p>ООО "Торгсин" - официальный дистрибьютор медицинского оборудования</p>
                    </div>
                </body>
                </html>
            `);
            
            printWindow.document.close();
            
            setTimeout(() => {
                printWindow.focus();
                printWindow.print();
            }, 500);
            
        } catch (error) {
            console.error('Ошибка при печати таблицы:', error);
            alert('Произошла ошибка при подготовке таблицы к печати. Пожалуйста, попробуйте еще раз.');
        }
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

// Wait for all dependencies to load
function waitForDependencies(callback, maxAttempts = 10) {
    let attempts = 0;
    
    function checkDependencies() {
        attempts++;
        
        if (typeof productsByCategory !== 'undefined' && typeof tableConfig !== 'undefined') {
            console.log('All dependencies loaded successfully');
            callback();
        } else if (attempts < maxAttempts) {
            console.log(`Waiting for dependencies... (attempt ${attempts}/${maxAttempts})`);
            setTimeout(checkDependencies, 100);
        } else {
            console.error('Failed to load dependencies after', maxAttempts, 'attempts');
            console.log('productsByCategory:', typeof productsByCategory);
            console.log('tableConfig:', typeof tableConfig);
        }
    }
    
    checkDependencies();
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, waiting for dependencies...');
    
    waitForDependencies(function() {
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
        
        console.log('Initializing category page for:', category);
        new CategoryPage(category);
    });
});