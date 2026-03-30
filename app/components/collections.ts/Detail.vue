<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-backdrop" @click.self="close">
        <div class="modal-panel">
          <!-- ✅ 返回按鈕 -->
          <button class="back-btn" @click="close">
            <span class="back-arrow">←</span> 返回產品列表
          </button>

          <div v-if="item && detail" class="detail-content">
            <!-- ① Left: Gallery -->
            <aside class="gallery-col">
              <div class="main-img-wrapper">
                <img :src="activeImg" :alt="item.title" class="main-img" />
              </div>
              <div class="thumb-list">
                <button
                  v-for="(img, i) in detail.galleryImgs"
                  :key="i"
                  class="thumb-btn"
                  :class="{ active: activeImgIdx === i }"
                  @click="activeImgIdx = i"
                >
                  <img :src="img" :alt="`圖 ${i + 1}`" class="thumb-img" />
                </button>
              </div>
            </aside>

            <!-- ② Right: Info + Tabs -->
            <div class="info-col">

              <!-- Status & Attribute Tags -->
              <div class="tag-row">
                <span
                  v-for="tag in item.statusTags" :key="tag"
                  class="status-tag" :class="tag === '熱銷' ? 'tag-hot' : 'tag-new'"
                >{{ tag }}</span>
                <span v-for="tag in item.attributeTags" :key="tag" class="attr-tag">{{ tag }}</span>
              </div>

              <!-- Title & Copy -->
              <h2 class="prod-title">{{ item.title }}</h2>
              <p class="marketing-copy">{{ detail.marketingCopy }}</p>
              <p class="prod-desc">{{ detail.description }}</p>

              <!-- Price -->
              <div class="price-block">
                <span class="sale-price">NT${{ item.price.sale.toLocaleString() }}</span>
                <span class="original-price">NT${{ item.price.original.toLocaleString() }}</span>
                <span class="discount-chip">現省 ${{ item.price.discountAmount }}</span>
              </div>

              <p class="sales-count">{{ item.salesCountText }}</p>

              <!-- CTA -->
              <button class="cart-btn" @click="handleAddToCart">加入購物車</button>

              <!-- ③ Info Tabs -->
              <div class="tabs">
                <button
                  v-for="tab in tabs" :key="tab.key"
                  class="tab-btn"
                  :class="{ active: activeTab === tab.key }"
                  @click="activeTab = tab.key"
                >{{ tab.label }}</button>
              </div>

              <!-- Tab Content -->
              <div class="tab-content">

                <!-- 介紹 -->
                <div v-if="activeTab === 'introduce'" class="img-gallery">
                  <img
                    v-for="(url, i) in detail.info.introduce" :key="i"
                    :src="url" alt="產品介紹" class="info-img"
                  />
                </div>

                <!-- 規格 -->
                <div v-else-if="activeTab === 'spec'">
                  <table class="spec-table">
                    <tbody>
                      <tr
                        v-for="s in sortedSpec" :key="s.index"
                        class="spec-row"
                      >
                        <td class="spec-title">{{ s.title }}</td>
                        <td class="spec-content">{{ s.content }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- 常見問題 -->
                <div v-else-if="activeTab === 'question'" class="faq-list">
                  <div
                    v-for="faq in sortedFaq" :key="faq.id"
                    class="faq-item"
                    :class="{ open: openFaqId === faq.id }"
                  >
                    <button class="faq-question" @click="toggleFaq(faq.id)">
                      <span>{{ faq.question }}</span>
                      <span class="faq-arrow">{{ openFaqId === faq.id ? '▲' : '▼' }}</span>
                    </button>
                    <div class="faq-answer" v-show="openFaqId === faq.id">
                      <div class="faq-answer-inner" v-html="faq.answer" />
                    </div>
                  </div>
                </div>

                <!-- 顧客好評 -->
                <div v-else-if="activeTab === 'review'" class="img-gallery">
                  <template v-if="detail.info.review.length">
                    <img
                      v-for="(url, i) in detail.info.review" :key="i"
                      :src="url" alt="顧客好評" class="info-img"
                    />
                  </template>
                  <p v-else class="empty-tip">目前尚無顧客好評</p>
                </div>

              </div>
            </div>
          </div>

          <!-- Loading / not found -->
          <div v-else class="not-found">找不到商品資料</div>
        </div>
      </div>
    </Transition>

    <!-- ✅ Toast 提示：加入購物車成功訊息 -->
    <!-- 放在 Teleport 內，確保在最上層 -->
    <Transition name="toast">
      <div v-if="showToast" class="cart-toast">
        <span class="toast-icon">🛒</span>
        <span>{{ toastMessage }}</span>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useProductList, useProductDetails } from '~/composables/collections'
import { useCartStore } from '~/stores/useCartStore'

