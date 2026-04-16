import { defineStore } from 'pinia'
import type { User } from '~/types/login'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as User | null,
        isLoading: false,
        error: null as string | null,
    }),

    getters: {
        isLoggedIn: (state) => !!state.user,
        userDisplayName: (state) => state.user?.name ?? '訪客',
    },

    actions: {
        // ── 初始化：從 Supabase Session 還原登入狀態 ─────────
        async init() {
            const supabase = useSupabaseClient()
            const { data: { session } } = await supabase.auth.getSession()
            if (session?.user) {
                this.user = {
                    id: session.user.id,
                    name: session.user.user_metadata?.name ?? '',
                    email: session.user.email ?? '',
                }
            }
        },

        // ── 註冊 ──────────────────────────────────────────
        async register(form: { name: string; email: string; password: string }) {
            this.isLoading = true
            this.error = null
            try {
                const supabase = useSupabaseClient()
                const { data, error } = await supabase.auth.signUp({
                    email: form.email,
                    password: form.password,
                    options: {
                        data: {
                            // 暱稱存入 user_metadata
                            name: form.name,
                        },
                    },
                })

                if (error) {
                    this.error = translateError(error.message)
                    return { success: false, message: this.error }
                }

                if (data.user) {
                    this.user = {
                        id: data.user.id,
                        name: data.user.user_metadata?.name ?? form.name,
                        email: data.user.email ?? form.email,
                    }
                    return { success: true, message: '註冊成功！歡迎加入 Nova Pet！' }
                }

                return { success: false, message: '註冊失敗，請稍後再試' }
            } catch (e) {
                this.error = '註冊時發生錯誤，請稍後再試'
                return { success: false, message: this.error }
            } finally {
                this.isLoading = false
            }
        },

        // ── 登入 ──────────────────────────────────────────
        async login(form: { email: string; password: string }) {
            this.isLoading = true
            this.error = null
            try {
                const supabase = useSupabaseClient()
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: form.email,
                    password: form.password,
                })

                if (error) {
                    console.log('🔴 Supabase 登入錯誤：', error.message, error.status)
                    this.error = translateError(error.message)
                    return { success: false, message: this.error }
                }


                if (data.user) {
                    this.user = {
                        id: data.user.id,
                        name: data.user.user_metadata?.name ?? '',
                        email: data.user.email ?? '',
                    }
                    return { success: true, message: '登入成功！' }
                }

                return { success: false, message: '登入失敗，請稍後再試' }
            } catch (e) {
                this.error = '登入時發生錯誤，請稍後再試'
                return { success: false, message: this.error }
            } finally {
                this.isLoading = false
            }
        },

        // ── 登出 ──────────────────────────────────────────
        async logout() {
            const supabase = useSupabaseClient()
            await supabase.auth.signOut()
            this.user = null
            this.error = null
        },
    },
})

// ── 錯誤訊息中文化 ─────────────────────────────────────────
function translateError(message: string): string {
    if (message.includes('Invalid login credentials')) return '電子信箱或密碼不正確'
    if (message.includes('Email not confirmed')) return '請先至信箱完成驗證'
    if (message.includes('User already registered')) return '此電子信箱已被註冊'
    if (message.includes('Password should be at least')) return '密碼至少需要 6 個字元'
    if (message.includes('Unable to validate email address')) return '電子信箱格式不正確'
    return message
}
