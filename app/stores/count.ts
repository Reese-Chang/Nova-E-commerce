import { defineStore } from 'pinia'

// 定義並導出一個名為 count 的 Store
export const useCountStore = defineStore('count', {
  // state 必須是一個函數，回傳初始數據 [00:07:50]
//   state: () => ({
//     sum: 5,
//     school: '尚矽谷',
//     address: '宏福科技園'
//   })
    actions: {
        increment() {
            this.sum++
        }
    },
    state() {
        return {
            sum: 8,
            school: '尚矽谷',
            address: '宏福科技園'
        }
    }
})