module.exports = {
  root: true,
  extends: '@react-native',
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: true,
    babelOptions: {
      presets: ['module:@react-native/babel-preset'],
      plugins: [['@babel/plugin-proposal-decorators', { legacy: true }]],
    },
  },
};
