import nextPlugin from '@next/eslint-plugin-next';
import createConfig from '@seedcord/eslint-config';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

const sanitizePlugin = (plugin) => {
    const sanitized = {};

    if (plugin?.rules) {
        sanitized.rules = plugin.rules;
    }

    if (plugin?.processors && Object.keys(plugin.processors).length > 0) {
        sanitized.processors = plugin.processors;
    }

    if (plugin?.meta) {
        sanitized.meta = plugin.meta;
    }

    return sanitized;
};

const nextCoreWebVitalsConfig = {
    name: 'seedcord/docs/next-core-web-vitals',
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
        parserOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            ecmaFeatures: {
                jsx: true
            }
        }
    },
    plugins: {
        '@next/next': sanitizePlugin(nextPlugin),
        react: sanitizePlugin(reactPlugin),
        'react-hooks': sanitizePlugin(reactHooksPlugin),
        'jsx-a11y': sanitizePlugin(jsxA11yPlugin)
    },
    settings: {
        react: {
            version: 'detect'
        }
    },
    rules: {
        ...nextPlugin.flatConfig.coreWebVitals.rules,
        ...reactPlugin.configs.recommended.rules,
        ...jsxA11yPlugin.configs.recommended.rules,
        ...reactHooksPlugin.configs.recommended.rules,
        'import/no-anonymous-default-export': 'warn',
        'react/no-unknown-property': 'off',
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
        'react/jsx-no-target-blank': 'off',
        'jsx-a11y/alt-text': [
            'warn',
            {
                elements: ['img'],
                img: ['Image']
            }
        ],
        'jsx-a11y/aria-props': 'warn',
        'jsx-a11y/aria-proptypes': 'warn',
        'jsx-a11y/aria-unsupported-elements': 'warn',
        'jsx-a11y/role-has-required-aria-props': 'warn',
        'jsx-a11y/role-supports-aria-props': 'warn'
    }
};

export default createConfig({
    tsconfigRootDir: import.meta.dirname,
    userConfigs: [
        nextCoreWebVitalsConfig,
        {
            ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts']
        }
    ]
});
