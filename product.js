// Product page functionality
class ProductPage {
    constructor() {
        this.productId = this.getProductIdFromUrl();
        this.product = null;
        this.init();
    }

    getProductIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return parseInt(urlParams.get('id')) || 1; // По умолчанию ID 1
    }

    init() {
        this.findProduct();
        if (this.product) {
            this.renderProduct();
            this.setupEventListeners();
            this.loadRelatedProducts();
        } else {
            this.showProductNotFound();
        }
    }

    findProduct() {
        // Ищем товар во всех категориях
        for (const category in productsByCategory) {
            this.product = productsByCategory[category].find(p => p.id === this.productId);
            if (this.product) {
                this.product.category = category;
                break;
            }
        }
    }

    renderProduct() {
        this.updatePageTitle();
        this.renderGallery();
        this.renderProductInfo();
        this.renderSpecifications();
        this.renderDocuments();
        this.updateBreadcrumbs();
    }

    updatePageTitle() {
        document.title = `${this.product.name} - ООО "ТС Мед"`;
    }

    renderGallery() {
        const mainImage = document.getElementById('mainImage');
        const thumbnailsContainer = document.getElementById('galleryThumbnails');

        if (this.product.images && this.product.images.length > 0) {
            // Устанавливаем главное изображение
            mainImage.src = this.product.images[0];
            mainImage.alt = this.product.name;

            // Создаем миниатюры
            thumbnailsContainer.innerHTML = this.product.images.map((image, index) => `
                <div class="thumbnail ${index === 0 ? 'active' : ''}" data-image="${image}">
                    <img src="${image}" alt="${this.product.name} - фото ${index + 1}">
                </div>
            `).join('');

            // Добавляем обработчики для миниатюр
            this.setupGalleryEvents();
        } else {
            // Если нет дополнительных фото, используем основное изображение
            mainImage.src = this.product.image;
            mainImage.alt = this.product.name;
            thumbnailsContainer.innerHTML = '';
        }
    }

    setupGalleryEvents() {
        document.querySelectorAll('.thumbnail').forEach(thumbnail => {
            thumbnail.addEventListener('click', () => {
                // Убираем активный класс у всех миниатюр
                document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                // Добавляем активный класс текущей миниатюре
                thumbnail.classList.add('active');
                // Меняем главное изображение
                document.getElementById('mainImage').src = thumbnail.dataset.image;
            });
        });
    }

    renderProductInfo() {
        document.getElementById('productTitle').textContent = this.product.name;
        document.getElementById('productDescription').textContent = this.product.description;
    }

    renderSpecifications() {
        const specsGrid = document.getElementById('specsGrid');
        
        if (this.product.specifications) {
            const specsHTML = Object.entries(this.product.specifications).map(([key, value]) => {
                const label = this.getSpecLabel(key);
                return `
                    <div class="spec-item">
                        <span class="spec-label">${label}:</span>
                        <span class="spec-value">${value}</span>
                    </div>
                `;
            }).join('');
            
            specsGrid.innerHTML = specsHTML;
        } else {
            specsGrid.innerHTML = '<p>Характеристики не указаны</p>';
        }
    }

    getSpecLabel(key) {
        const labels = {
            'volume': 'Объем камеры',
            'power': 'Мощность',
            'temperature': 'Температура',
            'dimensions': 'Габариты',
            'weight': 'Вес',
            'capacity': 'Вместимость',
            'pressure': 'Давление',
            'voltage': 'Напряжение',
            'material': 'Материал',
            'warranty': 'Гарантия'
        };
        
        return labels[key] || key;
    }

    renderDocuments() {
        const documentsGrid = document.getElementById('documentsGrid');
        
        if (this.product.documents && this.product.documents.length > 0) {
            documentsGrid.innerHTML = this.product.documents.map(doc => `
                <div class="document-card">
                    <div class="document-icon">
                        <i class="fas fa-file-pdf"></i>
                    </div>
                    <div class="document-info">
                        <h4>${doc.name}</h4>
                        <p>${doc.description || 'Техническая документация'}</p>
                        <a href="${doc.url}" class="btn btn-download" download>
                            <i class="fas fa-download"></i>
                            Скачать PDF
                        </a>
                    </div>
                </div>
            `).join('');
        } else {
            documentsGrid.innerHTML = `
                <div class="no-documents">
                    <i class="fas fa-file-alt"></i>
                    <p>Документация временно недоступна</p>
                    <p>Свяжитесь с нами для получения полного пакета документов</p>
                </div>
            `;
        }
    }

    updateBreadcrumbs() {
        const categoryLink = document.getElementById('categoryLink');
        const productName = document.getElementById('productNameBreadcrumb');
        
        const categoryNames = {
            'chambers': 'Дезинфекционные камеры',
            'sterilizers': 'Стерилизаторы',
            'equipment': 'Оборудование'
        };
        
        const categoryName = categoryNames[this.product.category] || 'Категория';
        const categoryPage = this.getCategoryPage();
        
        categoryLink.textContent = categoryName;
        categoryLink.href = categoryPage;
        productName.textContent = this.product.name;
    }

    getCategoryPage() {
        const pages = {
            'chambers': 'disinfection-chambers.html',
            'sterilizers': 'sterilizers.html',
            'equipment': 'equipment.html'
        };
        
        return pages[this.product.category] || 'index.html';
    }

    setupEventListeners() {
        // Кнопка запроса цены
        document.getElementById('requestPriceBtn').addEventListener('click', () => {
            this.requestPrice();
        });
    }

    requestPrice() {
        const subject = `Запрос цены: ${this.product.name}`;
        const body = `Здравствуйте!\n\nМеня интересует товар: ${this.product.name}\n\nПрошу предоставить коммерческое предложение.\n\nС уважением,\n[Ваше имя]`;
        
        const mailtoLink = `mailto:sales@tsmed.ru?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        // Пытаемся открыть почтовый клиент
        const mailWindow = window.open(mailtoLink, '_blank');
        
        // Если почтовый клиент не открылся, переходим к контактам
        setTimeout(() => {
            if (!mailWindow || mailWindow.closed || typeof mailWindow.closed === 'undefined') {
                document.getElementById('contacts').scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, 1000);
    }

    loadRelatedProducts() {
        // Загружаем товары из той же категории, исключая текущий
        const relatedProducts = productsByCategory[this.product.category]?.filter(p => p.id !== this.product.id) || [];
        
        if (relatedProducts.length > 0) {
            this.renderRelatedProducts(relatedProducts);
        } else {
            document.querySelector('.related-products').style.display = 'none';
        }
    }

    renderRelatedProducts(products) {
        const track = document.getElementById('relatedProductsTrack');
        const dotsContainer = document.getElementById('relatedProductsDots');
        
        track.innerHTML = products.map(product => `
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
                    <a href="product.html?id=${product.id}" class="product-link">
                        <span>Подробнее</span>
                        <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        `).join('');

        // Инициализируем карусель для связанных товаров
        this.initRelatedProductsCarousel(products.length);
    }

    initRelatedProductsCarousel(productsCount) {
        // Простая реализация карусели для связанных товаров
        const track = document.getElementById('relatedProductsTrack');
        const prevBtn = document.querySelector('.related-products .carousel-btn.prev');
        const nextBtn = document.querySelector('.related-products .carousel-btn.next');
        const dotsContainer = document.getElementById('relatedProductsDots');
        
        let currentSlide = 0;
        let slidesToShow = this.getSlidesToShow();

        function updateCarousel() {
            const cardWidth = track.querySelector('.product-card')?.offsetWidth + 24 || 300;
            const translateX = -currentSlide * cardWidth * slidesToShow;
            track.style.transform = `translateX(${translateX}px)`;
            
            // Обновляем точки
            const dots = dotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
            
            // Обновляем кнопки
            const maxSlide = Math.ceil(productsCount / slidesToShow) - 1;
            prevBtn.disabled = currentSlide === 0;
            nextBtn.disabled = currentSlide >= maxSlide;
        }

        function nextSlide() {
            const maxSlide = Math.ceil(productsCount / slidesToShow) - 1;
            if (currentSlide < maxSlide) {
                currentSlide++;
                updateCarousel();
            }
        }

        function prevSlide() {
            if (currentSlide > 0) {
                currentSlide--;
                updateCarousel();
            }
        }

        // Создаем точки
        const totalDots = Math.ceil(productsCount / slidesToShow);
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('button');
            dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => {
                currentSlide = i;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        }

        // Назначаем обработчики
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);

        // Ресайз
        window.addEventListener('resize', () => {
            slidesToShow = this.getSlidesToShow();
            updateCarousel();
        });

        updateCarousel();
    }

    getSlidesToShow() {
        return window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
    }

    showProductNotFound() {
        document.body.innerHTML = `
            <div class="product-not-found">
                <h1>Товар не найден</h1>
                <p>Запрошенный товар не существует или был удален.</p>
                <a href="index.html" class="btn btn-primary">Вернуться на главную</a>
            </div>
        `;
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

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    new MobileMenu();
    new ProductPage();
});