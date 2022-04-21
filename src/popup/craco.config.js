const path = require(`path`);
const { loaderByName, addBeforeLoader } = require('@craco/craco');

module.exports = {
  // devServer: (devServerConfig) => {
  //   devServerConfig.writeToDisk = true;
  //   return devServerConfig;
  // },
  devServer: {
    devMiddleware: {
      writeToDisk: true
    }
  },
  webpack: {
    alias: {
      // '@polkadot/wasm-crypto-wasm': require.resolve('@polkadot/wasm-crypto-wasm/empty')
    },
    configure: (webpackConfig, { env, paths }) => {
      webpackConfig.module.rules.push({
        test: /\.js$/,
        loader: require.resolve('@open-wc/webpack-import-meta-loader')
      });

      paths.appBuild = webpackConfig.output.path = path.resolve('../../dist/popup');

      return webpackConfig;
    }
  }
};
