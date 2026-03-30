// ── 登入表單 ─────────────────────────────────
export interface LoginForm {
    email: string;
    password: string;
}

// ── 註冊表單 ─────────────────────────────────
export interface RegisterForm {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

// ── 使用者資料（登入後儲存在 store）─────────────
export interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
}

// ── API 回應格式 ──────────────────────────────
export interface AuthResponse {
    success: boolean;
    message: string;
    user?: User;
    token?: string;
}

// ── 表單欄位驗證錯誤 ──────────────────────────
export interface FormErrors {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}
