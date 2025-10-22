const tableConfig = {
    chambers: {
        columns: [
            { key: 'name', label: 'Модель', sortable: true, showInTable: true, isLink: true },
            { key: 'source', label: 'Источник пара', sortable: true, showInTable: true },//
            { key: 'volume', label: 'Объем камеры (м³)', sortable: true, showInTable: true },//
            { key: 'power', label: 'Мощность (кВт)', sortable: true, showInTable: true },//
            { key: 'dimensions', label: 'Габариты (мм)', sortable: false, showInTable: false },//
            { key: 'weight', label: 'Вес (кг)', sortable: false, showInTable: false },//
            { key: 'voltage', label: 'Питание', sortable: false, showInTable: false },//
            { key: 'internal', label: 'Внутренние размеры (мм)', sortable: true,  showInTable: false  },//
            { key: 'square', label: 'Площадь пола (м²)', sortable: true, showInTable: true },//
            { key: 'maxloading', label: 'Норма загрузки белья (кг)', sortable: true, showInTable: true },//
            { key: 'options', label: 'Варианты исполнения', sortable: false, showInTable: false }//

        ],
        filters: [
            { key: 'all', label: 'Все модели' },
            { key: 'compact', label: 'Компактные', condition: (product) => (product.specifications?.volume || 0) < 1.0 },
            { key: 'professional', label: 'Габаритные', condition: (product) => (product.specifications?.volume || 0) >= 1.0 }
        ],
        sortOptions: [
            { value: 'name', label: 'По названию' },
            { value: 'volume', label: 'По объему камеры' },
            { value: 'power', label: 'По мощности' },
            { value: 'maxloading', label: 'По максимальной загрузке' }
        ]
    },

    sterilizers: {
        columns: [
            { key: 'name', label: 'Модель', sortable: true , showInTable: true, isLink: true  },
            { key: 'type', label: 'Тип', sortable: false, showInTable: true  },
            { key: 'volume', label: 'Объем камеры (м³)', sortable: true, showInTable: true },//
            { key: 'humidity', label: 'Остаточная влажность (%)', sortable: true , showInTable: true },
            { key: 'temperature', label: 'Точность температуры (°C)', sortable: true, showInTable: true  },
            { key: 'pressure', label: 'Рабочее давление пара (МПа)', sortable: true , showInTable: true },
            { key: 'modes', label: 'Количество режимов', sortable: false, showInTable: true  },
            { key: 'appliedboxes', label: 'Применяемые стерилизаационные коробки', sortable: false, showInTable: false  },
            { key: 'closemechanic', label: 'Механизм закрывания крышки', sortable: false , showInTable: true }
        ],
        filters: [
            { key: 'all', label: 'Все модели' },
            { key: 'small', label: 'Малые объемы', condition: (product) => (product.specifications?.volume || 0) < 50 },
            { key: 'large', label: 'Большие объемы', condition: (product) => (product.specifications?.volume || 0) >= 50 }
        ],
        sortOptions: [
            { value: 'name', label: 'По названию' },
            { value: 'volume', label: 'По объему' }
        ]
    },

    equipment: {
        columns: [
            { key: 'name', label: 'Модель', sortable: true },
            { key: 'power', label: 'Мощность (кВт)', sortable: true },
            { key: 'dimensions', label: 'Габариты (мм)', sortable: true },
            { key: 'weight', label: 'Вес (кг)', sortable: true },
            { key: 'voltage', label: 'Напряжение', sortable: false },
            { key: 'material', label: 'Материал', sortable: false }
        ],
        filters: [
            { key: 'all', label: 'Все оборудование' },
            { key: 'mobile', label: 'Мобильное', condition: (product) => (product.specifications?.weight || 0) < 100 },
            { key: 'stationary', label: 'Стационарное', condition: (product) => (product.specifications?.weight || 0) >= 100 }
        ],
        sortOptions: [
            { value: 'name', label: 'По названию' },
            { value: 'power', label: 'По мощности' },
            { value: 'weight', label: 'По весу' }
        ]
    }
};
