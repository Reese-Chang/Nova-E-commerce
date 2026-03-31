/**
 * POST /api/pay-notify — TapPay 付款結果背景通知
 *
 * 當使用者在 LINE Pay 完成付款後，TapPay 會在背景呼叫此 API
 * 通知付款結果。這是「伺服器對伺服器」的通知，不經過瀏覽器。
 *
 * 【用途】
 * - 確認付款是否真的成功（不依賴前端重導向）
 * - 可在此更新資料庫訂單狀態
 * - 即使使用者關閉瀏覽器，此通知仍會送達
 */
export default defineEventHandler(async (event) => {
  console.log("13 pay-notify");

  const body = await readBody(event)

  console.log('🔔 收到 TapPay 付款通知:', JSON.stringify(body, null, 2))

  // status === 0 代表付款成功
  if (body.status === 0) {
    console.log(`✅ 訂單付款成功！交易編號: ${body.rec_trade_id}，金額: ${body.amount}`)
    // TODO: 在這裡更新資料庫訂單狀態為「已付款」
    // 例如：await db.orders.update({ rec_trade_id: body.rec_trade_id, status: 'paid' })
  } else {
    console.log(`❌ 訂單付款失敗：[${body.status}] ${body.msg}`)
    // TODO: 更新訂單狀態為「付款失敗」
  }

  // 回傳 200 OK 告知 TapPay 已收到通知
  return { received: true }
})
