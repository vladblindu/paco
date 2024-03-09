const {join, resolve} = require("path")
const defaults = require("./defaults.json")
const {exists} = require("./helpers.cjs")

const PACKAGE_JSON = "package.json"

const {
    SOURCE_ROOT,
    DEFAULT_INLANG_PATH,
    DEFAULT_SETTINGS_FILE_NAME
} = defaults

const appArgs = {
    // Args
    "--help": Boolean,
    "--version": Boolean,
    "--config": String,
    "--root": String,
    "--srcRoot": String,
    "--inlangDir": String,
    "--settingsFileName": String,

    // Aliases
    "-h": "--help",
    "-v": "--version",
    "-c": "--config",
    "-r": "--root",
    "-R": "--srcRoot",
    "-i": "--inlangDir",
    "-s": "--settingsFileName"
}

/**
 * @param {Package} pkg
 * @return {string}
 */
const helpScreen = (pkg) => `
${pkg.name.toUpperCase()} - ${pkg.description} 
Usage:
    --help or -h for this help screen
    --version or -v for the version of the cli
    --config or -c to specify a different host config file
    --root or -r to specify a different root dir
    --srcRoot or -R to specify a different src root dir
    --inlangDir or -i to specify a different paraglide config dir
    --settingsFileName or -i to specify a different paraglide settings file
 
    Defaults:
        root: cwd
        config: ./{host-app-name}.config.json
        srcRoot: src
        inlangDir: "project.inlang"
        settingsFilename: "settings.json"

For more detailed information see the documentation at: 
${pkg.repository}
`

/**
 * @param {string} root - The root directory of the application.
 * @returns {string} - The name of the application.
 */
const getAppName = (root) => {
    const pth = join(root, PACKAGE_JSON)
    return exists(pth) && require(pth).name
}

/**
 * @param {ConfigOpts} opts
 * @return {HostConfig}
 */
const getHostConfig = (opts) => {
    if (!opts.root) {
        console.error("ERROR: No root option specified in: getHostConfig function. Aborting")
        process.exit(1)
    }
    const pth = join(opts.root, opts.config || `${getAppName(opts.root)}.config.json`)
    return exists(pth) && require(pth)
}


/**
 * @param {string} root - The root directory to use as the base for the full path.
 * @param {Partial<ConfigOpts>?} opts - Optional settings object.
 * @returns {string} - The full path of the Inlang settings file.
 */
const getInlangSettingsPath = (root, opts = {}) =>
    join(root,
        opts.inlangDir || DEFAULT_INLANG_PATH,
        opts.settingsFileName || DEFAULT_SETTINGS_FILE_NAME)

/**
 * @param {string} inlangSettingsPath - The path to the inlang settings file.
 * @returns {InlangSettings} - The inlang settings object.
 */
const getInlangSettings = (inlangSettingsPath) =>
    exists(inlangSettingsPath) && require(inlangSettingsPath)

/**
 * @param {PartialHostConfig} hostConfig - The host configuration object.
 * @returns {string[]} - The list of installed language tags.
 */
const getInstalledLangs = hostConfig => [
    hostConfig.i118n.sourceLanguageTag,
    ...hostConfig.i118n.restLanguageTags
]

/**
 * @param {HostConfig} hostConfig - The host's configuration object.
 * @returns {string} The generated path pattern for messages.
 */
const getMessagesPathPattern = hostConfig =>
    `${hostConfig.i118n.messagesPath}/${hostConfig.i118n.messagesFilePattern}`

/**
 * @param {ConfigOpts?} opts
 * @return {Config}
 */
const getConfig = (opts ) => {
    const root = resolve(opts.root)
    const hostConfig = getHostConfig(opts)
    const inlangSettingsPath = getInlangSettingsPath(root, opts)
    const inlangSettings = getInlangSettings(inlangSettingsPath)
    const srcRoot = join(root, opts.sourceRoot || SOURCE_ROOT)
    const messagesPathPattern = getMessagesPathPattern(hostConfig)
    const installedLangs = getInstalledLangs(hostConfig)
    return {
        root,
        ...hostConfig,
        inlangSettings,
        srcRoot,
        messagesPathPattern,
        installedLangs,
        inlangSettingsPath
    }
}

module.exports = {
    appArgs,
    getConfig,
    getAppName,
    getInlangSettingsPath,
    getHostConfig,
    getInstalledLangs,
    getMessagesPathPattern,
    helpScreen
}