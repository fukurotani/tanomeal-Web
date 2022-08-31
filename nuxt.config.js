import colors from 'vuetify/es5/util/colors'

const isDev = process.env.NODE_ENV === 'development'
const useEmulators = false
export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: 'たのみ～る',
    title: 'たのみ～る',
    htmlAttrs: {
      lang: 'ja'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  target: 'static',
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],
  serverMiddleware: [
 //   { path: '/api/paypay', handler: 'serverMiddleware/paypay' },
  ],
  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [{ src: 'plugins/vue-qrcode-reader', ssr: false }],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,
  ssr:false,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],
  /*router: {
    middleware: 'requireLogin'
  },*/

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios', '@nuxtjs/firebase','@nuxtjs/pwa'
  ],
  firebase: {
    config: JSON.parse(process.env.FIREBASE_CONFIG),
    services: {
      auth: {
       // ssr: true,
        emulatorPort: isDev && useEmulators ? 9099 : undefined,
        disableEmulatorWarnings: false,
        initialize:{
          onAuthStateChangedAction: 'accounts/onAuthStateChanged',
        }
      }, firestore: {
        emulatorPort: isDev && useEmulators ? 8080 : undefined,
        emulatorHost: 'localhost',
      },
    }
  },
  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: '/',
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
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
    extend(config, ctx) {
      config.module.rules.push({
        test: /\.(ogg|mp3|wav|mpe?g)$/i,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
        },
      })
    },
  },
  pwa:{
    icon:false,
    manifest: {
      lang: 'ja',
      name: 'たのみ～る 店舗側管理',
      short_name: 'たのみ～る',
      description: 'たのみ～るの店舗側管理ページです',
      display: 'standalone',
    },
  }
  /*pwa: {
    // disable the modules you don't need
    meta: false,
    icon: false,
    // モジュールキーフォーム構成を省略すると、適切なデフォルトが適用されます
    manifest: false,

    workbox: {
      importScripts: [
        // ...
        '/firebase-auth-sw.js'
      ],
      // HMR との競合を避けるため、ワークボックス モジュールはデフォルトでサービス ワーカーを開発環境にインストールしません。
      //これはテスト用にのみ true に設定し、開発中はブラウザのキャッシュを常にクリアすることを忘れないでください
      dev: process.env.NODE_ENV === 'development',
    }
  }*/
}
