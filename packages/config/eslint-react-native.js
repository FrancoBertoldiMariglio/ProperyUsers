const base = require('./eslint-base')

/** @type {import('eslint').Linter.Config} */
module.exports = {
  ...base,
  extends: [
    ...base.extends,
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  plugins: [...(base.plugins || []), 'react', 'react-hooks'],
  env: {
    ...base.env,
    'react-native/react-native': true,
  },
  settings: {
    ...base.settings,
    react: {
      version: 'detect',
    },
  },
  rules: {
    ...base.rules,
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react/display-name': 'off',
  },
}
