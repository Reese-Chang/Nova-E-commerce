<template>
  <!-- ── App Bar ── -->
  <v-app-bar :elevation="0" class="app-bar">

    <!-- 手機版：漢堡選單 -->
    <v-app-bar-nav-icon
      class="d-md-none"
      @click="drawer = !drawer"
      color="white"
    />

    <!-- Logo -->
    <NuxtLink to="/" class="logo-link">
      <v-app-bar-title class="logo-title">Nova Pet</v-app-bar-title>
    </NuxtLink>

    <!-- 桌面版：中央導覽連結 -->
    <div class="nav-links d-none d-md-flex">

      <!-- 有子項目的選單 -->
      <template v-for="item in navItems" :key="item.label">

        <!-- Dropdown -->
        <v-menu v-if="item.children" open-on-hover :open-delay="80" :close-delay="120">
          <template #activator="{ props }">
            <button v-bind="props" class="nav-btn">
              {{ item.label }}
              <svg class="nav-chevron" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
          </template>

          <v-card class="dropdown-card" :elevation="8" rounded="lg">
            <v-list density="compact" bg-color="transparent">
              <v-list-item
                v-for="child in item.children"
                :key="child.label"
                :to="child.to"
                class="dropdown-item"
                rounded="lg"
              >
                <v-list-item-title class="dropdown-label">{{ child.label }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>

        <!-- 單一連結 -->
        <NuxtLink v-else :to="item.to!" class="nav-btn">{{ item.label }}</NuxtLink>

      </template>
    </div>

    <!-- 右側 actions -->
    <template #append>
      <v-btn icon density="comfortable" class="icon-btn" aria-label="搜尋">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <NuxtLink to="/login" class="icon-btn-link">
        <v-btn icon density="comfortable" class="icon-btn" aria-label="會員">
          <v-icon>mdi-account-circle-outline</v-icon>
        </v-btn>
      </NuxtLink>
      <!-- 購物車圖示：v-badge 顯示購物車數量，為 0 時自動隱藏 -->
      <NuxtLink to="/cart" class="icon-btn-link">
        <v-badge
          :content="cartStore.totalCount"
          :model-value="cartStore.totalCount > 0"
          color="#8b5cf6"
          offset-x="5"
          offset-y="3"
        >
          <v-btn icon density="comfortable" class="icon-btn" aria-label="購物車">
            <v-icon>mdi-cart-outline</v-icon>
          </v-btn>
        </v-badge>
      </NuxtLink>
    </template>
  </v-app-bar>

  <!-- ── Mobile Drawer ── -->
  <v-navigation-drawer v-model="drawer" temporary width="280" class="mobile-drawer">
    <!-- Drawer Header -->
    <div class="drawer-header">
      <span class="drawer-logo">Nova Pet</span>
      <v-btn icon size="small" variant="text" @click="drawer = false" color="white">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>

    <v-list class="drawer-list">
      <template v-for="item in navItems" :key="item.label">

        <!-- Group with children -->
        <v-list-group v-if="item.children" :value="item.label">
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              :title="item.label"
              class="drawer-item"
            />
          </template>
          <v-list-item
            v-for="child in item.children"
            :key="child.label"
            :to="child.to"
            :title="child.label"
            class="drawer-child-item"
            @click="drawer = false"
          />
        </v-list-group>

        <!-- Single link -->
        <v-list-item
          v-else
          :to="item.to"
          :title="item.label"
          class="drawer-item"
          @click="drawer = false"
        />
      </template>
    </v-list>

    <!-- Drawer Footer -->
    <template #append>
      <div class="drawer-footer">
        <NuxtLink to="/login" class="drawer-login-btn" @click="drawer = false">
          <v-icon size="18">mdi-account-circle-outline</v-icon>
          登入 / 註冊
        </NuxtLink>
        <!-- 側邊抽屜購物車連結 -->
        <NuxtLink to="/cart" class="drawer-cart-btn" @click="drawer = false">
          <v-icon size="18">mdi-cart-outline</v-icon>
          購物車
          <span v-if="cartStore.totalCount > 0" class="drawer-cart-badge">
            {{ cartStore.totalCount }}
          </span>
        </NuxtLink>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCartStore } from '~/stores/useCartStore' // 引入購物車 Store

const drawer = ref(false)
// 取得購物車 store，用於顯示徐章數量與蹝向購物車頁
const cartStore = useCartStore()

// ── 導覽列資料結構 ───────────────────────────────
interface NavChild {
  label: string
  to: string
}
interface NavItem {
  label: string
  to?: string
  children?: NavChild[]
}

