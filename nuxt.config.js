import colors from 'vuetify/es5/util/colors'

export default {
  ssr: false,
  // Global page headers: https://go.nuxtjs.dev/config-head
  server: {
    port: 8000,
    host: '0.0.0.0',
    timing: false
  },
  head: {
    titleTemplate: '%s',
    title: 'No Title',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
      { property: 'og:title', content: 'So We Quiches' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://sign.quiches.ovh/' },
      { property: 'og:image', content: 'https://sign.quiches.ovh/logo.png' },
      { property: 'og:description', content: 'Wanna Sign? - Go Quiches!' },
      { name: 'theme-color', content: '#ec94c8' }
    ],
    link: [
      { rel: 'icon', type: 'image/png', href: '/logo.png' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://auth.nuxtjs.org/
    '@nuxtjs/auth-next'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: '/'
  },

  publicRuntimeConfig: {
    axios: {
      browserBaseURL: process.env.BROWSER_BASE_URL
    },
    APPLE_CLIENT_ID: process.env.APPLE_CLIENT_ID || 'com.maxencemottard.swq.swa',
    APPLE_REDIRECT_URI: process.env.APPLE_REDIRECT_URI || 'https://sowequiches.loca.lt/login'
  },

  privateRuntimeConfig: {
    axios: {
      baseURL: process.env.BASE_URL
    }
  },

  auth: {
    strategies: {
      local: {
        token: {
          property: 'token',
          global: true,
          maxAge: 1800
        },
        refreshToken: {
          property: 'refreshToken',
          data: 'refreshToken',
          maxAge: 2628000
        },
        user: {
          property: false
        },
        endpoints: {
          login: { url: '/auth/login', method: 'post' },
          refresh: { url: '/auth/refresh', method: 'post' },
          logout: false,
          user: { url: '/auth/me', method: 'get' }
        }
      },
      apple: {
        scheme: 'local',
        token: {
          property: 'token',
          global: true
        },
        user: {
          property: false
        },
        endpoints: {
          login: { url: '/auth/login/apple-id', method: 'post' },
          logout: false,
          user: { url: '/auth/me', method: 'get' }
        }
      }

    }
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
