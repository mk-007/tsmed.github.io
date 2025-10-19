// Category page functionality
class CategoryPage {
    constructor(category) {
        this.category = category;
        this.products = this.getCategoryProducts(category);
        this.filteredProducts = [...this.products];
        this.currentSort = 'name';
        this.sortDirection = 'asc';
        this.init();
    
    }

    setupContactButtons() {
    // Вешаем обработчики на все кнопки контактов
    document.addEventListener('click', (e) => {
        if (e.target.closest('.contact-btn') || 
            (e.target.classList.contains('contact-btn'))) {
            const productId = e.target.closest('button').getAttribute('onclick')?.match(/contactAboutProduct\((\d+)\)/)?.[1];
            if (productId) {
                contactAboutProduct(parseInt(productId));
            }
        }
    });
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
        this.setupContactButtons();
        this.updateTable();
    }

    initCarousel() {
        if (this.products.length > 0) {
            // Создаем карусель вручную, так как у нас другой HTML
            this.renderCarousel();
            this.setupCarouselEvents();
        } else {
            document.getElementById('carouselTrack').innerHTML = 
                '<div class="no-products">Товары не найдены</div>';
        }
    }

    renderCarousel() {
        const track = document.getElementById('carouselTrack');
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

    setupCarouselEvents() {
        const track = document.getElementById('carouselTrack');
        const prevBtn = document.querySelector('.products-carousel .carousel-btn.prev');
        const nextBtn = document.querySelector('.products-carousel .carousel-btn.next');
        const dotsContainer = document.getElementById('carouselDots');
        
        let currentSlide = 0;
        let slidesToShow = this.getSlidesToShow();

        function updateSlidesToShow() {
            slidesToShow = window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
        }

        function renderDots() {
            const totalDots = Math.ceil(products.length / slidesToShow);
            dotsContainer.innerHTML = '';
            
            for (let i = 0; i < totalDots; i++) {
                const dot = document.createElement('button');
                dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            }
        }

        function updateCarousel() {
            const cardWidth = track.querySelector('.product-card')?.offsetWidth + 24 || 300;
            const translateX = -currentSlide * cardWidth * slidesToShow;
            track.style.transform = `translateX(${translateX}px)`;
            
            // Update dots
            const dots = dotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
            
            // Update button states
            const maxSlide = Math.ceil(products.length / slidesToShow) - 1;
            prevBtn.disabled = currentSlide === 0;
            nextBtn.disabled = currentSlide >= maxSlide;
        }

        function nextSlide() {
            const maxSlide = Math.ceil(products.length / slidesToShow) - 1;
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

        function goToSlide(slideIndex) {
            currentSlide = slideIndex;
            updateCarousel();
        }

        // Event listeners
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);

        window.addEventListener('resize', () => {
            updateSlidesToShow();
            renderDots();
            updateCarousel();
        });

        // Initial setup
        updateSlidesToShow();
        renderDots();
        updateCarousel();
    }

    getSlidesToShow() {
        return window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
    }

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
                    
                </div>
            </td>
        </tr>
    `).join('');

    // Update sort indicators
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
    const printWindow = window.open('', '_blank');
    
    // Создаем копию таблицы без фотографий и столбца действий
    const tableClone = document.querySelector('.comparison-table').cloneNode(true);
    
    // Удаляем столбец "Действия" (последний столбец)
    const rows = tableClone.querySelectorAll('tr');
    rows.forEach(row => {
        const cells = row.querySelectorAll('th, td');
        if (cells.length > 0) {
            cells[cells.length - 1].remove(); // Удаляем последний столбец
        }
    });
    
    // Удаляем изображения из первого столбца
    const firstColumnCells = tableClone.querySelectorAll('td:first-child');
    firstColumnCells.forEach(cell => {
        const productImage = cell.querySelector('.product-image-small');
        if (productImage) {
            productImage.remove();
        }
        // Оставляем только текстовую информацию
        const productInfo = cell.querySelector('.product-info-small');
        if (productInfo) {
            const productName = productInfo.querySelector('strong');
            const productCategory = productInfo.querySelector('.product-category');
            cell.innerHTML = '';
            if (productName) {
                cell.appendChild(productName.cloneNode(true));
            }
            if (productCategory) {
                const br = document.createElement('br');
                cell.appendChild(br);
                cell.appendChild(productCategory.cloneNode(true));
            }
        }
    });

    const tableHTML = tableClone.outerHTML;
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Сравнительная таблица - ООО Торгсин</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    margin: 20px; 
                    font-size: 12px;
                }
                table { 
                    width: 100%; 
                    border-collapse: collapse; 
                    margin: 20px 0;
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
                }
                .header h1 {
                    margin: 0 0 10px 0;
                    font-size: 18px;
                }
                .header p {
                    margin: 5px 0;
                    font-size: 12px;
                }
                @media print {
                    body { margin: 0.5cm; }
                    table { page-break-inside: auto; }
                    tr { page-break-inside: avoid; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Сравнительная таблица оборудования</h1>
                <p><strong>ООО ТОРГСИН - ${this.getCategoryName()}</strong></p>
                <p>Дата формирования: ${new Date().toLocaleDateString('ru-RU')}</p>
                <p>Время: ${new Date().toLocaleTimeString('ru-RU')}</p>
            </div>
            ${tableHTML}
            <div style="margin-top: 30px; font-size: 10px; color: #666;">
                <p>ООО ТОРГСИН - официальный дистрибьютор медицинского оборудования</p>
                <p>Телефон: +7 (831) 462-05-47 | Email: info@tsmed.ru</p>
            </div>
        </body>
        </html>
    `);
    
