<template>
    <div class="collections-page">
    <!-- Page Header -->
    <section class="page-header">
      <h1 class="page-title">全部商品</h1>
      <p class="page-subtitle">為毛孩精選的頂級保健配方</p>
    </section>

    <div class="collections-layout">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-inner">
          <h2 class="sidebar-heading">商品分類</h2>

          <!-- 全部 -->
          <button
            class="sidebar-item"
            :class="{ active: selectedTypeId === null }"
            @click="selectedTypeId = null"
          >
            全部商品
            <span class="sidebar-count">{{ productList.length }}</span>
          </button>

          <!-- 各類別 -->
          <button
            v-for="type in productTypes"
            :key="type.id"
            class="sidebar-item"
            :class="{ active: selectedTypeId === type.id }"
            @click="selectedTypeId = type.id"
          >
            {{ type.name }}
            <span class="sidebar-count">{{ type.productID.length }}</span>
          </button>
        </div>
      </aside>

      <!-- Product Grid -->
      <main class="product-area">

        <!-- Result info -->
        <div class="result-info">
          <span>共 <strong>{{ filteredProducts.length }}</strong> 件商品</span>
        </div>

        <!-- Grid -->
        <div class="product-grid">
          <article
            v-for="product in filteredProducts"
            :key="product.id"
            class="product-card"
          >
            <!-- Image -->
            <div class="card-image-wrapper" @click="openDetail(product.id)">
              <img
                :src="product.imageUrl"
                :alt="product.title"
                class="card-image"
              />

              <!-- Hover Overlay -->
              <div class="image-overlay">
                <span class="overlay-text">詳情</span>
              </div>

              <!-- Discount Badge -->
              <div class="discount-badge">
                現省 ${{ product.price.discountAmount }}
              </div>

              <!-- Status Tags -->
              <div v-if="product.statusTags.length" class="status-tags">
                <span
                  v-for="tag in product.statusTags"
                  :key="tag"
                  class="status-tag"
                  :class="tag === '熱銷' ? 'tag-hot' : 'tag-new'"
                >
                  {{ tag }}
                </span>
              </div>
            </div>

            <!-- Card Body -->
            <div class="card-body">
              <!-- Attribute Tags -->
              <div class="attribute-tags">
                <span v-for="tag in product.attributeTags" :key="tag" class="attribute-tag">
                  {{ tag }}
                </span>
              </div>

              <h3 class="card-title">{{ product.title }}</h3>

              <p class="sales-count">{{ product.salesCountText }}</p>

              <div class="price-row">
                <span class="original-price">NT${{ product.price.original.toLocaleString() }}</span>
                <span class="sale-price">NT${{ product.price.sale.toLocaleString() }}</span>
              </div>

              <!-- 點擊加入購物車：@click.stop 阻止冒泡（避免觸發圖片的 openDetail） -->
              <button class="add-to-cart-btn" @click.stop="handleAddToCart(product)">加入購物車</button>
            </div>
          </article>
        </div>

        <!-- Empty state -->
        <div v-if="filteredProducts.length === 0" class="empty-state">
          <p>目前此分類沒有商品</p>
        </div>

      </main>
    </div>
  </div>

  <!-- Product Detail Modal -->
  <CollectionsTsDetail
    :productId="selectedProductId"
    :isOpen="isDetailOpen"
    @close="isDetailOpen = false"
  />

  <!-- ✅ Toast 提示：加入購物車成功訊息 -->
  <!-- v-if 控制顯示；show class 觸發動畫 -->
  <Transition name="toast">
    <div v-if="showToast" class="cart-toast">
      <span class="toast-icon">🛒</span>
      <span>{{ toastMessage }}</span>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProductTypes, useProductList } from '~/composables/collections'
import { useCartStore } from '~/stores/useCartStore' // 引入購物車 store
import type { ProductItem } from '~/types/collections'

// ── 產品資料 ────────────────────────────────────────────────
const productTypes = useProductTypes()
const { productList } = useProductList()

// ── 購物車 Store（Pinia 管理） ───────────────────────────────
// useCartStore() 會回傳 store 實例，裡面有 items、actions 等
const cartStore = useCartStore()

// ── 篩選：依照選擇的分類過濾商品 ────────────────────────────
const selectedTypeId = ref<string | null>(null)

