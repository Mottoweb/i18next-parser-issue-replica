/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const GitRevisionPlugin = require('git-revision-webpack-plugin');

const {
  getIfUtils, removeEmpty, getWebpackOptimization, getWebpackJsLegacyLoader, getWebpackOutput, getWebpackFileLoader,
  getWebpackResolve, getWebpackLegacySassLoader, getWebpackDevServer, getPerformance, getWebpackMode,
  getWebpackDevTool,
} = require('@adnz/build-tools');

const gitRevisionPlugin = new GitRevisionPlugin();
if (!fs.existsSync(path.resolve(__dirname, 'build')) || !fs.existsSync(path.resolve(__dirname, 'build/dist'))) {
  fs.mkdirSync(path.resolve(__dirname, 'build/dist'), { recursive: true });
}
fs.writeFileSync(path.resolve(__dirname, 'build/dist/COMMITHASH.txt'), gitRevisionPlugin.commithash());

module.exports = (env = {}) => {
  const {
    ifProduction,
    ifDevServer,
  } = getIfUtils(env);
  return {
    target: ['web', 'es5'],
    cache: {
      type: 'filesystem',
      cacheDirectory: path.resolve(__dirname, 'build/legacyCache'),
    },
    mode: getWebpackMode({ env }),
    devtool: getWebpackDevTool({ env }),
    entry: {
      raven: './src/raven.js',
      app: [
        'proxy-polyfill/proxy.min.js',
        '@babel/polyfill',
        'classlist-polyfill',
        'url-polyfill',
        'element-closest/browser',
        './src/scenes/IENotice',
      ],
    },
    output: getWebpackOutput({ env, dirname: __dirname }, {
      publicPath: '/',
      filename: '[name].legacy.js',
    }),
    resolve: getWebpackResolve({ dirname: __dirname }),
    module: {
      strictExportPresence: true,
      rules: [
        getWebpackJsLegacyLoader(),
        ...getWebpackLegacySassLoader('style-loader'),
        getWebpackFileLoader(),
      ],
    },
    plugins: removeEmpty([
      ifDevServer(new HtmlWebpackPlugin({
        template: './index.html',
        inject: true,
      }), false),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'locales'),
            to: path.resolve(__dirname, 'build/dist/locales'),
          },
          {
            from: path.resolve(__dirname, './src/assets/favicons'),
            to: path.resolve(__dirname, 'build/dist/favicons'),
          },
        ],
      }),
      new webpack.DefinePlugin({
        IS_TRANSLATION_DEBUG_ENABLED: ifProduction(false, true),
        IS_TRANSLATION_CACHE_ENABLED: ifProduction(true, false),
        IS_DEV_LABEL_VISIBLE: ifProduction(false, true),
        GA_UA_ID: ifProduction(JSON.stringify('UA-113365921-1'), false),
        COMMITHASH: JSON.stringify(gitRevisionPlugin.commithash()),
        TARGET_ENDPOINT: typeof env.target !== 'undefined'
          ? JSON.stringify(env.target)
          : ifProduction('"https://api.adconsole.ch"', '"https://dev-api.adconsole.ch"'),
        BC_ENDPOINT: typeof env.bcTarget !== 'undefined'
          ? JSON.stringify(env.bcTarget)
          : ifProduction('"https://businessclick.ch"', '"https://dev.businessclick.ch"'),
        CDN_ENDPOINT: typeof env.cdnTarget !== 'undefined'
          ? JSON.stringify(env.bcTarget)
          : ifProduction('"https://cdn.adnz.co"', '"https://dev-cdn.adnz.co"'),
        CONFIG_ENDPOINT: typeof env.configTarget !== 'undefined'
          ? JSON.stringify(env.configTarget)
          : ifProduction('"https://adnz.co"', '"https://dev.adnz.co"'),
        RAVEN_DSN: ifProduction('"https://d894812c26004cd4a1ceefd42fdde5c4@sentry.adnz.co/9"',
          '"https://e71283b186b340c0ad8ade21034a0552@sentry.adnz.co/8"'),
      }),
    ]),
    stats: 'errors-only',
    performance: getPerformance(),
    optimization: getWebpackOptimization({
      env,
      runtimeChunk: 'single',
    }),
    devServer: getWebpackDevServer({
      port: 8082,
      openPage: 'http://localhost:8082',
    }),
  };
};