    printWindow.document.close();
    
    // Даем время на загрузку стилей перед печатью
    setTimeout(() => {
        printWindow.print();
        // printWindow.close(); // Можно раскомментировать чтобы автоматически закрывать окно после печати
    }, 250);
}
}

// Global functions for buttons
function addToComparison(productId) {
    alert('Товар добавлен в сравнение');
}

function contactAboutProduct(productId) {
    try {
        const allProducts = [];
        for (const category in productsByCategory) {
            allProducts.push(...productsByCategory[category]);
        }
        
        const product = allProducts.find(p => p.id === productId);
        if (product) {
            const subject = `Запрос по товару: ${product.name}`;
            const body = `Здравствуйте!\n\nМеня интересует товар: ${product.name}\n\nПрошу предоставить:\n- Подробное техническое описание\n- Коммерческое предложение\n- Условия поставки и сроки\n\nС уважением,\n[Ваше имя]\n[Название организации]\n[Контактный телефон]`;
            
            const mailtoLink = `mailto:sales@tsmed.ru?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            
            // Открываем почтовый клиент
            window.location.href = mailtoLink;
        } else {
            alert('Товар не найден. Пожалуйста, свяжитесь с нами по телефону.');
        }
    } catch (error) {
        console.error('Ошибка при создании письма:', error);
        // Альтернативный вариант - показать контактную информацию
        alert('Не удалось открыть почтовый клиент. Пожалуйста, свяжитесь с нами:\nТелефон: +7 (831) 462-05-47\nEmail: sales@tsmed.ru');
    }
}
// Initialize category page
document.addEventListener('DOMContentLoaded', () => {
    // Определяем категорию из URL
    const path = window.location.pathname;
    let category = 'chambers';
    
    if (path.includes('sterilizers')) {
        category = 'sterilizers';
    } else if (path.includes('equipment')) {
        category = 'equipment';
    }
    
    // Проверяем, что данные загружены
    if (typeof productsByCategory !== 'undefined') {
        new CategoryPage(category);
    } else {
        console.error('productsByCategory is not defined');
        document.getElementById('carouselTrack').innerHTML = 
            '<div class="no-products">Ошибка загрузки данных</div>';
    }
});