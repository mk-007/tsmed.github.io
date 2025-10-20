const productsByCategory = {
    chambers: [
        {
            id: 11,
            name: "Камера дезинфекционная ВФЭ-1.5/1.0 СЗМО",
            description: "Современная дезинфекционная камера для обработки медицинского инструментария и оборудования с увеличенной эффективностью.",
            image: 'images/vfe-1.5-1.0/1.jpg',
            images: [
                'images/vfe-1.5-1.0/1.jpg',
                'images/vfe-1.5-1.0/2.jpg',
                'images/vfe-1.5-1.0/3.jpg',
                'images/vfe-1.5-1.0/4.jpg'
            ],
            link: "product.html?id=11",
            specifications: {
                volume: "0,9 м³",
                power: "3,5 кВт",
                temperature: "100-120°C",
                dimensions: "1200×800×1800 мм",
                weight: "250 кг",
                voltage: "380 В",
                material: "Нержавеющая сталь",
                warranty: "24 месяца"
            },
            documents: [
                {
                    name: "Регистрационное удостоверение",
                    description: "Регистрационное удостоверение на товар",
                    url: "documents/vfe-1.5-1.0/RU.pdf"
                },
                {
                    name: "Декларация о соответствии",
                    description: "Официальный сертификат соответствия",
                    url: "documents/vfe-1.5-1.0/decl.pdf"
                }
            ]
        },

        {
            id: 12,
            name: "Камера дезинфекционная ВФЭ-2/0.9 СЗМО",
            description: "Современная дезинфекционная камера для обработки медицинского инструментария и оборудования с увеличенной эффективностью.",
            image: 'images/vfe-2-0.9/1.jpg',
            images: [
                'images/vfe-2-0.9/1.jpg',
                'images/vfe-2-0.9/2.jpg',
                'images/vfe-2-0.9/3.jpg',
                'images/vfe-2-0.9/4.jpg'
            ],
            link: "product.html?id=12",
            specifications: {
                volume: "0,9 м³",
                power: "3,5 кВт",
                temperature: "100-120°C",
                dimensions: "1200×800×1800 мм",
                weight: "250 кг",
                voltage: "380 В",
                material: "Нержавеющая сталь",
                warranty: "24 месяца"
            },
            documents: [
                {
                    name: "Регистрационное удостоверение",
                    description: "Регистрационное удостоверение на товар",
                    url: "documents/vfe-2-0.9/RU.pdf"
                }

            ]
        },

        {
            id: 13,
            name: "Камера дезинфекционная КВФ 5/2,6 СЗМО",
            description: "Профессиональное оборудование для дезинфекции с расширенной камерой обработки в медицинских учреждениях.",
            image: 'images/kvf-5-2.6/1.jpg',
            images: [
                'images/kvf-5-2.6/1.jpg',
                'images/kvf-5-2.6/2.jpg',
                'images/kvf-5-2.6/3.jpg',
                'images/kvf-5-2.6/4.jpg'
            ],
            link: "product.html?id=13",
            specifications: {
                volume: "1,4 м³",
                power: "4,2 кВт",
                temperature: "100-125°C",
                dimensions: "1400×900×2000 мм",
                weight: "320 кг",
                voltage: "380 В",
                material: "Нержавеющая сталь",
                warranty: "24 месяца"
            },
            documents: [
                {
                    name: "Регистрационное удостоверение",
                    description: "Регистрационное удостоверение",
                    url: "documents/kvf-5-2.6/RU.pdf"
                },
                {
                    name: "Декларация о соответствии",
                    description: "Декларация о соответствии КВФ 5/2.6",
                    url: "documents/kvf-5-2.6/decl.pdf"
                }
            ]
        },

        {
            id: 14,
            name: "Камера дезинфекционная КВФ 3/2,1 СЗМО",
            description: "Камера дезинфекционно-дезинсекционная паровоздушно-пароформалиновая КВФ-3/2,1-«СЗМО»",
            image: 'images/kvf-3-2.1/1.jpg',
            images: [
                'images/kvf-3-2.1/1.jpg',
                'images/kvf-3-2.1/2.jpg',
                'images/kvf-3-2.1/3.jpg',
                'images/kvf-3-2.1/4.jpg',
                'images/kvf-3-2.1/5.jpg'
            ],
            link: "product.html?id=14",
            specifications: {
                volume: "1,4 м³",
                power: "4,2 кВт",
                temperature: "100-125°C",
                dimensions: "1400×900×2000 мм",
                weight: "320 кг",
                voltage: "380 В",
                material: "Нержавеющая сталь",
                warranty: "24 месяца"
            },
            documents: [
                {
                    name: "Регистрационное удостоверение",
                    description: "Регистрационное удостоверение",
                    url: "documents/kvf-3-2.1/RU.pdf"
                },
                {
                    name: "Декларация о соответствии",
                    description: "Декларация о соответствии КВФ 3/2.1",
                    url: "documents/kvf-3-2.1/decl.pdf"
                }
            ]
        }
    ],
    sterilizers: [
        {
            id: 21,
            name: "Стерилизатор паровой ГК-100 СЗМО",
            description: "Паровой стерилизатор объемом 100 литров с автоматическим управлением для медицинских учреждений.",
            image: 'images/gk-100/1.jpg',
            images: [
                'images/gk-100/1.jpg',
                'images/gk-100/2.jpg',
                'images/gk-100/3.jpg'
            ],
            link: "product.html?id=21",
            specifications: {
                volume: "100 л",
                power: "8,5 кВт",
                temperature: "132-135°C",
                dimensions: "600×800×1800 мм",
                weight: "280 кг",
                pressure: "0,22 МПа",
                voltage: "380 В",
                warranty: "18 месяцев"
            },
            documents: [
                {
                    name: "Регистрационное удостоверение",
                    description: "Регистрационное удостоверение",
                    url: "documents/gk-100/RU.pdf"
                },
                {
                    name: "Декларация о соответствии",
                    description: "Декларация о соответствии",
                    url: "documents/gk-100/decl.pdf"
                }
            ]
        },
        {
            id: 22,
            name: "Стерилизатор паровой ГК-10 СЗМО",
            description: "Паровой стерилизатор объемом 100 литров с автоматическим управлением для медицинских учреждений.",
            image: 'images/gk-10/1.jpg',
            images: [
                'images/gk-10/1.jpg',
                'images/gk-10/2.jpg',
            ],
            link: "product.html?id=22",
            specifications: {
                volume: "100 л",
                power: "8,5 кВт",
                temperature: "132-135°C",
                dimensions: "600×800×1800 мм",
                weight: "280 кг",
                pressure: "0,22 МПа",
                voltage: "380 В",
                warranty: "18 месяцев"
            },
            documents: [
                {
                    name: "Технический паспорт",
                    description: "Полное техническое описание и характеристики",
                    url: "documents/gk-10/RU.pdf"
                },
                {
                    name: "Инструкция по эксплуатации",
                    description: "Руководство пользователя",
                    url: "documents/gk-10/decl.pdf"
                }
            ]
        }
    ]

};
