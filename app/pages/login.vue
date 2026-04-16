<template>
  <div class="login-page">
    <!-- Background -->
    <div class="bg-orb orb-1" />
    <div class="bg-orb orb-2" />

    <!-- Logo -->
    <NuxtLink to="/" class="logo-link">
      <span class="logo-text">Nova Pet</span>
    </NuxtLink>

    <!-- Card -->
    <div class="auth-card">

      <!-- Tab Switch -->
      <div class="tab-switch">
        <button
          class="tab-btn" :class="{ active: mode === 'login' }"
          @click="switchMode('login')"
        >登入</button>
        <button
          class="tab-btn" :class="{ active: mode === 'register' }"
          @click="switchMode('register')"
        >註冊</button>
        <div class="tab-indicator" :class="{ right: mode === 'register' }" />
      </div>

      <!-- Success Banner -->
      <Transition name="fade">
        <div v-if="successMsg" class="success-banner">
          <span>✓</span> {{ successMsg }}
        </div>
      </Transition>

      <!-- Error Banner -->
      <Transition name="fade">
        <div v-if="authStore.error" class="error-banner">
          <span>✕</span> {{ authStore.error }}
        </div>
      </Transition>

      <!-- ── Login Form ── -->
      <Transition name="slide" mode="out-in">
        <form v-if="mode === 'login'" key="login" class="auth-form" @submit.prevent="handleLogin">

          <div class="field-group">
            <label class="field-label">電子信箱</label>
            <input
              v-model="loginForm.email"
              id="login-email"
              type="email"
              class="field-input"
              :class="{ error: loginErrors.email }"
              placeholder="your@email.com"
              autocomplete="email"
            />
            <span v-if="loginErrors.email" class="field-error">{{ loginErrors.email }}</span>
          </div>

          <div class="field-group">
            <label class="field-label">密碼</label>
            <div class="input-wrapper">
              <input
                v-model="loginForm.password"
                id="login-password"
                :type="showLoginPwd ? 'text' : 'password'"
                class="field-input"
                :class="{ error: loginErrors.password }"
                placeholder="請輸入密碼"
                autocomplete="current-password"
              />
              <button type="button" class="eye-btn" @click="showLoginPwd = !showLoginPwd">
                <!-- <svg v-if="showLoginPwd" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg> -->
                <svg v-if="showLoginPwd" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
            <span v-if="loginErrors.password" class="field-error">{{ loginErrors.password }}</span>
          </div>

          <button type="submit" class="submit-btn" :disabled="authStore.isLoading">
            <span v-if="authStore.isLoading" class="spinner" />
            <span v-else>登入</span>
          </button>

          <p class="switch-hint">
            還沒有帳號？
            <button type="button" class="link-btn" @click="switchMode('register')">立即註冊</button>
          </p>

          <!-- <div class="divider"><span>測試帳號</span></div> -->
          <!-- <p class="hint-text">test@nova.com ／ password123</p> -->

        </form>

        <!-- ── Register Form ── -->
        <form v-else key="register" class="auth-form" @submit.prevent="handleRegister">

          <div class="field-group">
            <label class="field-label">暱稱</label>
            <input
              v-model="registerForm.name"
              id="reg-name"
              type="text"
              class="field-input"
              :class="{ error: registerErrors.name }"
              placeholder="請輸入您的暱稱"
              autocomplete="nickname"
            />
            <span v-if="registerErrors.name" class="field-error">{{ registerErrors.name }}</span>
          </div>

          <div class="field-group">
            <label class="field-label">電子信箱</label>
            <input
              v-model="registerForm.email"
              id="reg-email"
              type="email"
              class="field-input"
              :class="{ error: registerErrors.email }"
              placeholder="your@email.com"
              autocomplete="email"
            />
            <span v-if="registerErrors.email" class="field-error">{{ registerErrors.email }}</span>
          </div>

          <div class="field-group">
            <label class="field-label">密碼</label>
            <div class="input-wrapper">
              <input
                v-model="registerForm.password"
                id="reg-password"
                :type="showRegPwd ? 'text' : 'password'"
                class="field-input"
                :class="{ error: registerErrors.password }"
                placeholder="至少 8 個字元"
                autocomplete="new-password"
              />
              <!-- <button type="button" class="eye-btn" @click="showRegPwd = !showRegPwd">
                {{ showRegPwd ? '🙈' : '👁️' }}
              </button> -->
              <button type="button" class="eye-btn" @click="showRegPwd = !showRegPwd">
                <svg v-if="showRegPwd" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
            <span v-if="registerErrors.password" class="field-error">{{ registerErrors.password }}</span>
          </div>

          <div class="field-group">
            <label class="field-label">確認密碼</label>
            <div class="input-wrapper">
              <input
                v-model="registerForm.confirmPassword"
                id="reg-confirm"
                :type="showConfirmPwd ? 'text' : 'password'"
                class="field-input"
                :class="{ error: registerErrors.confirmPassword }"
                placeholder="請再次輸入密碼"
                autocomplete="new-password"
              />
              <button type="button" class="eye-btn" @click="showConfirmPwd = !showConfirmPwd">
                <!-- {{ showConfirmPwd ? '🙈' : '👁️' }} -->
                <svg v-if="showConfirmPwd" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
            <span v-if="registerErrors.confirmPassword" class="field-error">{{ registerErrors.confirmPassword }}</span>
          </div>

          <button type="submit" class="submit-btn" :disabled="authStore.isLoading">
            <span v-if="authStore.isLoading" class="spinner" />
            <span v-else>建立帳號</span>
          </button>

          <p class="switch-hint">
            已有帳號？
            <button type="button" class="link-btn" @click="switchMode('login')">立即登入</button>
          </p>

        </form>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/useAuthStore'
