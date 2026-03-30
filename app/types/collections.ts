// 產品價錢
export interface Price {
    original: number;       // 原價
    sale: number;           // 售價
    discountAmount: number; // 折扣金額
}

// 產品類別
export type ProductTypes = {
    id: string;
    name: string;
    productID: string[];
}[];

// 產品資料
export interface ProductItem {
    id: string; // 使用 UUID
    title: string; // 產品名稱 (ex: 超級黑酵母GOLD)
    typeID: string; // 產品類別ID (ex: 狗狗)
    imageUrl: string; // 圖片連結
    salesCountText: string; // 已銷售字串 (ex: "已銷售： 40萬～50萬")

    // 價格結構
    price: Price;

    // 標籤陣列
    attributeTags: string[]; // 畫面顯示用 (ex: ['專屬狗狗', '腸胃敏感'])
    statusTags: string[];    // 畫面顯示用 (ex: ['熱銷', '新品'])
}
// 產品列表
export interface ProductList {
    productList: ProductItem[];
}
// 產品詳情-規格詳情
export interface Spec {
    title: string;      // 標題 (例如："產地"、"適用對象")
    content: string;    // 內容 (例如："台灣"、"全齡犬貓")
    index: number;  // 排序 (通常設定數字，數字越小排越上面，例如：1, 2, 3)
}
// 產品詳情
export interface ProductDetail {
    id: string;
    galleryImgs: string[]; // 詳情頁頂部的多張輪播圖
    marketingCopy: string; // 行銷短語 (ex: 國家認證口碑第一...)
    description: string; // 產品說明
    // 產品資訊
    info: {
        introduce: string[]; // 產品介紹 (array: 圖url)
        spec: Spec[]; // 產品規格 (array: 圖url)
        question: FAQ[]; // 常見問題 (array: 圖url)
        review: string[]; // 顧客好評 (array: 圖url)   
    }
}
// 產品FAQ
export interface FAQ {
    id: string;          // 唯一識別碼 (UUID)。前端做 v-for 迴圈綁定 :key 或控制展開狀態時非常需要！
    question: string;    // 問題標題 (例如："Q1：PS BUBU舒敏豐毛GOLD的全成分...")
    answer: string;  // 答案內容。強烈建議用 Html 格式字串，因為客服回答常需要「換行、粗體標記、甚至放外部連結」。
    index: number;   // 排序權重 (例如：1, 2, 3)。讓後台管理者可以自由拖拉決定哪個問題要放最上面。
    category?: string;   // (擴充預留) 問題分類。如果未來這項產品 FAQ 暴增到 20 題，前端就可以依此欄位實作「產品問題」、「配送問題」的頁籤切換。
}
// 產品標籤
export interface ProductTag {
    id: string;
    name: string;
    type: 'ATTRIBUTE' | 'STATUS'; // 區分是屬性還是狀態
    colorCode?: string; // 實務上標籤可能會有不同顏色
}