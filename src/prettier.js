const prettier = require('prettier')
const path = require('path')

const log = require('@dhis2/cli-helpers-engine').reporter

const { readFile, writeFile } = require('./files.js')

// Prettier setup
const prettierConfig = path.join(__dirname, '../config/prettier.config.js')

log.debug('Prettier configuration file', prettierConfig)

/**
 * This a checker used by {run-js} and needs to follow a specific
 * format.
 *
 * @param {string} file File path
 * @param {string} text Content of File
 * @param {boolean} apply Write autofixes to disk
 * @return {Object} object with messages and output
 */
module.exports = (file, text, apply = false) => {
    const name = path.basename(file)

    const response = {
        messages: [],
        output: '',
    }

    try {
        const options = prettier.resolveConfig.sync(file, {
            editorconfig: false,
            config: prettierConfig,
        })

        if (text.startsWith('#!')) {
            const firstNL = text.indexOf('\n')
            const hashbang = text.slice(0, firstNL + 1)
            const rest = text.slice(firstNL, -1)
            const restFormatted = prettier.format(rest, {
                ...options,
                filepath: file,
            })
            response.output = hashbang.concat(restFormatted)
        } else {
            response.output = prettier.format(text, {
                ...options,
                filepath: file,
            })
        }

        if (!apply && text !== response.output) {
            response.messages.push({
                checker: 'prettier',
                rule: 'code-style',
                message: 'Not formatted according to standards.',
            })
        }
    } catch (error) {
        log.error(`Prettier format failed with error:\n${error}`)
        process.exit(1)
    }

    return response
}
