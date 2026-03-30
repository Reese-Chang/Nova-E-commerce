import type { ProductTypes, ProductItem, ProductList, ProductDetail } from '~/types/collections';

// ==================== 產品類別 ====================
export const useProductTypes = (): ProductTypes => [
    {
        id: 'type-dog',
        name: '狗狗',
        productID: ['prod-001', 'prod-002', 'prod-003']
    },
    {
        id: 'type-cat',
        name: '貓咪',
        productID: ['prod-004', 'prod-005']
    },
];

// ==================== 產品列表 ====================
export const useProductList = (): ProductList => ({
    productList: [
        // ── 狗狗產品 (typeID → type-dog) ───────────────
        {
            id: 'prod-001',
            title: '超級黑酵母 GOLD',
            typeID: 'type-dog',
            imageUrl: '/images/prod-001.png',
            salesCountText: '已銷售：40萬～50萬',
            price: {
                original: 1980,
                sale: 1703,
                discountAmount: 277,
            },
            attributeTags: ['專屬狗狗', '腸胃敏感'],
            statusTags: ['熱銷', '新品'],
        },
        {
            id: 'prod-002',
            title: '深海魚油膠囊 Plus',
            typeID: 'type-dog',
            imageUrl: '/images/prod-002.png',
            salesCountText: '已銷售：10萬～20萬',
            price: {
                original: 1280,
                sale: 980,
                discountAmount: 300,
            },
            attributeTags: ['專屬狗狗', '關節保健'],
            statusTags: ['熱銷'],
        },
        {
            id: 'prod-003',
            title: '益生菌活力包',
            typeID: 'type-dog',
            imageUrl: '/images/prod-003.png',
            salesCountText: '已銷售：5萬～10萬',
            price: {
                original: 890,
                sale: 790,
                discountAmount: 100,
            },
            attributeTags: ['專屬狗狗', '腸胃敏感', '免疫力'],
            statusTags: ['新品'],
        },
        // ── 貓咪產品 (typeID → type-cat) ───────────────
        {
            id: 'prod-004',
            title: '貓用化毛膏禮盒',
            typeID: 'type-cat',
            imageUrl: '/images/prod-004.png',
            salesCountText: '已銷售：20萬～30萬',
            price: {
                original: 760,
                sale: 650,
                discountAmount: 110,
            },
            attributeTags: ['專屬貓咪', '毛球問題'],
            statusTags: ['熱銷'],
        },
        {
            id: 'prod-005',
            title: '貓咪關節靈活素',
            typeID: 'type-cat',
            imageUrl: '/images/prod-005.png',
            salesCountText: '已銷售：3萬～5萬',
            price: {
                original: 1500,
                sale: 1299,
                discountAmount: 201,
            },
            attributeTags: ['專屬貓咪', '關節保健'],
            statusTags: [],
        },
    ],
});

