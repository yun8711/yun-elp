const isDeclarationFile = file => file.endsWith('.d.ts');

const jsTsVueFiles = filenames => {
  const files = filenames.filter(file => !isDeclarationFile(file));
  if (files.length === 0) return [];
  return [`eslint --fix ${files.join(' ')}`, `prettier --write ${files.join(' ')}`];
};

export default {
  '*.{js,jsx,ts,tsx,vue}': jsTsVueFiles,
  '*.{css,scss,vue}': ['stylelint --fix', 'prettier --write'],
  '*.{json,md,yml,yaml}': ['prettier --write']
};
