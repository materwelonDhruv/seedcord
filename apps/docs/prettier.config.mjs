import base from '../../prettier.config.mjs';

/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
    ...base,
    plugins: [...(base.plugins ?? []), 'prettier-plugin-tailwindcss'],
    tailwindStylesheet: './src/app/globals.css',
    tailwindFunctions: ['cn', 'clsx', 'cva', 'tw', 'tw\\.[a-zA-Z]+'],
    tailwindAttributes: ['myClassList', '/data-.*/']
};

export default config;
