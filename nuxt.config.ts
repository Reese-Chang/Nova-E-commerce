// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  build: {
    transpile: ['vuetify'],
  },

  // ── 環境變數設定 ──────────────────────────────────────────
  // runtimeConfig：只有 server 端可以存取（不會暴露給瀏覽器）
  // runtimeConfig.public：前後端都可以存取
  runtimeConfig: {
    // 🔒 以下只在 server 端可用（安全）
    tappayPartnerKey: '',   // 從 .env 的 NUXT_TAPPAY_PARTNER_KEY 讀取
    tappayMerchantId: '',   // 從 .env 的 NUXT_TAPPAY_MERCHANT_ID 讀取
    siteUrl: '',            // 從 .env 的 NUXT_SITE_URL 讀取（LINE Pay 回調用）
  },

  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    '@pinia/nuxt'
    //...
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  }
})
