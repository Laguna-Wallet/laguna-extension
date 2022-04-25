const path = require(`path`);
const { loaderByName, addBeforeLoader } = require('@craco/craco');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
  devServer: {
    devMiddleware: {
      writeToDisk: true
    }
  },

  webpack: {
    alias: {
      // '@polkadot/wasm-crypto-wasm': require.resolve('@polkadot/wasm-crypto-wasm/empty')
    },

    configure: (webpackConfig, { env, paths, resolve }) => {
      webpackConfig.module.rules.push({
        test: /\.js$/,
        loader: require.resolve('@open-wc/webpack-import-meta-loader')
      });

      webpackConfig.resolve.fallback = {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        fs: false,
        module: false,
        tls: false,
        net: false,
        path: false,
        zlib: false,
        http: false,
        https: false
      };

      paths.appBuild = webpackConfig.output.path = path.resolve('../../dist/popup');
      // filename: 'bundle.js',
      // publicPath: '/public/'

      return webpackConfig;
    }
  }
};
