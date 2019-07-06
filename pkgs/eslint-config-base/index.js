const SEVERITY = 2

module.exports = {
    env: {
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
            SEVERITY,
            {
                max: 3,
            },
        ],
        'prefer-const': [
            SEVERITY,
            {
                destructuring: 'any',
                ignoreReadBeforeAssign: false,
            },
        ],
        'no-mixed-spaces-and-tabs': [SEVERITY],
    },
}