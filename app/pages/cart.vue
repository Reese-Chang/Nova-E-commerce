<template>
  <div class="cart-page">
    <div v-if="isLoading" class="loadingBg">
      <v-progress-circular  indeterminate></v-progress-circular> <br>
      <div>下單中，請稍後...</div>
    </div>
    
    <!-- ── 頁頭 ── -->
    <section class="page-header">
      <h1 class="page-title">購物車</h1>
      <p class="page-subtitle">確認您的選購商品</p>
    </section>

    <div class="cart-layout">

      <!-- ═══════════════════════════════════════════════════
           情況一：購物車是空的
           顯示空狀態提示，並提供「去逛逛」按鈕
           ═══════════════════════════════════════════════════ -->
      <div v-if="cartStore.isEmpty" class="empty-cart">
        <div class="empty-icon">🛒</div>
        <h2 class="empty-title">購物車是空的</h2>
        <p class="empty-desc">快去選購你喜歡的商品吧！</p>
        <!-- NuxtLink 跳轉到商品頁 -->
        <NuxtLink to="/collections" class="browse-btn">去逛逛商品</NuxtLink>
      </div>

      <!-- ═══════════════════════════════════════════════════
           情況二：購物車有商品
           分左欄（品項列表）與右欄（金額摘要＋結帳按鈕）
           ═══════════════════════════════════════════════════ -->
      <template v-else>
        <div class="cart-content">

          <!-- ── 左欄：品項列表 ── -->
          <div class="cart-items">
            <!-- 標題列 -->
            <div class="items-header">
              <span>共 <strong>{{ cartStore.totalCount }}</strong> 件商品</span>
              <!-- 清空購物車按鈕 -->
              <button class="clear-btn" @click="confirmClear">清空購物車</button>
            </div>

            <!-- 用 v-for 渲染每一個購物車品項 -->
            <div
              v-for="item in cartStore.items"
              :key="item.id"
              class="cart-item"
            >
              <!-- 紅框區：商品圖片與資訊 -->
              <div class="cart-item-left">
                <!-- 商品圖片 -->
                <img :src="item.imageUrl" :alt="item.title" class="item-image" />

                <!-- 商品資訊 -->
                <div class="item-info">
                  <!-- 商品名稱 -->
                  <h3 class="item-title">{{ item.title }}</h3>

                  <!-- 屬性標籤（狗狗、貓咪、腸胃敏感…等） -->
                  <div class="item-tags">
                    <span
                      v-for="tag in item.attributeTags"
                      :key="tag"
                      class="attr-tag"
                    >{{ tag }}</span>
                  </div>

                  <!-- 單價 -->
                  <p class="item-unit-price">單價：NT${{ item.price.sale.toLocaleString() }}</p>
                </div>
              </div>

              <!-- 黃框區：數量、價格與刪除 -->
              <div class="cart-item-right">
                <!-- 數量調整區 -->
                <div class="item-qty">
                  <!-- 數量減一 -->
                  <button
                    class="qty-btn"
                    @click="cartStore.updateQuantity(item.id, item.quantity - 1)"
                    :disabled="item.quantity <= 1"
                  >－</button>

                  <!-- 目前數量 -->
                  <span class="qty-num">{{ item.quantity }}</span>

                  <!-- 數量加一 -->
                  <button
                    class="qty-btn"
                    @click="cartStore.updateQuantity(item.id, item.quantity + 1)"
                  >＋</button>
                </div>

                <!-- 小計（單價 × 數量） -->
                <div class="item-subtotal">
                  NT${{ (item.price.sale * item.quantity).toLocaleString() }}
                </div>

                <!-- 刪除此商品 -->
                <button
                  class="remove-btn"
                  @click="cartStore.removeItem(item.id)"
                  title="移除商品"
                >✕</button>
              </div>
            </div>
          </div>

          <!-- ── 右欄：金額摘要 ＋ 結帳按鈕 ── -->
          <div class="cart-summary">
            <h2 class="summary-title">訂單摘要</h2>

            <!-- 各品項小計列表 -->
            <div class="summary-lines">
              <div
                v-for="item in cartStore.items"
                :key="item.id"
                class="summary-line"
              >
                <!-- 商品名稱（只取前12字，超過加…） -->
                <span class="summary-name">
                  {{ item.title.length > 12 ? item.title.slice(0, 12) + '…' : item.title }}
                  × {{ item.quantity }}
                </span>
                <span>NT${{ (item.price.sale * item.quantity).toLocaleString() }}</span>
              </div>
            </div>

            <div class="summary-divider"></div>

            <!-- 總計金額 -->
            <div class="summary-total">
              <span>合計</span>
              <span class="total-price">NT${{ cartStore.totalPrice.toLocaleString() }}</span>
            </div>

            <!-- ═══════════════════════════════════════════
                 結帳區域：依登入狀態顯示不同 UI

                 ► 已登入：顯示綠色「立即結帳」按鈕
                 ► 未登入：顯示提示文字 + 「前往登入」按鈕
                 ═══════════════════════════════════════════ -->

            <!-- 已登入 ✅ -->
            <template v-if="authStore.isLoggedIn">
              <!-- 顯示目前登入的使用者名稱 -->
              <p class="logged-in-user">
                👤 {{ authStore.userDisplayName }}，您好！
              </p>
              <button class="checkout-btn" @click="handleCheckout">
                立即結帳
              </button>
            </template>

            <!-- 未登入 ❌ -->
            <template v-else>
              <!-- 提示訊息：說明需要登入才能結帳 -->
              <div class="login-notice">
                <span class="notice-icon">🔒</span>
                <p>需要登入才能結帳</p>
              </div>
              <!-- 前往登入頁的按鈕 -->
              <NuxtLink to="/login" class="login-btn">
                前往登入
              </NuxtLink>
              <!-- 或繼續逛逛 -->
              <NuxtLink to="/collections" class="continue-btn">
                繼續選購
              </NuxtLink>
            </template>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/useCartStore'   // 購物車 Store
