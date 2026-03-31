/**
 * ══════════════════════════════════════════════════════════════
 * POST /api/pay — TapPay LINE Pay 付款 API
 * ══════════════════════════════════════════════════════════════
 *
 * 【流程說明】
 * ────────────────────────────────────────────────────────────
 * 前端（cart.vue）                  後端（此檔案）               TapPay
 *   │                                │                          │
 *   │ 1. getPrime() 取得 prime       │                          │
 *   │──── POST /api/pay ───────────>│                          │
 *   │     { prime, amount, ... }     │                          │
 *   │                                │ 2. Pay by Prime API      │
 *   │                                │─────────────────────────>│
 *   │                                │                          │
 *   │                                │<── payment_url ──────────│
 *   │<── { payment_url } ───────────│                          │
 *   │                                │                          │
 *   │ 3. redirect(payment_url)       │                          │
 *   │──── 導向 LINE Pay ────────────────────────────────────────>│
 *
 * 【安全性】
 * ────────────────────────────────────────────────────────────
 * - PARTNER_KEY 從 .env 環境變數讀取（透過 Nuxt runtimeConfig）
 * - 此檔案只在 server 端執行，密鑰不會暴露給瀏覽器
 * - .env 已加入 .gitignore，不會被推到 Git
 */
export default defineEventHandler(async (event) => {
  // ──────────────────────────────────────────────────────────
  // Step 0: 讀取環境變數（從 .env → nuxt.config runtimeConfig）
  // ──────────────────────────────────────────────────────────
  const config = useRuntimeConfig()
  const PARTNER_KEY = config.tappayPartnerKey
  const MERCHANT_ID = config.tappayMerchantId
  console.log("35");

  // 確認環境變數已設定
  if (!PARTNER_KEY || !MERCHANT_ID) {
    console.error('❌ 缺少 TapPay 環境變數，請檢查 .env 檔案')
    throw createError({
      statusCode: 500,
      message: '伺服器金流設定錯誤，請聯繫管理員',
    })
  }

  // ──────────────────────────────────────────────────────────
  // Step 1: 讀取前端傳來的資料
  // ──────────────────────────────────────────────────────────
  const body = await readBody(event)
  const { prime, amount, details } = body

  // 驗證必要參數
  if (!prime || !amount) {
    throw createError({
      statusCode: 400,
      message: '缺少必要參數：prime 和 amount',
    })
  }

  console.log(`📦 收到付款請求：金額 ${amount}，prime: ${prime.substring(0, 10)}...`)

  // ──────────────────────────────────────────────────────────
  // Step 2: 組裝 TapPay「Pay by Prime」請求
  // ──────────────────────────────────────────────────────────
  // API 文件：https://docs.tappaysdk.com/tutorial/zh/back.html
  const TAPPAY_API_URL = 'https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime'
  // ⚠️ 正式環境請改為：'https://prod.tappaysdk.com/tpc/payment/pay-by-prime'
  console.log("68");

  const payload = {
    // ── 必填欄位 ─────────────────────────────────────────
    prime,                          // 前端 getPrime() 取得的 token
    partner_key: PARTNER_KEY,       // 後端密鑰（從 .env 讀取）
    merchant_id: MERCHANT_ID,       // LINE Pay 商店 ID（從 .env 讀取）
    amount,                         // 交易金額（新台幣）
    currency: 'TWD',                // 幣別

    // ── 訂單資訊 ─────────────────────────────────────────
    details: details || 'Nova Pet 寵物商品',  // 訂單描述（會顯示在 LINE Pay）
    order_number: `NOVA-${Date.now()}`,       // 自訂訂單編號

    // ── 購買者資訊（LINE Pay 必填）──────────────────────
    cardholder: {
      phone_number: '+886900000000',    // 購買者電話
      name: 'Nova Pet Customer',        // 購買者姓名
      email: 'customer@novapet.com',    // 購買者 Email
    },

    // ── LINE Pay 回調網址 ────────────────────────────────
    // frontend_redirect_url：付款完成後，LINE Pay 會把使用者導回這個網址
    // backend_notify_url：TapPay 會在背景通知這個網址付款結果（選填）
    result_url: {
      frontend_redirect_url: 'http://localhost:3000/payResult',
      // backend_notify_url: 'http://localhost:3000/api/pay-notify',
      backend_notify_url: 'https://nova-e-commerce-sage.vercel.app/api/pay-notify'
    },
  }
  console.log("97", payload);

  // ──────────────────────────────────────────────────────────
  // Step 3: 呼叫 TapPay API
  // ──────────────────────────────────────────────────────────
  try {
    const response: any = await $fetch(TAPPAY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': PARTNER_KEY,       // TapPay 要求在 header 帶上 partner key
      },
      body: payload,
    })
    console.log("109", response);

    console.log('📨 TapPay 回應:', JSON.stringify(response, null, 2))

    // ────────────────────────────────────────────────────────
    // Step 4: 檢查回應結果
    // ────────────────────────────────────────────────────────
    // status === 0 代表成功
    if (response.status !== 0) {
      console.error(`❌ TapPay 回應錯誤：[${response.status}] ${response.msg}`)
      throw createError({
        statusCode: 400,
        message: `付款請求失敗：${response.msg}`,
      })
    }

    // ────────────────────────────────────────────────────────
    // Step 5: 回傳 payment_url 給前端
    // ────────────────────────────────────────────────────────
    // 前端收到後會呼叫 TPDirect.redirect(payment_url)
    // 把使用者導向 LINE Pay 的付款畫面
    console.log('✅ 取得 payment_url，準備導向 LINE Pay')

    return {
      status: 'success',
      payment_url: response.payment_url,      // LINE Pay 付款頁面網址
      rec_trade_id: response.rec_trade_id,    // TapPay 交易編號
      order_number: response.order_number,    // 自訂訂單編號
    }
  } catch (err: any) {
    console.error('❌ TapPay API 呼叫失敗:', err)

    // 如果是已經用 createError 包裝過的錯誤，直接拋出
    if (err.statusCode) throw err

    // 其他未預期的錯誤
    throw createError({
      statusCode: 500,
      message: '呼叫金流 API 失敗：' + (err.message || '未知錯誤'),
    })
  }
})