import type { LoginForm, RegisterForm, FormErrors } from '~/types/login'


const router = useRouter()
const authStore = useAuthStore()

// ── Mode ─────────────────────────────────────────────
type Mode = 'login' | 'register'
const mode = ref<Mode>('login')
const successMsg = ref('')

function switchMode(m: Mode) {
  mode.value = m
  successMsg.value = ''
  authStore.error = null
  Object.assign(loginErrors, { email: '', password: '' })
  Object.assign(registerErrors, { name: '', email: '', password: '', confirmPassword: '' })
}

// ── Login ─────────────────────────────────────────────
const loginForm = reactive<LoginForm>({ email: '', password: '' })
const loginErrors = reactive<FormErrors>({})
const showLoginPwd = ref(false)

function validateLogin(): boolean {
  loginErrors.email = ''
  loginErrors.password = ''
  if (!loginForm.email) { loginErrors.email = '請輸入電子信箱'; return false }
  if (!/^\S+@\S+\.\S+$/.test(loginForm.email)) { loginErrors.email = '電子信箱格式不正確'; return false }
  if (!loginForm.password) { loginErrors.password = '請輸入密碼'; return false }
  return true
}

async function handleLogin() {
  if (!validateLogin()) return
  const res = await authStore.login(loginForm)
  if (res.success) {
    successMsg.value = res.message
    setTimeout(() => router.push('/collections'), 800)
  }
}

// ── Register ──────────────────────────────────────────
const registerForm = reactive<RegisterForm>({ name: '', email: '', password: '', confirmPassword: '' })
const registerErrors = reactive<FormErrors>({})
const showRegPwd = ref(false)
const showConfirmPwd = ref(false)

function validateRegister(): boolean {
  registerErrors.name = ''
  registerErrors.email = ''
  registerErrors.password = ''
  registerErrors.confirmPassword = ''

  if (!registerForm.name.trim()) { registerErrors.name = '請輸入暱稱'; return false }
  if (!registerForm.email) { registerErrors.email = '請輸入電子信箱'; return false }
  if (!/^\S+@\S+\.\S+$/.test(registerForm.email)) { registerErrors.email = '電子信箱格式不正確'; return false }
  if (!registerForm.password) { registerErrors.password = '請輸入密碼'; return false }
  if (registerForm.password.length < 8) { registerErrors.password = '密碼至少需要 8 個字元'; return false }
  if (registerForm.confirmPassword !== registerForm.password) {
    registerErrors.confirmPassword = '兩次輸入的密碼不一致'
    return false
  }
  return true
}