// ==================== 產品詳情 ====================
// id 對應 ProductItem.id
export const useProductDetails = (): ProductDetail[] => [
    {
        id: 'prod-001',
        galleryImgs: [
            '/images/prod-001.png',
            '/images/prod-001-g2.png',
            '/images/prod-001-g3.png',
        ],
        marketingCopy: '國家認證口碑第一，銷售 40 萬罐以上！',
        description: '採用專利黑酵母菌株，富含 β-葡聚醣，有效提升毛孩免疫力，改善腸道菌相，讓您的狗狗每天活力充沛。',
        info: {
            introduce: ['/images/prod-001-intro.png'],
            spec: [
                { index: 1, title: '產地', content: '台灣' },
                { index: 2, title: '適用對象', content: '全齡犬' },
                { index: 3, title: '主要成分', content: '黑酵母菌株、β-葡聚醣' },
                { index: 4, title: '淨重', content: '60 粒 / 30g' },
                { index: 5, title: '保存期限', content: '製造日期起 2 年' },
            ],
            question: [
                { id: 'faq-001-1', index: 1, question: '超級黑酵母 GOLD 適合幾個月以上的狗狗食用？', answer: '建議 <strong>3 個月以上</strong>的狗狗即可開始補充，懷孕或哺乳期母犬請先諮詢獸醫。' },
                { id: 'faq-001-2', index: 2, question: '每天要餵幾粒？', answer: '建議依體重每日 1～2 粒，可直接餵食或拌入飼料。' },
                { id: 'faq-001-3', index: 3, question: '是否有副作用？', answer: '本品為天然成分，安全性高。少數毛孩初期食用可能有輕微腸胃適應期，屬正常現象。' },
            ],
            review: ['/images/review-dog.png'],
        },
    },
    {
        id: 'prod-002',
        galleryImgs: [
            '/images/prod-002.png',
            '/images/prod-002-g2.png',
        ],
        marketingCopy: '來自深海的純淨 Omega-3，守護關節與心血管健康！',
        description: '使用挪威深海小魚萃取，高純度 EPA + DHA，支援關節靈活度，維持皮毛光澤亮麗。',
        info: {
            introduce: ['/images/prod-002-intro.png'],
            spec: [
                { index: 1, title: '產地', content: '挪威' },
                { index: 2, title: '適用對象', content: '全齡犬' },
                { index: 3, title: '主要成分', content: 'EPA、DHA、Omega-3' },
                { index: 4, title: '淨重', content: '120 粒膠囊' },
                { index: 5, title: '保存期限', content: '製造日期起 2 年' },
            ],
            question: [
                { id: 'faq-002-1', index: 1, question: '魚油膠囊怎麼給狗狗吃？', answer: '可直接餵食，或將膠囊戳破拌入飼料中，大多數毛孩都很喜歡魚香氣味。' },
                { id: 'faq-002-2', index: 2, question: '魚油對關節有什麼幫助？', answer: 'Omega-3 中的 EPA 可抑制關節發炎反應，DHA 則有助於維持神經健康，長期補充可改善關節靈活度。' },
            ],
            review: ['/images/review-dog.png'],
        },
    },
    {
        id: 'prod-003',
        galleryImgs: [
            '/images/prod-003.png',
        ],
        marketingCopy: '千億活菌每日守護，腸胃好、免疫力更強！',
        description: '精選十種益生菌菌株，搭配益生質，協助維持腸道健康平衡，提升自然抵抗力。',
        info: {
            introduce: ['/images/prod-003-intro.png'],
            spec: [
                { index: 1, title: '產地', content: '台灣' },
                { index: 2, title: '適用對象', content: '全齡犬' },
                { index: 3, title: '菌株數', content: '10 種益生菌菌株' },
                { index: 4, title: '活菌數', content: '每包含 120 億 CFU' },
                { index: 5, title: '淨重', content: '30 包 / 盒' },
            ],
            question: [
                { id: 'faq-003-1', index: 1, question: '益生菌活力包要怎麼使用？', answer: '每日 1 包，直接撕開倒入飼料中拌勻即可，雞肉口味毛孩超愛。' },
                { id: 'faq-003-2', index: 2, question: '開封後需要冷藏嗎？', answer: '每包為獨立密封小包，無需冷藏，放置於<strong>陰涼乾燥處</strong>即可。' },
            ],
            review: ['/images/review-dog.png'],
        },
    },
    {
        id: 'prod-004',
        galleryImgs: [
            '/images/prod-004.png',
            '/images/prod-004-g2.png',
        ],
        marketingCopy: '輕鬆化解毛球困擾，讓貓咪腸胃舒暢每一天！',
        description: '添加天然麥芽糖漿與木瓜酵素，幫助腸胃蠕動，有效排出毛球，減少嘔吐不適。',
        info: {
            introduce: ['/images/prod-004-intro.png'],
            spec: [
                { index: 1, title: '產地', content: '台灣' },
                { index: 2, title: '適用對象', content: '全齡貓' },
                { index: 3, title: '主要成分', content: '麥芽糖漿、木瓜酵素、膳食纖維' },
                { index: 4, title: '每條淨重', content: '30g' },
                { index: 5, title: '數量', content: '禮盒 3 條裝' },
            ],
            question: [
                { id: 'faq-004-1', index: 1, question: '多久餵一次化毛膏？', answer: '建議每週 2～3 次，換毛季可每日補充，一次約花生米大小（3～5g）。' },
                { id: 'faq-004-2', index: 2, question: '貓咪不願意直接吃怎麼辦？', answer: '可塗抹在貓咪前腳讓牠自行舔食，或拌入少量主食中。' },
            ],
            review: ['/images/review-cat.png'],
        },
    },
    {
        id: 'prod-005',
        galleryImgs: [
            '/images/prod-005.png',
        ],
        marketingCopy: '專為高齡貓設計，靈活行動從關節開始！',
        description: '含葡萄糖胺、軟骨素與 MSM，全面支撐關節軟骨，讓年長貓咪維持輕盈靈活的步伐。',
        info: {
            introduce: ['/images/prod-005-intro.png'],
            spec: [
                { index: 1, title: '產地', content: '台灣' },
                { index: 2, title: '適用對象', content: '7 歲以上高齡貓' },
                { index: 3, title: '主要成分', content: '葡萄糖胺、軟骨素、MSM' },
                { index: 4, title: '淨重', content: '60 粒膠囊' },
                { index: 5, title: '保存期限', content: '製造日期起 2 年' },
            ],
            question: [
                { id: 'faq-005-1', index: 1, question: '幼貓或成貓可以吃關節靈活素嗎？', answer: '本品專為 <strong>7 歲以上高齡貓</strong>設計，其他年齡貓咪建議諮詢獸醫後再使用。' },
                { id: 'faq-005-2', index: 2, question: '多久可以看到效果？', answer: '通常連續補充 4～8 週後可觀察到關節靈活度改善，建議持續使用以維持效果。' },
            ],
            review: ['/images/review-cat.png'],
        },
    },
];
