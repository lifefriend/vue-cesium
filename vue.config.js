const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  // 部署应用包时的基本 URL,用法和 webpack 本身的 output.publicPath 一致
  publicPath: './',
  // 输出文件目录
  outputDir: 'dist',
  // eslint-loader 是否在保存的时候检查
  lintOnSave: true,
  // 是否使用包含运行时编译器的 Vue 构建版本
  runtimeCompiler: false,
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,
  // 生成的 HTML 中的 <link rel="stylesheet"> 和 <script> 标签上启用 Subresource Integrity (SRI)
  integrity: false,
  // webpack相关配置
  chainWebpack: config => {
    config.resolve.alias
      .set('vue$', 'vue/dist/vue.esm.js')
      .set('@', path.resolve(__dirname, './src'))
      // .set('cesium', path.resolve(__dirname, './node_modules/cesium/Source'))
  },
  configureWebpack: {
    amd: {
      // Enable webpack-friendly use of require in Cesium
      toUrlUndefined: true
    },
    plugins: [
      // Copy Cesium Assets, Widgets, and Workers to a static directory
      new CopyWebpackPlugin([ { from: path.join('node_modules/cesium/Source', '../Build/Cesium/Workers'), to: 'Workers' } ]),
      new CopyWebpackPlugin([ { from: path.join('node_modules/cesium/Source', 'Assets'), to: 'Assets' } ]),
      new CopyWebpackPlugin([ { from: path.join('node_modules/cesium/Source', 'Widgets'), to: 'Widgets' } ]),
      new CopyWebpackPlugin([ { from: path.join('node_modules/cesium/Source', 'ThirdParty'), to: 'ThirdParty' } ]),
      new webpack.DefinePlugin({
        // Define relative base path in cesium for loading assets
        CESIUM_BASE_URL: JSON.stringify('')
      })
    ],
    module: {
      unknownContextCritical: false
    }
  },
  // css相关配置
  css: {
    // 是否分离css（插件ExtractTextPlugin）
    extract: true,
    // 是否开启 CSS source maps
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {},
    // 是否启用 CSS modules for all css / pre-processor files.
    modules: false
  },
  // 是否使用 thread-loader
  parallel: require('os').cpus().length > 1,
  // PWA 插件相关配置
  pwa: {},
  // webpack-dev-server 相关配置
  devServer: {
    open: true,
    host: '0.0.0.0',
    port: 8000,
    https: false,
    hotOnly: false,
    // http 代理配置
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8084/api',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },
    overlay: {
      warnings: true,
      errors: true
    },
    before: app => {}
  },
  // 第三方插件配置
  pluginOptions: {}
}
