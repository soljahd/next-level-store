declare module '@next/eslint-plugin-next' {
  import type { ESLint, Linter } from 'eslint';
  const eslintPluginNext: ESLint.Plugin & {
    configs: {
      recommended: Linter.FlatConfig;
      'core-web-vitals': Linter.FlatConfig;
    };
  };
  export default eslintPluginNext;
}