const filteredProducts = computed(() => {
  // selectedTypeId 為 null → 顯示全部商品
  if (selectedTypeId.value === null) return productList
  // 否則過濾出符合分類的商品
  return productList.filter(p => p.typeID === selectedTypeId.value)
})

// ── Detail Modal ──────────────────────────────────────────
const isDetailOpen = ref(false)
const selectedProductId = ref<string | null>(null)
const openDetail = (id: string) => {
  selectedProductId.value = id
  isDetailOpen.value = true
}

// ── Toast 提示 ────────────────────────────────────────────
// showToast：控制 toast 是否顯示
// toastMessage：toast 上顯示的文字
const showToast = ref(false)
const toastMessage = ref('')
let toastTimer: ReturnType<typeof setTimeout> | null = null

/**
 * showCartToast：顯示一則 Toast 提示，2 秒後自動消失
 * @param msg - 要顯示的文字
 */
function showCartToast(msg: string) {
  // 如果上一個 toast 還沒消失，先清掉計時器
  if (toastTimer) clearTimeout(toastTimer)
  toastMessage.value = msg
  showToast.value = true
  // 2 秒後自動隱藏
  toastTimer = setTimeout(() => { showToast.value = false }, 2000)
}

/**
 * handleAddToCart：點擊「加入購物車」按鈕時執行
 * @param product - 被點擊的商品物件
 *
 * 步驟：
 *   1. 呼叫 cartStore.addItem(product) 把商品丟進 store
 *   2. 顯示 Toast 告知使用者「已加入購物車」
 */
function handleAddToCart(product: ProductItem) {
  cartStore.addItem(product)           // 把商品加進購物車 store（也會自動存 localStorage）
  showCartToast(`「${product.title}」已加入購物車 ✓`) // 顯示成功提示
}
</script>

<style scoped>
.topBar {
    background: radial-gradient(circle at top right, #1e1e2f, #111111);
    color: white;
    font-weight: bold;
    box-shadow: 0 4px 20px rgba(139, 92, 246, 0.3);
}
/* ── Page Base ── */
.collections-page {
  min-height: 100vh;
  background: radial-gradient(circle at top right, #1e1e2f, #111111);
  color: #f0f0f0;
  font-family: 'Inter', 'Noto Sans TC', sans-serif;
}

/* ── Page Header ── */
.page-header {
  padding: 60px 40px 32px;
  text-align: center;
  border-bottom: 1px solid rgba(139, 92, 246, 0.15);
}

.page-title {
  font-size: 2.2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #ffffff 0%, #a5b4fc 50%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 8px;
  letter-spacing: 2px;
}

.page-subtitle {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

/* ── Layout ── */
.collections-layout {
  display: flex;
  max-width: 1300px;
  margin: 0 auto;
  padding: 40px 24px 80px;
  gap: 32px;
  align-items: flex-start;
}

/* ── Sidebar ── */
.sidebar {
  width: 220px;
  flex-shrink: 0;
  position: sticky;
  top: 24px;
}

.sidebar-inner {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 16px;
  padding: 20px 16px;
}

.sidebar-heading {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 3px;
  color: rgba(165, 180, 252, 0.7);
  text-transform: uppercase;
  margin: 0 0 16px 4px;
}

.sidebar-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px 14px;
  border-radius: 10px;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.65);
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.25s ease;
  margin-bottom: 4px;
  text-align: left;
}

.sidebar-item:hover {
  background: rgba(139, 92, 246, 0.12);
  color: #fff;
}

.sidebar-item.active {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(139, 92, 246, 0.25));
  color: #c4b5fd;
  border: 1px solid rgba(139, 92, 246, 0.4);
  font-weight: 600;
}

.sidebar-count {
  background: rgba(139, 92, 246, 0.2);
  color: #a5b4fc;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 20px;
  min-width: 24px;
  text-align: center;
}

/* ── Product Area ── */
.product-area {
  flex: 1;
  min-width: 0;
}

.result-info {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.45);
  margin-bottom: 20px;
}

.result-info strong {
  color: #a5b4fc;
}

/* ── Grid ── */
.product-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

@media (max-width: 960px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .sidebar {
    width: 180px;
  }
}

