const log = require('@dhis2/cli-helpers-engine').reporter

const { run } = require('../utils/run.js')
const { resolveIgnoreFile } = require('../utils/files.js')

exports.prettier = ({ files = [], apply = false, config }) => {
    const ignoreFile = resolveIgnoreFile()
    const cmd = 'npx'
    const args = [
        '--no-install',
        'prettier',
        '--list-different',
        ...(config ? ['--config', config] : []),
        ...(ignoreFile ? ['--ignore-path', ignoreFile] : []),
        ...(apply ? ['--write'] : []),
        ...files,
    ]

    run(cmd, { args }, ({ status }) => {
        if (status === 1 && !apply) {
            log.warn(`Code style issues found in the above file(s).`)
        }

        if (status === 2) {
            log.info(
                'Internal error in Prettier, run with "--verbose" for more information.'
            )
        }
    })
}
