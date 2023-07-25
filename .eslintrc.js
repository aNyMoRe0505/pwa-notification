module.exports = {
  plugins: ['prettier'],
  extends: ['next/core-web-vitals', 'prettier', 'airbnb-base'],
  rules: {
    'prettier/prettier': 'error',
    'object-curly-newline': 0,
    'import/extensions': 0,
    'operator-linebreak': 0,
    indent: 0,
    'implicit-arrow-linebreak': 0,
    'max-len': 0,
  },
  settings: {
    'import/resolver': {
      alias: {
        extensions: ['.js', '.jsx'],
        map: [['@', '.']],
      },
    },
  },
};
