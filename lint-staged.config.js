export default {
  '*.{js,ts,vue}': ['oxlint --fix', 'oxfmt --write'],
  '*.{json,jsonc,md,yml,yaml,css}': ['oxfmt --write'],
};