import { useAuthStore } from '~/stores/useAuthStore'   // 登入狀態 Store

// loading
const isLoading = ref(false)
// ── 宣告 TapPay SDK 全域變數 ──────────────────────────────
declare const TPDirect: any

// ── TapPay 設定（⚠️ 請替換為你自己的值）──────────────────
const TAPPAY_APP_ID = 168019           // ← 換成你的 APP_ID
const TAPPAY_APP_KEY = 'app_VwIddaIaOzao8R2PjdQNknz6POnnnrTfocT6m36NOSaMMtSN9IBAXHSOJk3r' // ← 換成你的 APP_KEY
const TAPPAY_ENV = 'sandbox'          // 'sandbox' 或 'production'

// ── 載入 TapPay SDK ───────────────────────────────────────
useHead({
  script: [
    { src: 'https://js.tappaysdk.com/sdk/tpdirect/v5.14.0', defer: true }
  ]
})

// ── 取得 Pinia store 實例 ─────────────────────────────────
const cartStore = useCartStore()
const authStore = useAuthStore()

// ── 是否正在結帳中（防止重複點擊）──────────────────────────
const isCheckingOut = ref(false)

// ── 頁面初始化 ────────────────────────────────────────────
onMounted(() => {
  authStore.init()

  // 等待 TapPay SDK 載入完成後初始化
  const waitForSDK = setInterval(() => {
    if (typeof TPDirect !== 'undefined') {
      clearInterval(waitForSDK)
      TPDirect.setupSDK(TAPPAY_APP_ID, TAPPAY_APP_KEY, TAPPAY_ENV)
      console.log('✅ TapPay SDK 初始化完成')
    }
  }, 100)
})

// ── 清空購物車（帶確認提示）──────────────────────────────
function confirmClear() {
  if (window.confirm('確定要清空購物車嗎？')) {
    cartStore.clearCart()
  }
}

// ── 結帳：TapPay LINE Pay ────────────────────────────────
/**
 * handleCheckout：
 * 1. 呼叫 TPDirect.linePay.getPrime() 取得 prime
 * 2. 將 prime 傳送至後端 /api/pay
 * 3. 後端回傳 payment_url 後，導向 LINE Pay 付款頁面
 */