const props = defineProps<{
  productId: string | null
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { productList } = useProductList()
const allDetails = useProductDetails()
const cartStore = useCartStore()

// ── Toast 提示 ────────────────────────────────────────────
const showToast = ref(false)
const toastMessage = ref('')
let toastTimer: ReturnType<typeof setTimeout> | null = null

function showCartToast(msg: string) {
  if (toastTimer) clearTimeout(toastTimer)
  toastMessage.value = msg
  showToast.value = true
  toastTimer = setTimeout(() => { showToast.value = false }, 2000)
}

const handleAddToCart = () => {
  if (item.value) {
    cartStore.addItem(item.value)
    showCartToast(`「${item.value.title}」已加入購物車 ✓`)
  }
}

const item = computed(() => productList.find(p => p.id === props.productId) ?? null)
const detail = computed(() => allDetails.find(d => d.id === props.productId) ?? null)

// Gallery
const activeImgIdx = ref(0)
const activeImg = computed(() => detail.value?.galleryImgs[activeImgIdx.value] ?? '')
watch(() => props.productId, () => { activeImgIdx.value = 0 })

// Tabs
const tabs = [
  { key: 'introduce', label: '產品介紹' },
  { key: 'spec',      label: '產品規格' },
  { key: 'question',  label: '常見問題' },
  { key: 'review',    label: '顧客好評' },
] as const
type TabKey = typeof tabs[number]['key']
const activeTab = ref<TabKey>('introduce')
watch(() => props.productId, () => { activeTab.value = 'introduce' })

// Sorted spec & faq
const sortedSpec = computed(() =>
  [...(detail.value?.info.spec ?? [])].sort((a, b) => a.index - b.index)
)
const sortedFaq = computed(() =>
  [...(detail.value?.info.question ?? [])].sort((a, b) => a.index - b.index)
)

// FAQ accordion
const openFaqId = ref<string | null>(null)
const toggleFaq = (id: string) => {
  openFaqId.value = openFaqId.value === id ? null : id
}

// Close
const close = () => emit('close')

// ESC key — only run on client, after mount
const onKeydown = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }

watch(() => props.isOpen, (val) => {
  if (typeof window === 'undefined') return
  if (val) {
    window.addEventListener('keydown', onKeydown)
    document.body.style.overflow = 'hidden'
  } else {
    window.removeEventListener('keydown', onKeydown)
    document.body.style.overflow = ''
  }
})

