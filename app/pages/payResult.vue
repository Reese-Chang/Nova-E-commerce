<template>
  <div class="pay-result-page">
    <section class="result-card">
      <!-- 成功 -->
      <template v-if="isSuccess">
        <div class="result-icon success-icon">✓</div>
        <h1 class="result-title">付款成功！</h1>
        <p class="result-desc">感謝您的購買，我們將盡快為您出貨。</p>
        <div class="result-details" v-if="recTradeId">
          <p>交易編號：<strong>{{ recTradeId }}</strong></p>
        </div>
      </template>

      <!-- 失敗 -->
      <template v-else>
        <div class="result-icon fail-icon">✕</div>
        <h1 class="result-title">付款失敗</h1>
        <p class="result-desc">很抱歉，付款未能完成。請稍後再試或選擇其他付款方式。</p>
        <div class="result-details" v-if="errorMsg">
          <p>錯誤訊息：{{ errorMsg }}</p>
        </div>
      </template>

      <!-- 按鈕 -->
      <div class="result-actions">
        <NuxtLink to="/collections" class="action-btn primary-btn">繼續選購</NuxtLink>
        <NuxtLink to="/cart" class="action-btn secondary-btn">回到購物車</NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/useCartStore'

const route = useRoute()
const cartStore = useCartStore()

// 從 URL query 取得付款結果
const recTradeId = computed(() => (route.query.rec_trade_id as string) || '')
const status = computed(() => route.query.status as string)
const errorMsg = computed(() => (route.query.msg as string) || '')

// 判斷是否成功（TapPay status === '0' 代表成功）
const isSuccess = computed(() => status.value === '0')

// 付款成功時清空購物車
onMounted(() => {
  if (isSuccess.value) {
    cartStore.clearCart()
  }
})
</script>

<style scoped>
.pay-result-page {
  min-height: 100vh;
  background: radial-gradient(circle at top right, #1e1e2f, #111111);
  color: #f0f0f0;
  font-family: 'Inter', 'Noto Sans TC', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.result-card {
  text-align: center;
  max-width: 480px;
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 24px;
  padding: 48px 32px;
}

/* ── 結果圖示 ── */
.result-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 auto 24px;
}

.success-icon {
  background: rgba(34, 197, 94, 0.15);
  border: 2px solid rgba(34, 197, 94, 0.5);
  color: #22c55e;
}

.fail-icon {
  background: rgba(239, 68, 68, 0.15);
  border: 2px solid rgba(239, 68, 68, 0.5);
  color: #ef4444;
}

/* ── 標題與描述 ── */
.result-title {
  font-size: 1.8rem;
  font-weight: 800;
  background: linear-gradient(135deg, #ffffff 0%, #a5b4fc 50%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 12px;
}

.result-desc {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 0 0 24px;
  line-height: 1.6;
}

.result-details {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 14px 20px;
  margin-bottom: 32px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
}

.result-details p {
  margin: 0;
}

.result-details strong {
  color: #a5b4fc;
}

/* ── 按鈕 ── */
.result-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-btn {
  display: block;
  width: 100%;
  padding: 14px 0;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  text-align: center;
  text-decoration: none;
  transition: all 0.2s ease;
}

.primary-btn {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
  box-shadow: 0 6px 24px rgba(139, 92, 246, 0.4);
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 32px rgba(139, 92, 246, 0.6);
}

.secondary-btn {
  border: 1px solid rgba(139, 92, 246, 0.35);
  color: #c4b5fd;
  background: transparent;
}

.secondary-btn:hover {
  background: rgba(139, 92, 246, 0.12);
  border-color: rgba(139, 92, 246, 0.7);
}
</style>