@media (max-width: 640px) {
  .collections-layout {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
    position: static;
  }
  .sidebar-inner {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 14px;
  }
  .sidebar-heading { width: 100%; }
  .sidebar-item { width: auto; }
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }
}

/* ── Product Card ── */
.product-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(139, 92, 246, 0.15);
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-6px);
  border-color: rgba(139, 92, 246, 0.5);
  box-shadow: 0 16px 48px rgba(139, 92, 246, 0.2);
}

/* ── Card Image ── */
.card-image-wrapper {
  position: relative;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
  display: block;
}

.product-card:hover .card-image {
  transform: scale(1.06);
}

/* Image Hover Overlay */
.image-overlay {
  position: absolute;
  inset: 0;
  /* background: rgba(30, 10, 60, 0.55?; */
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.35s ease;
  z-index: 5;
}

.product-card:hover .image-overlay {
  opacity: 1;
}

.overlay-text {
  color: #fff;
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 4px;
  border: 2px solid rgba(255, 255, 255, 0.7);
  padding: 10px 28px;
  border-radius: 30px;
  background: rgba(30, 10, 60, 0.65);
  backdrop-filter: blur(4px);
  transform: translateY(8px);
  transition: transform 0.35s ease;
}

.product-card:hover .overlay-text {
  transform: translateY(0);
}

/* Discount Badge */
.discount-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  background: linear-gradient(135deg, #e85d4a, #c9392a);
  color: #fff;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 6px 14px;
  border-top-left-radius: 12px;
  letter-spacing: 0.5px;
}

/* Status Tags (熱銷 / 新品) */
.status-tags {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.status-tag {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
  letter-spacing: 1px;
}

.tag-hot {
  background: rgba(239, 68, 68, 0.85);
  color: #fff;
}

.tag-new {
  background: rgba(99, 102, 241, 0.85);
  color: #fff;
}

/* ── Card Body ── */
.card-body {
  padding: 16px 18px 20px;
}

.attribute-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
}

.attribute-tag {
  font-size: 0.7rem;
  color: #a5b4fc;
  background: rgba(99, 102, 241, 0.12);
  border: 1px solid rgba(99, 102, 241, 0.3);
  padding: 2px 9px;
  border-radius: 20px;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.attribute-tag:hover {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-color: transparent;
  color: #fff;
  box-shadow: 0 4px 14px rgba(139, 92, 246, 0.4);
}

.card-title {
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 8px;
  line-height: 1.4;
}

.sales-count {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.4);
  margin: 0 0 12px;
}

.price-row {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  margin-bottom: 16px;
}

.sale-price {
  font-size: 1.2rem;
  font-weight: 800;
  color: #f97316;
}

.original-price {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.35);
  text-decoration: line-through;
}

/* Add to Cart Button */
.add-to-cart-btn {
  width: 100%;
  padding: 10px 0;
  border: 1px solid rgba(139, 92, 246, 0.4);
  border-radius: 10px;
  background: transparent;
  color: #c4b5fd;
  font-size: 0.88rem;
  font-weight: 600;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.add-to-cart-btn:hover{
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-color: transparent;
  color: #fff;
  box-shadow: 0 6px 24px rgba(139, 92, 246, 0.4);
}
.overlay-text:hover {
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    border-color: transparent;
    color: #fff;
    box-shadow: 0 6px 24px rgba(139, 92, 246, 0.4);
    border: 2px solid rgba(255, 255, 255, 0.7);
}

/* ── Empty State ── */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: rgba(255, 255, 255, 0.3);
  font-size: 1.1rem;
}

/* ── Cart Toast 提示訊息 ── */
.cart-toast {
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
  font-size: 0.95rem;
  font-weight: 600;
  padding: 14px 28px;
  border-radius: 50px;
  border: 2px solid rgba(255, 255, 255, 0.8); /* 加入白邊 */
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 8px 32px rgba(139, 92, 246, 0.5);
  z-index: 9999;
  white-space: nowrap;
  letter-spacing: 0.5px;
}

.toast-icon {
  font-size: 1.2rem;
}

/* Toast 進入 / 離開動畫（Transition name="toast"） */
.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translate(-50%, 20px); /* 從下方滑入 */
}

.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 20px); /* 向下滑出 */
}
</style>