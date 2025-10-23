import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/app/**/*.{ts,tsx}',
        './src/components/**/*.{ts,tsx}',
        './src/lib/**/*.{ts,tsx}',
        './src/store/**/*.{ts,tsx}',
        './src/ui/**/*.{ts,tsx}'
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                brandA: '#f04e36',
                brandB: '#6fab49'
            }
        }
    },
    plugins: []
};

export default config;
