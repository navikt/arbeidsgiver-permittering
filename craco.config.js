const CracoLessPlugin = require('craco-less');
const path = require('path');
const decoratorhtmlwebpackplugin = require('./plugins/decoratorhtmlwebpackplugin');

module.exports = {
    webpack: {
        alias: {
            '@': path.resolve(__dirname, 'src/'),
        },
    },
    eslint: {
        enable: true,
        mode: 'extends',
        configure: {
            parser: '@typescript-eslint/parser',
            parserOptions: {
                sourceType: 'module',
            },
            plugins: ['@typescript-eslint'],
            extends: ['plugin:jsx-a11y/recommended'],
            rules: {
                '@typescript-eslint/no-use-before-define': 'off',
            },
        },
    },
    plugins: [
        { plugin: CracoLessPlugin },
        {
            plugin: decoratorhtmlwebpackplugin(
                process.env.ENABLE_EXTERNAL_MENU
            ),
        },
    ],
};
