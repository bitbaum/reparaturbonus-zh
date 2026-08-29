import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';

const eslintConfig = [
  {
    ignores: ['.next/**', 'node_modules/**', 'out/**'],
  },
  ...nextCoreWebVitals,
  ...nextTypeScript,
  {
    // eslint-plugin-react-hooks v6 (bundled with Next 16's eslint-config-next)
    // adds React-Compiler-era rules absent from the Next 15 config. Adopting
    // them across this codebase is a dedicated refactor, out of scope for a
    // framework version bump (same precedent as orangecat's eslint.config.mjs).
    // rules-of-hooks and exhaustive-deps stay enabled.
    rules: {
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/error-boundaries': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
      'react-hooks/static-components': 'off',
      'react-hooks/purity': 'off',
    },
  },
];

export default eslintConfig;