async function handleRegister() {
  if (!validateRegister()) return
  const res = await authStore.register(registerForm)
  if (res.success) {
    successMsg.value = res.message
    setTimeout(() => router.push('/collections'), 800)
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');

/* ── Page ── */
.login-page {
  min-height: 100vh;
  background: radial-gradient(circle at top right, #1e1e2f, #0e0e1a);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', 'Noto Sans TC', sans-serif;
  position: relative;
  overflow: hidden;
  padding: 20px;
}

/* Background orbs */
.bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
}
.orb-1 {
  width: 500px; height: 500px;
  background: rgba(99, 102, 241, 0.18);
  top: -120px; left: -100px;
}
.orb-2 {
  width: 400px; height: 400px;
  background: rgba(139, 92, 246, 0.12);
  bottom: -80px; right: -80px;
}

/* Logo */
.logo-link {
  position: fixed;
  top: 24px; left: 32px;
  text-decoration: none;
  z-index: 10;
}
.logo-text {
  font-size: 1.3rem;
  font-weight: 800;
  background: linear-gradient(135deg, #fff, #a5b4fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ── Card ── */
.auth-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 440px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 24px;
  padding: 36px 36px 32px;
  backdrop-filter: blur(12px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}

/* ── Tab Switch ── */
.tab-switch {
  position: relative;
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 28px;
}
.tab-btn {
  flex: 1;
  padding: 10px;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  position: relative;
  z-index: 1;
  transition: color 0.3s ease;
  border-radius: 9px;
}
.tab-btn.active { color: #fff; }
.tab-indicator {
  position: absolute;
  top: 4px; left: 4px;
  width: calc(50% - 4px);
  height: calc(100% - 8px);
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 9px;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4px 14px rgba(139, 92, 246, 0.4);
}
.tab-indicator.right { transform: translateX(100%); }

/* ── Banners ── */
.success-banner, .error-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 0.88rem;
  font-weight: 500;
  margin-bottom: 16px;
}
.success-banner {
  background: rgba(34, 197, 94, 0.15);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: #4ade80;
}
.error-banner {
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #f87171;
}

/* ── Form ── */
.auth-form { display: flex; flex-direction: column; gap: 16px; }

.field-group { display: flex; flex-direction: column; gap: 6px; }

.field-label {
  font-size: 0.83rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 0.5px;
}

.input-wrapper { position: relative; }

.field-input {
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 10px;
  color: #f0f0f0;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
}
.field-input::placeholder { color: rgba(255, 255, 255, 0.25); }
.field-input:focus {
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
}
.field-input.error {
  border-color: rgba(239, 68, 68, 0.6);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}
/* input inside wrapper needs padding-right for eye button */
.input-wrapper .field-input { padding-right: 44px; }

.eye-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 4px;
  line-height: 1;
  opacity: 0.6;
  transition: opacity 0.2s;
}
.eye-btn:hover { opacity: 1; }

.field-error {
  font-size: 0.78rem;
  color: #f87171;
  padding-left: 2px;
}

/* ── Submit ── */
.submit-btn {
  width: 100%;
  padding: 14px;
  margin-top: 4px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border: none;
  border-radius: 12px;
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50px;
  box-shadow: 0 6px 20px rgba(139, 92, 246, 0.35);
}
.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(139, 92, 246, 0.45);
}
.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

/* Spinner */
.spinner {
  width: 20px; height: 20px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Switch hint ── */
.switch-hint {
  text-align: center;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.4);
  margin: 0;
}
.link-btn {
  background: none;
  border: none;
  color: #a5b4fc;
  cursor: pointer;
  font-size: inherit;
  font-weight: 600;
  padding: 0;
  transition: color 0.2s;
}
.link-btn:hover { color: #fff; }

/* Divider */
.divider {
  display: flex;
  align-items: center;
  gap: 12px;
  color: rgba(255,255,255,0.2);
  font-size: 0.78rem;
}
.divider::before, .divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: rgba(255,255,255,0.1);
}
.hint-text {
  text-align: center;
  font-size: 0.8rem;
  color: rgba(255,255,255,0.3);
  margin: 0;
  font-family: monospace;
  letter-spacing: 0.5px;
}

/* ── Transitions ── */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-enter-active, .slide-leave-active { transition: all 0.28s ease; }
.slide-enter-from { opacity: 0; transform: translateX(20px); }
.slide-leave-to { opacity: 0; transform: translateX(-20px); }

/* ── Responsive ── */
@media (max-width: 480px) {
  .auth-card { padding: 28px 20px 24px; }
}
</style>