const navItems: NavItem[] = [
  {
    label: '產品系列',
    children: [
      { label: '腸胃敏感', to: '/collections?tag=stomach' },
      { label: '關節保健', to: '/collections?tag=joint' },
      { label: '皮毛養護', to: '/collections?tag=coat' },
      { label: '體重控制', to: '/collections?tag=weight' },
    ],
  },
  {
    label: '寵物分類',
    children: [
      { label: '狗狗專區', to: '/collections?type=dog' },
      { label: '貓貓專區', to: '/collections?type=cat' },
      { label: '小動物專區', to: '/collections?type=small' },
    ],
  }
  // { label: '最新消息', to: '/news' },
  // { label: '關於我們', to: '/about' },
]
</script>

<style scoped>
/* ── App Bar ── */
.app-bar {
  background: radial-gradient(circle at top right, #1e1e2f, #111111) !important;
  border-bottom: 1px solid rgba(139, 92, 246, 0.15) !important;
  box-shadow: 0 4px 20px rgba(139, 92, 246, 0.15) !important;
}

/* Logo */
.logo-link {
  text-decoration: none;
  display: flex;
  align-items: center;
}
.logo-title {
  font-size: 1.3rem !important;
  font-weight: 800 !important;
  background: linear-gradient(135deg, #ffffff, #a5b4fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 1px;
  white-space: nowrap;
}

/* ── Desktop Nav ── */
.nav-links {
  align-items: center;
  gap: 4px;
  margin-left: 24px;
}

.nav-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 8px 14px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  border-radius: 8px;
  text-decoration: none;
  transition: color 0.2s, background 0.2s;
  white-space: nowrap;
  letter-spacing: 0.3px;
}
.nav-btn:hover {
  color: #fff;
  background: rgba(139, 92, 246, 0.12);
}

.nav-chevron {
  opacity: 0.6;
  transition: transform 0.2s;
}

/* Dropdown card — 透明玻璃背景 */
.dropdown-card {
  background: rgba(15, 11, 26, 0.55) !important;
  border: 1px solid rgba(139, 92, 246, 0.3) !important;
  backdrop-filter: blur(18px) saturate(1.4);
  -webkit-backdrop-filter: blur(18px) saturate(1.4);
  min-width: 160px;
  padding: 6px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5) !important;
}

/* Vuetify v-list-item 需要 :deep() 穿透 scoped 樣式 */
.dropdown-card :deep(.v-list-item) {
  color: rgba(255, 255, 255, 0.72) !important;
  border-radius: 8px !important;
  min-height: 40px !important;
  transition: background 0.2s, color 0.2s !important;
  background: transparent !important;        /* 預設無底色，與卡片融合 */
}
.dropdown-card :deep(.v-list-item__overlay) {
  display: none !important;                  /* 關掉 Vuetify hover overlay */
}
.dropdown-card :deep(.v-list-item:hover) {
  background: rgba(139, 92, 246, 0.2) !important;   /* hover 才顯示底色 */
  color: #fff !important;
}
.dropdown-card :deep(.v-list-item-title) {
  font-size: 0.88rem;
  font-weight: 500;
}


/* Icon buttons */
.icon-btn {
  color: rgba(255, 255, 255, 0.75) !important;
  transition: color 0.2s !important;
}
.icon-btn:hover { color: #fff !important; }
.icon-btn-link { text-decoration: none; }

/* ── Mobile Drawer ── */
.mobile-drawer {
  background: #0e0e1a !important;
  border-right: 1px solid rgba(139, 92, 246, 0.2) !important;
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 16px 12px;
  border-bottom: 1px solid rgba(139, 92, 246, 0.15);
}
.drawer-logo {
  font-size: 1.2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #fff, #a5b4fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.drawer-list { padding-top: 8px; }

.drawer-item {
  color: rgba(255, 255, 255, 0.75) !important;
  font-size: 0.95rem !important;
  min-height: 48px !important;
}
.drawer-item:hover { color: #fff !important; }

.drawer-child-item {
  color: rgba(165, 180, 252, 0.85) !important;
  font-size: 0.88rem !important;
  padding-left: 32px !important;
  min-height: 40px !important;
}
.drawer-child-item:hover { color: #a5b4fc !important; }

.drawer-footer {
  padding: 16px;
  border-top: 1px solid rgba(139, 92, 246, 0.15);
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.drawer-login-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 12px 16px;
  border-radius: 10px;
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: #c4b5fd;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
}
.drawer-login-btn:hover {
  background: rgba(139, 92, 246, 0.2);
  color: #fff;
}

/* 側邊抽屜購物車按鈕 */
.drawer-cart-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 12px 16px;
  border-radius: 10px;
  background: transparent;
  border: 1px solid rgba(139, 92, 246, 0.2);
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
}
.drawer-cart-btn:hover {
  background: rgba(139, 92, 246, 0.1);
  color: #fff;
}
.drawer-cart-badge {
  margin-left: auto;
  background: #8b5cf6;
  color: #fff;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 20px;
}
</style>
