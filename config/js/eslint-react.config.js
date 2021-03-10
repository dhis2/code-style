module.exports = {
    parser: 'babel-eslint',

    plugins: ['react-hooks'],

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
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
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
}
