// Search functionality
class ProductSearch {
    constructor() {
        this.searchInput = null;
        this.searchResults = null;
        this.allProducts = this.getAllProducts();
        this.init();
    }

    // Get all products from all categories
    getAllProducts() {
        const allProducts = [];
        for (const category in productsByCategory) {
            allProducts.push(...productsByCategory[category]);
        }
        return allProducts;
    }

    init() {
        this.createSearchInterface();
        this.setupEventListeners();
    }

    // Create search interface in the search section
    createSearchInterface() {
        // Элементы уже есть в HTML, просто находим их
        this.searchInput = document.getElementById('productSearch');
        this.searchResults = document.getElementById('searchResults');
        this.searchClear = document.getElementById('searchClear');
    }

    setupEventListeners() {
    const searchBtn = document.getElementById('searchBtn');
    const searchClear = document.getElementById('searchClear');

    // Search on button click
    searchBtn.addEventListener('click', () => this.performSearch());

    // Search on Enter key
    this.searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            this.performSearch();
        }
    });

    // Real-time search with debounce
    this.searchInput.addEventListener('input', this.debounce(() => {
        if (this.searchInput.value.length >= 2) {
            this.performSearch();
        } else {
            this.hideResults();
        }
    }, 300));

    // Clear search
    searchClear.addEventListener('click', () => {
        this.clearSearch();
    });

    // Show/hide clear button based on input
    this.searchInput.addEventListener('input', () => {
        searchClear.style.display = this.searchInput.value ? 'flex' : 'none';
    });

    // Close results when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container-centered') && 
            !e.target.closest('.search-results')) {
            this.hideResults();
        }
    });

    // Popular tags functionality - УЛУЧШЕННАЯ ВЕРСИЯ
    this.setupPopularTags();
}

// Новый метод для настройки популярных тегов
setupPopularTags() {
    // Используем делегирование событий для динамически создаваемых элементов
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('search-tag')) {
            const searchText = e.target.dataset.search;
            this.searchInput.value = searchText;
            this.performSearch();
            this.searchInput.focus();
        }
    });
    
    // Также добавляем обработчики для существующих элементов
    document.querySelectorAll('.search-tag').forEach(tag => {
        tag.addEventListener('click', (e) => {
            const searchText = e.target.dataset.search;
            this.searchInput.value = searchText;
            this.performSearch();
            this.searchInput.focus();
        });
    });
}

    // Debounce function to limit search frequency
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Perform search
    performSearch() {
        const query = this.searchInput.value.trim().toLowerCase();
        
        if (query.length < 2) {
            this.showMessage('Введите минимум 2 символа для поиска');
            return;
        }

        const results = this.searchProducts(query);
        
        if (results.length > 0) {
            this.displayResults(results, query);
        } else {
            this.showMessage('Товары не найдены. Попробуйте изменить запрос.');
        }
    }

    // Search products (case insensitive)
    searchProducts(query) {
        return this.allProducts.filter(product => {
            const searchText = (product.name + ' ' + product.description).toLowerCase();
            return searchText.includes(query);
        });
    }

    // Display search results
    displayResults(results, query) {
        const resultsHTML = results.map(product => `
            <div class="search-result-item" data-product-id="${product.id}">
                <div class="result-image">
                    <img src="${product.image}" alt="${product.name}" 
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <div class="image-fallback" style="display: none;">
                        <i class="fas fa-cube"></i>
                    </div>
                </div>
                <div class="result-info">
                    <h4 class="result-title">${this.highlightText(product.name, query)}</h4>
                    <p class="result-description">${this.highlightText(product.description, query)}</p>
                    <div class="result-meta">
                        <a href="${product.link}" class="result-link">Подробнее →</a>
                    </div>
                </div>
            </div>
        `).join('');

        this.searchResults.innerHTML = `
            <div class="results-header">
                <span>Найдено товаров: ${results.length}</span>
                <button class="close-results" id="closeResults">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="results-list">
                ${resultsHTML}
            </div>
        `;

        this.searchResults.style.display = 'block';

        // Add close button functionality
        document.getElementById('closeResults').addEventListener('click', () => {
            this.hideResults();
        });

        // Add click handlers for result items
        this.searchResults.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.result-link')) {
                    const productId = item.dataset.productId;
                    const product = this.allProducts.find(p => p.id == productId);
                    if (product) {
                        window.location.href = product.link;
                    }
                }
            });
        });
    }

    // Highlight matching text in results
    highlightText(text, query) {
        const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi');
        return text.replace(regex, '<mark class="search-highlight">$1</mark>');
    }

    // Escape special characters for regex
    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Show message
    showMessage(message) {
        this.searchResults.innerHTML = `
            <div class="search-message">
                <i class="fas fa-info-circle"></i>
                <span>${message}</span>
            </div>
        `;
        this.searchResults.style.display = 'block';
    }

    // Hide results
    hideResults() {
        this.searchResults.style.display = 'none';
    }

    // Clear search
    clearSearch() {
        this.searchInput.value = '';
        this.hideResults();
        this.searchClear.style.display = 'none';
        this.searchInput.focus();
    }
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProductSearch();
});