module.exports = {
    parser: 'babel-eslint',

    plugins: ['i18next'],

    extends: [
        './eslint.config.js',
        'plugin:react/recommended',
        'plugin:import/react',
    ],

    settings: {
        react: {
            version: 'detect',
        },
    },

    rules: {
        'i18next/no-literal-string': [
            'warn',
            { markupOnly: true, onlyAttribute: ['label'] },
        ],
        'react/sort-prop-types': [
            'error',
            {
                requiredFirst: true,
                sortShapeProp: true,
                callbacksLast: true,
            },
        ],
        'react/no-unused-prop-types': 'error',
    },

    overrides: [
        {
            files: ['*.test.js', '**/__tests__/*.js'],
            rules: {
                'i18next/no-literal-string': 'off',
            },
        },
    ],
}
