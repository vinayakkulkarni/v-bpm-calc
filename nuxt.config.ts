import tailwindcss from '@tailwindcss/vite';

// Cloudflare compatibility date — keep the two copies below in sync.
const COMPATIBILITY_DATE = '2026-10-23';

export default defineNuxtConfig({
  compatibilityDate: COMPATIBILITY_DATE,

  modules: ['@nuxtjs/color-mode'],

  devtools: { enabled: false },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  // Cookie-backed so the server renders the right class on <html>; the
  // module's inline head script resolves "system" before first paint.
  colorMode: {
    preference: 'system',
    fallback: 'light',
    classSuffix: '',
    storage: 'cookie',
    storageKey: 'v-bpm-calc-color-mode',
  },

  // Public IDs ship in the HTML; they are not secrets. Override per env with
  // NUXT_PUBLIC_GTAG_ID, NUXT_PUBLIC_PLAUSIBLE_SCRIPT_ID, etc. An empty
  // gtagId skips GA4 entirely.
  runtimeConfig: {
    public: {
      gtagId: 'G-FJEE22NJBJ',
      plausibleScriptId: 'pa-PD0viITHQsp_OwPEAg5Ai',
      plausibleApiHost: 'https://analytics.geoql.in',
      openpanelClientId: 'dcc2b9e2-bad2-4dab-8370-a82976f7d98e',
      openpanelApiUrl: 'https://events.geoql.in/api',
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'v-bpm-calc — tap tempo in Vue',
      meta: [
        {
          name: 'description',
          content:
            'Tap any key or the pad to the beat and read the tempo in BPM. A tap tempo calculator made with Vue.',
        },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        {
          rel: 'preload',
          href: '/fonts/clash-display-600.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: '',
        },
        {
          rel: 'preload',
          href: '/fonts/satoshi-400.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: '',
        },
      ],
    },
  },

  nitro: {
    preset: 'cloudflare_module',
    cloudflare: {
      nodeCompat: true,
      deployConfig: true,
      // Merged into the generated .output/server/wrangler.json.
      wrangler: {
        name: 'v-bpm-calc-demo',
        account_id: 'bd11b1c42ee2759044a1769f80f704dd',
        compatibility_date: COMPATIBILITY_DATE,
        workers_dev: true,
        preview_urls: false,
        routes: [
          { pattern: 'v-bpm-calc.vinayakkulkarni.dev', custom_domain: true },
        ],
        observability: { enabled: true },
      },
    },
  },

  typescript: {
    strict: true,
  },
});
