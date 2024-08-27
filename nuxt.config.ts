// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  css: ['~/assets/css/main.scss'],
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
    {
      path: '~/components',
      pathPrefix: 'rating',
    },
    {
      path: '~/components',
      pathPrefix: 'svg',
    }
  ],
  runtimeConfig: {
    public: {
      API_KEYS: process.env.GIPHY_API_KEYS,
      API_URL: process.env.GIPHY_API_URL,
    }
  },
  ssr: false,
  modules: ["@nuxt/image"],
})