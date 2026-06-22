import type { AppConfig } from "#/lib/types"

declare global {
  interface Window {
    __APP_CONFIG__?: Partial<AppConfig>
  }
}

const DEFAULT_CONFIG: AppConfig = {
  semhasOnline: false,
  zoomLink: "",
  laporanUnlocked: false,
  umamiSrc: "",
  umamiWebsiteId: "",
}

export function getConfig(): AppConfig {
  if (typeof window === "undefined") return DEFAULT_CONFIG
  return { ...DEFAULT_CONFIG, ...(window.__APP_CONFIG__ ?? {}) }
}
