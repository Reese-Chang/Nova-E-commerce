import { defineStore } from 'pinia'
import type { User, AuthResponse, LoginForm, RegisterForm } from '~/types/login'

// ============================================================
// Mock API — 後端完成後，將這兩個函式替換成真實 API call 即可
// ============================================================

const MOCK_USERS: { email: string; password: string; user: User }[] = [
    {
        email: 'test@nova.com',
        password: 'password123',
        user: { id: 'user-001', name: 'Nova 測試用戶', email: 'test@nova.com' },
    },
]

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

async function mockLogin(form: LoginForm): Promise<AuthResponse> {
    await delay(1000) // 模擬網路延遲
    const found = MOCK_USERS.find(u => u.email === form.email && u.password === form.password)
    if (found) {
        return {
            success: true,
            message: '登入成功！',
            user: found.user,
            token: `mock-token-${Date.now()}`,
        }
    }
    return { success: false, message: '電子信箱或密碼不正確' }
}

async function mockRegister(form: RegisterForm): Promise<AuthResponse> {
    await delay(1200)
    if (MOCK_USERS.find(u => u.email === form.email)) {
        return { success: false, message: '此電子信箱已被註冊' }
    }
    const newUser: User = {
        id: `user-${Date.now()}`,
        name: form.name,
        email: form.email,
    }
    MOCK_USERS.push({ email: form.email, password: form.password, user: newUser })
    return {
        success: true,
        message: '註冊成功！歡迎加入 Nova Pet！',
        user: newUser,
        token: `mock-token-${Date.now()}`,
    }
}

// ============================================================
// Pinia Store
// ============================================================

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as User | null,
        token: null as string | null,
        isLoading: false,
        error: null as string | null,
    }),

    getters: {
        isLoggedIn: (state) => !!state.token && !!state.user,
        userDisplayName: (state) => state.user?.name ?? '訪客',
    },

    actions: {
        // ── 初始化：從 localStorage 還原登入狀態 ──────────
        init() {
            if (typeof window === 'undefined') return
            const token = localStorage.getItem('nova_token')
            const userStr = localStorage.getItem('nova_user')
            if (token && userStr) {
                try {
                    this.token = token
                    this.user = JSON.parse(userStr)
                } catch {
                    this.logout()
                }
            }
        },

        // ── 登入 ──────────────────────────────────────────
        async login(form: LoginForm) {
            this.isLoading = true
            this.error = null
            try {
                // 👇 換成真實 API 時，將此行替換為：
                // const res = await $fetch<AuthResponse>('/api/auth/login', { method: 'POST', body: form })
                const res = await mockLogin(form)
                if (res.success && res.user && res.token) {
                    this.user = res.user
                    this.token = res.token
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('nova_token', res.token)
                        localStorage.setItem('nova_user', JSON.stringify(res.user))
                    }
                } else {
                    this.error = res.message
                }
                return res
            } catch (e) {
                this.error = '登入時發生錯誤，請稍後再試'
                return { success: false, message: this.error }
            } finally {
                this.isLoading = false
            }
        },

        // ── 註冊 ──────────────────────────────────────────
        async register(form: RegisterForm) {
            this.isLoading = true
            this.error = null
            try {
                // 👇 換成真實 API 時，將此行替換為：
                // const res = await $fetch<AuthResponse>('/api/auth/register', { method: 'POST', body: form })
                const res = await mockRegister(form)
                if (res.success && res.user && res.token) {
                    this.user = res.user
                    this.token = res.token
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('nova_token', res.token)
                        localStorage.setItem('nova_user', JSON.stringify(res.user))
                    }
                } else {
                    this.error = res.message
                }
                return res
            } catch (e) {
                this.error = '註冊時發生錯誤，請稍後再試'
                return { success: false, message: this.error }
            } finally {
                this.isLoading = false
            }
        },

        // ── 登出 ──────────────────────────────────────────
        logout() {
            this.user = null
            this.token = null
            this.error = null
            if (typeof window !== 'undefined') {
                localStorage.removeItem('nova_token')
                localStorage.removeItem('nova_user')
            }
        },
    },
})
