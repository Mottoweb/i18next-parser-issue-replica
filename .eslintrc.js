const { getEslintSettings } = require('@adnz/build-tools');

module.exports = {
  extends: ['../../.eslintrc.js'],
  globals: {
    TARGET_ENDPOINT: true,
    GA_UA_ID: true,
    COMMITHASH: true,
    BC_ENDPOINT: true,
    CDN_ENDPOINT: true,
    RAVEN_DSN: true,
    CONFIG_ENDPOINT: true,
    BTAFEED_ID_READY: true,
  },
  env: {
    browser: true,
    jest: true,
  },
  settings: getEslintSettings({ dirname: __dirname }),
};
