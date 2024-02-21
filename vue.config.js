const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production'
    ? '/Chinese-Chess/'
    : '/',
  transpileDependencies: true,
  pwa: {
    name: "Chinese Chess",
    themeColor: "#232527",
    iconPaths: {
      faviconSVG: 'img/icons/favicon.svg',
      favicon16: 'img/icons/favicon-jiang (light) (16x16).png',
      favicon32: 'img/icons/favicon-jiang (light) (32x32).png',
      appleTouchIcon: 'img/icons/favicon-jiang (light) (152x152).png',
      maskIcon: 'img/icons/safari-pinned-tab.svg',
      msTileImage: 'img/icons/favicon-jiang (light) (144x144).png',
    }
  }
})