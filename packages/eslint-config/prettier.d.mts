/**
 * Prettier configuration object for Seedcord projects
 */
declare const prettierConfig: {
  tabWidth: number;
  semi: boolean;
  singleQuote: boolean;
  trailingComma: 'none' | 'es5' | 'all';
  printWidth: number;
  bracketSpacing: boolean;
  arrowParens: 'always' | 'avoid';
  endOfLine: 'lf' | 'crlf' | 'cr' | 'auto';
  useTabs: boolean;
  quoteProps: 'as-needed' | 'consistent' | 'preserve';
  bracketSameLine: boolean;
  proseWrap: 'always' | 'never' | 'preserve';
};

export default prettierConfig;
