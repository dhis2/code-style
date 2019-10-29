const log = require('@dhis2/cli-helpers-engine').reporter

const fg = require('fast-glob')

const { eslint } = require('../../tools/eslint.js')
const { prettier } = require('../../tools/prettier.js')
const { blacklist, stagedFiles } = require('../../files.js')

exports.command = 'check [files..]'

exports.describe = 'Check JS format.'

exports.builder = {
    prettierConfig: {
        describe: 'Prettier config file to use',
        type: 'string',
    },
    eslintConfig: {
        describe: 'ESLint config file to use',
        type: 'string',
    },
    pattern: {
        describe:
            'Pattern to match for files, remember to enclose in double quotes!',
        type: 'string',
        default: '**/*.{js,jsx,ts,tsx}',
    },
    staged: {
        describe: 'Only check staged files in Git',
        type: 'boolean',
        default: 'false',
    },
}

exports.handler = argv => {
    const { files, pattern, eslintConfig, prettierConfig, staged } = argv

    const opts = {
        apply: false,
    }

    if (files) {
        opts.files = files
    } else {
        const entries = fg.sync([pattern], {
            dot: false,
            ignore: blacklist,
            absolute: false,
        })

        opts.files = entries
    }

    if (staged) {
        opts.files = stagedFiles(opts.files)
        log.info('Linting staged files:', opts.files)
    }

    log.info('Running ESLint...')
    eslint({
        config: eslintConfig,
        ...opts,
    })

    log.info('Running Prettier...')
    prettier({
        config: prettierConfig,
        ...opts,
    })
}
