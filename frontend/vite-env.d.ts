/// <reference types="vite/client" />

// ↓  не обязательно, но удобно явно описать свои переменные:
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  // readonly VITE_SOME_KEY?: string
}