async function handleCheckout() {
  console.log("229",isCheckingOut);
  
  if (isCheckingOut.value) return
  isCheckingOut.value = true

  try {
    isLoading.value = true
    // 確認 SDK 已載入
    if (typeof TPDirect === 'undefined') {
      alert('金流 SDK 尚未載入完成，請稍後再試')
      isLoading.value = false
      isCheckingOut.value = false
      return
    }

    // Step 1: 取得 LINE Pay prime
    TPDirect.linePay.getPrime(async (result: any) => {
      console.log("224",result);
      
      if (result.status !== 0) {
        alert('取得 LINE Pay 付款資訊失敗：' + result.msg)
        isLoading.value = false
        isCheckingOut.value = false
        return
      }

      console.log('✅ 取得 prime:', result.prime)

      try {
        console.log("255");
        
        // Step 2: 將 prime 送至後端
        const payResult: any = await $fetch('/api/pay', {
          method: 'POST',
          body: {
            prime: result.prime,
            amount: cartStore.totalPrice,
            details: `Nova Pet 寵物商品 x${cartStore.totalCount}`,
          }
        })
        
        // Step 3: 導向 LINE Pay 付款頁面
        if (payResult.payment_url) {
          TPDirect.redirect(payResult.payment_url)
          isLoading.value = false
        } else {
          isLoading.value = false
          alert('無法取得付款頁面連結，請稍後再試')
        }
      } catch (err: any) {
        console.error('付款 API 錯誤:', err)
        console.log("287",err.data.message);
        
        isLoading.value = false
        alert('結帳失敗：' + (err?.data?.message || err.message || '未知錯誤'))
      } finally {
        isCheckingOut.value = false
        isLoading.value = false
      }
    })
  } catch (err) {
    isLoading.value = false
    console.error('結帳流程錯誤:', err)
    isCheckingOut.value = false
  }
}
</script>

<style scoped>
.loadingBg {
  background-color: rgba(128, 128, 128, 0.8);
  position: absolute;
  width: 100vw;
  min-height: 100vh;
  height: 100%;
  z-index: 10000;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0px;
  flex-direction: column;
}
/* ── Page Base ── */
.cart-page {
  min-height: 100vh;
  background: radial-gradient(circle at top right, #1e1e2f, #111111);
  color: #f0f0f0;
  font-family: 'Inter', 'Noto Sans TC', sans-serif;
  overflow-x: hidden; /* ✅ 防止水平溢出 */
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
.cart-layout {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px 80px;
}

/* ── 空白狀態 ── */
.empty-cart {
  text-align: center;
  padding: 100px 20px;
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 20px;
  opacity: 0.6;
}

.empty-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 12px;
}

.empty-desc {
  color: rgba(255, 255, 255, 0.4);
  margin: 0 0 32px;
}

.browse-btn {
  display: inline-block;
  padding: 14px 40px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1rem;
  text-decoration: none;
  box-shadow: 0 8px 32px rgba(139, 92, 246, 0.4);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.browse-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(139, 92, 246, 0.6);
}

/* ── Cart Content（左右佈局）── */
.cart-content {
  display: flex;
  gap: 32px;
  align-items: flex-start;
}

/* ── 左欄：品項列表 ── */
.cart-items {
  flex: 1;
  min-width: 0;
}

.items-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.95rem;
}

.items-header strong {
  color: #a5b4fc;
}

.clear-btn {
  background: transparent;
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: rgba(239, 68, 68, 0.8);
  font-size: 0.82rem;
  padding: 5px 14px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.8);
  color: #ef4444;
}

/* ── 每一個購物車品項（結構：左右分群）── */
.cart-item {
  display: flex;
  justify-content: space-between; /* 桌機預設：左右分開 */
  align-items: center;
  gap: 20px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(139, 92, 246, 0.15);
  border-radius: 16px;
  padding: 16px 20px;
  margin-bottom: 16px;
  transition: border-color 0.25s ease;
}

.cart-item:hover {
  border-color: rgba(139, 92, 246, 0.35);
}

/* ── 左側區塊：商品圖片與資訊 ── */
.cart-item-left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  min-width: 0;
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 10px;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.05);
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 6px;
}

.item-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 6px;
}

.attr-tag {
  font-size: 0.68rem;
  color: #a5b4fc;
  background: rgba(99, 102, 241, 0.12);
  border: 1px solid rgba(99, 102, 241, 0.25);
  padding: 1px 7px;
  border-radius: 20px;
}

.item-unit-price {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.4);
  margin: 0;
}

/* ── 右側區塊：數量、價格與刪除 ── */
.cart-item-right {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

/* 數量調整 */
.item-qty {
  display: flex;
  align-items: center;
  gap: 10px;
}

.qty-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid rgba(139, 92, 246, 0.35);
  background: transparent;
  color: #c4b5fd;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qty-btn:hover:not(:disabled) {
  background: rgba(139, 92, 246, 0.2);
  border-color: rgba(139, 92, 246, 0.7);
}

.qty-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.qty-num {
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  min-width: 24px;
  text-align: center;
}

