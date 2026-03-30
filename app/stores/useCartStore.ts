import { defineStore } from 'pinia'
import type { ProductItem } from '~/types/collections'

// ────────────────────────────────────────────────────────────
// 型別定義
// ────────────────────────────────────────────────────────────

/**
 * 購物車中的單一品項
 * 繼承 ProductItem 的所有欄位，額外加上 quantity（數量）
 */
export interface CartItem extends ProductItem {
    quantity: number // 購買數量
}

// ────────────────────────────────────────────────────────────
// localStorage 工具函式
// 目的：讓頁面重整後購物車資料不消失
// ────────────────────────────────────────────────────────────

const CART_KEY = 'nova_cart' // 儲存在 localStorage 的鍵名

/** 把購物車陣列存進 localStorage */
function saveToStorage(items: CartItem[]) {
    if (typeof window === 'undefined') return
    localStorage.setItem(CART_KEY, JSON.stringify(items))
}

/** 從 localStorage 讀取購物車陣列；讀不到就回傳空陣列 */
function loadFromStorage(): CartItem[] {
    if (typeof window === 'undefined') return []
    try {
        const raw = localStorage.getItem(CART_KEY)
        return raw ? JSON.parse(raw) : []
    } catch {
        return []
    }
}

// ────────────────────────────────────────────────────────────
// Pinia Store 定義
// ────────────────────────────────────────────────────────────

export const useCartStore = defineStore('cart', {
    // ── State：購物車的所有狀態 ──────────────────────────────
    state: () => ({
        /**
         * items：購物車品項陣列
         * 每個元素都是 CartItem（ProductItem + quantity）
         * 初始值從 localStorage 讀取（支援頁面重整後保留資料）
         */
        items: loadFromStorage() as CartItem[],
    }),

    // ── Getters：從 state 衍生出的計算值 ────────────────────
    getters: {
        /** 購物車內的總品項數（把所有 quantity 加總） */
        totalCount: (state): number =>
            state.items.reduce((sum, item) => sum + item.quantity, 0),

        /** 購物車內的總金額（售價 × 數量 加總） */
        totalPrice: (state): number =>
            state.items.reduce((sum, item) => sum + item.price.sale * item.quantity, 0),

        /** 判斷購物車是否為空 */
        isEmpty: (state): boolean => state.items.length === 0,
    },

    // ── Actions：改變 state 的所有方法 ──────────────────────
    actions: {
        /**
         * addItem：將商品加入購物車
         * @param product - 要加入的商品（ProductItem）
         *
         * 邏輯：
         *   1. 先用 product.id 在 items 裡找有沒有一樣的商品
         *   2. 有 → 數量 +1
         *   3. 沒有 → 把商品推進 items，quantity 設 1
         *   4. 最後同步存到 localStorage
         */
        addItem(product: ProductItem) {
            const existing = this.items.find(item => item.id === product.id)

            if (existing) {
                // 商品已在購物車 → 只增加數量
                existing.quantity++
            } else {
                // 商品不在購物車 → 新增一筆，quantity 初始化為 1
                this.items.push({ ...product, quantity: 1 })
            }

            // 同步寫入 localStorage，讓資料持久化
            saveToStorage(this.items)
        },

        /**
         * removeItem：從購物車移除指定商品（整筆刪除）
         * @param productId - 要移除的商品 id
         */
        removeItem(productId: string) {
            this.items = this.items.filter(item => item.id !== productId)
            saveToStorage(this.items)
        },

        /**
         * updateQuantity：修改某商品的數量
         * @param productId - 目標商品 id
         * @param quantity  - 新的數量
         *
         * 邏輯：
         *   - 若 quantity <= 0，直接呼叫 removeItem 刪掉這筆
         *   - 否則更新 quantity
         */
        updateQuantity(productId: string, quantity: number) {
            if (quantity <= 0) {
                this.removeItem(productId)
                return
            }
            const item = this.items.find(i => i.id === productId)
            if (item) {
                item.quantity = quantity
                saveToStorage(this.items)
            }
        },

        /**
         * clearCart：清空整個購物車
         * （通常在結帳完成後呼叫）
         */
        clearCart() {
            this.items = []
            saveToStorage(this.items)
        },
    },
})
