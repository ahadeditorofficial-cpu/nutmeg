// next-pwa type declarations
declare module 'next-pwa' {
  import type { NextConfig } from 'next'

  interface PWAPluginOptions {
    dest?: string
    register?: boolean
    skipWaiting?: boolean
    clientsClaim?: boolean
    scope?: string
    sw?: string
    disable?: boolean
    cacheStartUrl?: boolean
    dynamicStartUrl?: boolean
    dynamicStartUrlRedirect?: string
    cacheOnFrontEndNav?: boolean
    reloadOnOnline?: boolean
    fallbacks?: {
      document?: string
      image?: string
      audio?: string
      video?: string
      font?: string
    }
    runtimeCaching?: Array<{
      urlPattern?: RegExp | ((params: { url: URL }) => boolean)
      handler?: string
      options?: Record<string, unknown>
      method?: string
    }>
    [key: string]: unknown
  }

  function withPWA(options?: PWAPluginOptions): (config: NextConfig) => NextConfig
  export = withPWA
}
