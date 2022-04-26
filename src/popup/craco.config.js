const path = require(`path`);
const { loaderByName, addBeforeLoader } = require('@craco/craco');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const interpolateHtml = require('craco-interpolate-html-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devServer: {
    devMiddleware: {
      writeToDisk: true
    }
  },
  plugins: [
    {
      plugin: interpolateHtml,
      options: {
        template: './dist/index.html',
        filename: './popup.html',
        publicPath: '/dist'
      }
    }
  ],

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

      // paths.appBuild = webpackConfig.output.path = path.resolve('../../dist/popup');
      return {
        ...webpackConfig,
        entry: {
          main: [
            env === 'development' && require.resolve('react-dev-utils/webpackHotDevClient'),
            paths.appIndexJs
          ].filter(Boolean)
        },
        output: {
          ...webpackConfig.output,
          filename: 'static/js/[name].js',
          publicPath: './'
        },
        optimization: {
          ...webpackConfig.optimization,
          runtimeChunk: false
        }
      };

      // return webpackConfig;
    }
  }
};