onUnmounted(() => {
  if (typeof window === 'undefined') return
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* ── Backdrop ── */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(6px);
  z-index: 1000;
  display: flex;
  align-items: stretch;
  justify-content: center;
  overflow: hidden;
}

/* ── Panel ── */
.modal-panel {
  position: relative;
  width: 100%;
  max-width: 100vw;
  height: 100dvh;
  background: radial-gradient(circle at top right, #1e1e2f, #0e0e1a);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

/* ── 返回按鈕 ── */
.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #f0f0f0;
  font-size: 0.95rem;
  font-weight: 500;
  padding: 10px 16px;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10;
  width: fit-content;
  margin: 80px 20px 10px;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(139, 92, 246, 0.5);
  color: #fff;
  transform: translateX(-4px); /* Hover時會有一個退後的小動效 */
}

.back-arrow {
  font-size: 1.1rem;
  line-height: 1;
}

/* ── Detail Content Layout ── */
.detail-content {
  display: flex;
  gap: 48px;
  padding: 0px 48px 60px; /* 上方預留 80px 給返回按鈕 */
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

/* ── Gallery Col ── */
.gallery-col {
  width: 420px;
  flex-shrink: 0;
  position: sticky;
  top: 20px;
  align-self: flex-start;
}

.main-img-wrapper {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 16px;
  overflow: hidden;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(139,92,246,0.2);
  margin-bottom: 12px;
}
.main-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb-list {
  display: flex;
  gap: 10px;
}
.thumb-btn {
  width: 72px;
  height: 72px;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
  background: rgba(255,255,255,0.04);
  transition: border-color 0.2s;
  padding: 0;
}
.thumb-btn.active { border-color: #8b5cf6; }
.thumb-img { width: 100%; height: 100%; object-fit: cover; display: block; }

/* ── Info Col ── */
.info-col {
  flex: 1;
  min-width: 0;
  color: #f0f0f0;
}

/* Tags */
.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}
.status-tag {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
  letter-spacing: 1px;
}
.tag-hot { background: rgba(239,68,68,0.85); color: #fff; }
.tag-new { background: rgba(99,102,241,0.85); color: #fff; }
.attr-tag {
  font-size: 0.72rem;
  color: #a5b4fc;
  background: rgba(99,102,241,0.12);
  border: 1px solid rgba(99,102,241,0.3);
  padding: 3px 10px;
  border-radius: 20px;
}

/* Title */
.prod-title {
  font-size: 1.8rem;
  font-weight: 800;
  margin: 0 0 10px;
  background: linear-gradient(135deg, #fff 0%, #a5b4fc 60%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.marketing-copy {
  font-size: 0.95rem;
  color: #f97316;
  font-weight: 600;
  margin: 0 0 12px;
}
.prod-desc {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.6);
  line-height: 1.8;
  margin: 0 0 20px;
}

/* Price */
.price-block {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;
}
.sale-price {
  font-size: 1.6rem;
  font-weight: 800;
  color: #f97316;
}
.original-price {
  font-size: 0.95rem;
  color: rgba(255,255,255,0.35);
  text-decoration: line-through;
}
.discount-chip {
  background: linear-gradient(135deg, #e85d4a, #c9392a);
  color: #fff;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 3px 12px;
  border-radius: 20px;
}
.sales-count {
  font-size: 0.82rem;
  color: rgba(255,255,255,0.4);
  margin: 0 0 20px;
}

/* CTA */
.cart-btn {
  width: 100%;
  padding: 14px 0;
  border: 1px solid rgba(139,92,246,0.4);
  border-radius: 12px;
  background: transparent;
  color: #c4b5fd;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.25s ease;
  margin-bottom: 32px;
}
.cart-btn:hover {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-color: transparent;
  color: #fff;
  box-shadow: 0 8px 28px rgba(139,92,246,0.4);
}

/* ── Tabs ── */
.tabs {
  display: flex;
  gap: 4px;
  border-bottom: 1px solid rgba(139,92,246,0.2);
  margin-bottom: 24px;
}
.tab-btn {
  padding: 10px 18px;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: rgba(255,255,255,0.5);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: -1px;
  white-space: nowrap;
}
.tab-btn:hover { color: #fff; }
.tab-btn.active {
  color: #a5b4fc;
  border-bottom-color: #8b5cf6;
  font-weight: 600;
}

/* ── Tab Content ── */
.tab-content { min-height: 200px; }

/* 圖片陳列 */
.img-gallery {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.info-img {
  width: 100%;
  border-radius: 12px;
  display: block;
}

/* 規格表 */
.spec-table { width: 100%; border-collapse: collapse; }
.spec-row { border-bottom: 1px solid rgba(139,92,246,0.1); }
.spec-row:last-child { border-bottom: none; }
.spec-title {
  padding: 12px 16px 12px 0;
  font-size: 0.88rem;
  color: rgba(255,255,255,0.5);
  width: 120px;
  vertical-align: top;
}
.spec-content {
  padding: 12px 0;
  font-size: 0.92rem;
  color: #f0f0f0;
  font-weight: 500;
}

/* FAQ */
.faq-list { display: flex; flex-direction: column; gap: 8px; }
.faq-item {
  border: 1px solid rgba(139,92,246,0.2);
  border-radius: 12px;
  overflow: hidden;
  transition: border-color 0.25s;
}
.faq-item.open { border-color: rgba(139,92,246,0.5); }
.faq-question {
  width: 100%;
  padding: 14px 18px;
  background: rgba(255,255,255,0.03);
  border: none;
  color: #f0f0f0;
  font-size: 0.92rem;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  transition: background 0.2s;
}
.faq-question:hover { background: rgba(139,92,246,0.1); }
.faq-arrow { color: #8b5cf6; font-size: 0.7rem; flex-shrink: 0; }
.faq-answer {
  background: rgba(0,0,0,0.2);
  overflow: hidden;
}
.faq-answer-inner {
  padding: 14px 18px;
  font-size: 0.88rem;
  color: rgba(255,255,255,0.65);
  line-height: 1.8;
}

.empty-tip {
  color: rgba(255,255,255,0.3);
  font-size: 0.9rem;
  text-align: center;
  padding: 40px 0;
}
.not-found {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,0.3);
}

/* ── Transition ── */
.modal-enter-active,
.modal-leave-active { transition: opacity 0.3s ease; }
.modal-enter-from,
.modal-leave-to { opacity: 0; }
.modal-enter-active .modal-panel,
.modal-leave-active .modal-panel { transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-enter-from .modal-panel { transform: translateY(40px); }
.modal-leave-to .modal-panel { transform: translateY(20px); }

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
  border: 2px solid rgba(255, 255, 255, 0.8);
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

/* Toast 進入 / 離開動畫 */
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

/* ── Responsive ── */
@media (max-width: 900px) {
  .detail-content {
    flex-direction: column;
    padding: 0px 20px 80px; /* 手機版一樣預留空間 */
    gap: 28px;
  }
  .gallery-col {
    width: 100%;
    position: static;
  }
  .back-btn {
    left: 20px; /* 手機版左側邊距對齊內容 */
    top: 20px;
  }
}
</style>
