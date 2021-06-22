module.exports = {
    extends: [
        'eslint:recommended',
        'prettier',
        'plugin:import/errors',
        'plugin:import/warnings',
    ],

    // unignore implicit rules about what types of files can be linted
    ignorePatterns: ['!.*'],

    env: {
        browser: true,
        node: true,
        jest: true,
        es6: true,
    },

    parserOptions: {
        // latest standard is ok, eq. to 9
        ecmaVersion: 2018,
        ecmaFeatures: {
            jsx: true,
        },
        sourceType: 'module',
    },

    rules: {
        'max-params': [
            'error',
            {
                max: 3,
            },
        ],
        'prefer-const': [
            'error',
            {
                destructuring: 'any',
                ignoreReadBeforeAssign: false,
            },
        ],
        'no-mixed-spaces-and-tabs': ['error'],
        'import/order': [
            'error',
            {
                'newlines-between': 'never',
                alphabetize: {
                    order: 'asc',
                    caseInsensitive: true,
                },
            },
        ],
        'import/extensions': ['error', 'ignorePackages'],
    },
}
