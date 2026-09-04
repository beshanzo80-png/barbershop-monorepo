const baseConfig = require('./eslint.base.js');

module.exports = {
  ...baseConfig,
  extends: [
    ...baseConfig.extends,
    'next/core-web-vitals',
  ],
  rules: {
    ...baseConfig.rules,
    '@next/next/no-html-link-for-pages': 'off',
    'react/no-unescaped-entities': 'off',
  },
};