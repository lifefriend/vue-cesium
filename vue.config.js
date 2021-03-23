const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const resolve = (dir) => path.join(__dirname, dir);
module.exports = {
  publicPath: './',
  outputDir: 'dist',
  lintOnSave: true,
  runtimeCompiler: false,
  transpileDependencies: [],
  productionSourceMap: false,
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'));
  },
  configureWebpack: {
    amd: {
      // Enable webpack-friendly use of require in Cesium
      toUrlUndefined: true,
    },
    plugins: [
      // Copy Cesium Assets, Widgets, and Workers to a static directory
      new CopyWebpackPlugin({
        patterns: [
          { from: path.join('node_modules/cesium/Source', '../Build/Cesium/Workers'), to: 'Workers' },
          { from: path.join('node_modules/cesium/Source', 'Assets'), to: 'Assets' },
          { from: path.join('node_modules/cesium/Source', 'Widgets'), to: 'Widgets' },
          { from: path.join('node_modules/cesium/Source', 'ThirdParty'), to: 'ThirdParty' },
        ],
      }),
      new webpack.DefinePlugin({
        // Define relative base path in cesium for loading assets
        CESIUM_BASE_URL: JSON.stringify(''),
      }),
    ],
    module: {
      unknownContextCritical: false,
    },
  },
  devServer: {
    open: true,
    host: 'localhost',
    port: 8000,
    https: false,
    overlay: {
      warnings: true,
      errors: true,
    },
  },
};
