module.exports = {
    parser: 'babel-eslint',

    plugins: ['jsx-a11y'],

    extends: [
        './eslint.config.js',
        'plugin:react/recommended',
        'plugin:import/react',
        'plugin:jsx-a11y/recommended',
    ],

    settings: {
        react: {
            version: 'detect',
        },
    },

    rules: {
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
