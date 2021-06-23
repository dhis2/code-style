const path = require('path')
const url = require('url')
const log = require('@dhis2/cli-helpers-engine').reporter
const { exit } = require('@dhis2/cli-helpers-engine')
const findup = require('find-up')
const { copy, fileExists, deleteFile } = require('./files.js')
const {
    PROJECT_ROOT,
    CONFIG_DIR,
    TEMPLATE_DIR,
    STYLE_CONFIG_FILES,
} = require('./paths.js')

/**
 * Configuration files that are bundled in the cli-style package.
 * Can be imported from the main entry-point.
 *
 * Used to either resolve the base configuration file to use, or
 * referenced from a template config file when installed in a project.
 */
const packageConfigs = {
    eslint: path.join(CONFIG_DIR, 'eslint.config.js'),
    eslintReact: path.join(CONFIG_DIR, 'eslint-react.config.js'),
    commitlint: path.join(CONFIG_DIR, 'commitlint.config.js'),
    d2Style: path.join(CONFIG_DIR, 'd2-style.config.js'),
    prettier: path.join(CONFIG_DIR, 'prettier.config.js'),
}

/**
 * The configuration files as they should appear when installed into a
 * project.
 */
const projectConfigs = {
    editorconfig: path.join(PROJECT_ROOT, '.editorconfig'),
    eslint: path.join(PROJECT_ROOT, '.eslintrc.js'),
    prettier: path.join(PROJECT_ROOT, '.prettierrc.js'),
    github: {
        dependabot: path.join(PROJECT_ROOT, '.github', 'dependabot.yml'),
        semantic: path.join(PROJECT_ROOT, '.github', 'semantic.yml'),
        stale: path.join(PROJECT_ROOT, '.github', 'stale.yml'),
        'workflow-node': path.join(
            PROJECT_ROOT,
            '.github',
            'workflows',
            'dhis2-verify-node.yml'
        ),
        'workflow-app': path.join(
            PROJECT_ROOT,
            '.github',
            'workflows',
            'dhis2-verify-app.yml'
        ),
        'workflow-lib': path.join(
            PROJECT_ROOT,
            '.github',
            'workflows',
            'dhis2-verify-lib.yml'
        ),
        'workflow-preview-pr': path.join(
            PROJECT_ROOT,
            '.github',
            'workflows',
            'dhis2-preview-pr.yml'
        ),
        'workflow-publish-metadata': path.join(
            PROJECT_ROOT,
            '.github',
            'workflows',
            'dhis2metadata-publish.yml'
        ),
    },
    lslint: path.join(PROJECT_ROOT, '.ls-lint.yml'),
}

/**
 * The template configuration files are the config files that are
 * installed into the project as defined by the projectConfig path.
 *
 * We want to be able to update the packageConfig and have those updates
 * automatically propagate to the projectConfig, so we use these
 * templates to refer to the packageConfigs, which can then be
 * customized in the project.
 *
 * The "base" property to specify a default template to use is special,
 * and used to make it easier for a user, so instead of requiring they
 * write "d2-style add eslint base" we automatically use the base
 * template if they write "d2-style add eslint".
 *
 * See the templateConfig() function for details.
 */
const templateConfigs = {
    editorconfig: path.join(TEMPLATE_DIR, 'editorconfig-base.rc'),
    eslint: {
        base: path.join(TEMPLATE_DIR, 'eslint-base.js'),
        react: path.join(TEMPLATE_DIR, 'eslint-react.js'),
    },
    prettier: path.join(TEMPLATE_DIR, 'prettier-base.js'),
    github: {
        dependabot: path.join(TEMPLATE_DIR, 'github-dependabot.yml'),
        semantic: path.join(TEMPLATE_DIR, 'github-semantic.yml'),
        stale: path.join(TEMPLATE_DIR, 'github-stale.yml'),
        'workflow-node': url.parse(
            'https://raw.githubusercontent.com/dhis2/workflows/master/ci/dhis2-verify-node.yml'
        ),
        'workflow-app': url.parse(
            'https://raw.githubusercontent.com/dhis2/workflows/master/ci/dhis2-verify-app.yml'
        ),
        'workflow-lib': url.parse(
            'https://raw.githubusercontent.com/dhis2/workflows/master/ci/dhis2-verify-lib.yml'
        ),
        'workflow-artifacts': url.parse(
            'https://raw.githubusercontent.com/dhis2/workflows/master/ci/dhis2-artifacts.yml'
        ),
        'workflow-preview-pr': url.parse(
            'https://raw.githubusercontent.com/dhis2/workflows/master/ci/dhis2-preview-pr.yml'
        ),
        'workflow-publish-metadata': url.parse(
            'https://raw.githubusercontent.com/dhis2/workflows/master/ci/dhis2metadata-publish.yml'
        ),
    },
    lslint: path.join(TEMPLATE_DIR, 'ls-lint-base.yml'),
}

/**
 * Add a configuration file to the project based on a template.
 * If there is already a config file, we install a new one next to it
 * with '.new' as the suffix.
 *
 * This allows users to diff old vs. new and see if there are any
 * customizations that need to be brought over.
 */
async function add({ cache, tool, type, overwrite }) {
    const toolConfig = projectConfig(tool, type)
    const toolTemplate = templateConfig(tool, type)

    log.debug('Resolved configuration to add', toolConfig, toolTemplate)

    let template
    if (cache && toolTemplate.href) {
        const cachePath = path.join('workflows', `${tool}-${type}`)
        await cache.get(toolTemplate.href, cachePath, { force: true })
        const exists = await cache.exists(cachePath)
        if (!exists) {
            exit(
                1,
                `Failed to download the ${type} config for ${tool}, and no cached versions exists`
            )
        }
        template = cache.getCacheLocation(cachePath)
    } else {
        template = toolTemplate
    }

    copy(template, toolConfig, { overwrite, backup: true })
}

/**
 * Removes a configuration file based on the tool and/or type used.
 *
 * If path is used, then tool and type are ignored.
 */
function remove({ tool, type, path }) {
    const config = !path ? projectConfig(tool, type) : path

    log.debug('Resolved configuration to remove', config)

    if (fileExists(config)) {
        const result = deleteFile(config)
        result
            ? log.print(`Removed: ${config}`)
            : log.error(`Failed to remove: ${config}`)
    } else {
        log.warn(`Does not exist: ${config}`)
    }
}

const projectConfig = (tool, template) =>
    projectConfigs[tool][template] || projectConfigs[tool]

const templateConfig = (tool, template) =>
    templateConfigs[tool][template] || templateConfigs[tool]

const configured = (tool, template) => fileExists(projectConfig(tool, template))

const resolvedStyleConfig = findup.sync(STYLE_CONFIG_FILES, {
    cwd: PROJECT_ROOT,
    type: 'file',
    allowSymlinks: true,
})
const styleConfig = resolvedStyleConfig ? require(resolvedStyleConfig) : {}

module.exports = {
    configured,
    remove,
    add,
    projectConfig,
    templateConfig,
    projectConfigs,
    templateConfigs,
    packageConfigs,
    styleConfig,
}