/* 小計 */
.item-subtotal {
  min-width: 100px;
  font-size: 1.05rem;
  font-weight: 700;
  color: #f97316;
  text-align: right;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

/* 刪除按鈕 */
.remove-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.3);
  font-size: 0.85rem;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn:hover {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

/* ── 右欄：訂單摘要 ── */
.cart-summary {
  width: 320px;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 20px;
  padding: 28px 24px;
  position: sticky;
  top: 24px;
}

.summary-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: rgba(165, 180, 252, 0.9);
  margin: 0 0 20px;
  letter-spacing: 1px;
}

/* 各品項小計 */
.summary-lines {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.55);
}

.summary-name {
  max-width: 170px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.summary-divider {
  height: 1px;
  background: rgba(139, 92, 246, 0.2);
  margin: 12px 0 20px;
}

/* 合計 */
.summary-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  font-size: 1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
}

.total-price {
  font-size: 1.4rem;
  font-weight: 800;
  color: #f97316;
}

/* ── 已登入狀態的使用者名稱 ── */
.logged-in-user {
  font-size: 0.85rem;
  color: rgba(165, 180, 252, 0.7);
  margin: 0 0 12px;
  text-align: center;
}

/* ── 結帳按鈕（已登入）── */
.checkout-btn {
  width: 100%;
  padding: 14px 0;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border: none;
  border-radius: 12px;
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;
  box-shadow: 0 6px 24px rgba(139, 92, 246, 0.4);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.checkout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 32px rgba(139, 92, 246, 0.6);
}

/* ── 未登入：提示區 ── */
.login-notice {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 10px;
  padding: 12px 16px;
  margin-bottom: 16px;
  color: rgba(255, 200, 200, 0.8);
  font-size: 0.88rem;
}

.notice-icon {
  font-size: 1.1rem;
}

.login-notice p {
  margin: 0;
}

/* ── 前往登入按鈕（未登入主要 CTA）── */
.login-btn {
  display: block;
  width: 100%;
  padding: 14px 0;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 12px;
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  text-align: center;
  text-decoration: none;
  margin-bottom: 10px;
  box-shadow: 0 6px 24px rgba(139, 92, 246, 0.4);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 32px rgba(139, 92, 246, 0.6);
}

/* ── 繼續選購（次要按鈕）── */
.continue-btn {
  display: block;
  width: 100%;
  padding: 12px 0;
  border: 1px solid rgba(139, 92, 246, 0.35);
  border-radius: 12px;
  color: #c4b5fd;
  font-size: 0.9rem;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  transition: all 0.2s ease;
}

.continue-btn:hover {
  background: rgba(139, 92, 246, 0.12);
  border-color: rgba(139, 92, 246, 0.7);
}

/* ══════════════════════════════════════════════
   響應式：手機版（768px 以下）
   ══════════════════════════════════════════════ */
@media (max-width: 768px) {
  /* 1. 頁頭 padding 縮小 */
  .page-header {
    padding: 40px 20px 24px;
  }

  .page-title {
    font-size: 1.8rem;
  }

  /* 2. 整體內距縮小 */
  .cart-layout {
    padding: 24px 16px 60px;
  }

  /* 3. 左右欄改成上下堆疊，並且讓它們撐滿寬度 */
  .cart-content {
    flex-direction: column;
    align-items: stretch;
    gap: 24px;
  }

  /* 4. 訂單摘要欄全寬、取消 sticky */
  .cart-summary {
    width: 100%;
    position: static;
    padding: 20px 16px;
  }

  /* 品項卡：手機版改成上下堆疊 */
  .cart-item {
    flex-direction: column;
    align-items: stretch;
    padding: 16px;
    gap: 16px;
  }

  /* 調整左側圖片與資訊區 */
  .cart-item-left {
    align-items: flex-start; /* 名字較長時，圖片對齊頂部 */
  }

  /* 手機版圖片稍微縮小 */
  .item-image {
    width: 72px;
    height: 72px;
  }

  /* 調整右側操作區：置底橫向展開 */
  .cart-item-right {
    justify-content: space-between; /* 讓數量靠左、價格/刪除靠右 */
    width: 100%; /* 不再退縮 88px，改用全部寬度以防止小螢幕被切到 */
    gap: 12px;
  }

  .item-subtotal {
    flex: 1; /* 讓價格區域填滿中間剩餘空間 */
    font-size: 0.95rem;
  }

  .remove-btn {
    width: 32px;
    height: 32px;
    font-size: 1rem;
  }

  /* 11. summary 合計金額字體縮小 */
  .total-price {
    font-size: 1.2rem;
  }

  /* 12. summary-name 允許換行 */
  .summary-name {
    max-width: unset;
    white-space: normal;
  }
}
</style>
