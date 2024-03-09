const {join, resolve} = require("path")
const defaults = require("./defaults.json")
const {exists} = require("./helpers.cjs")

const PACKAGE_JSON = "package.json"

const {
    DEFAULT_ROOT,
    SOURCE_ROOT,
    DEFAULT_INLANG_PATH,
    DEFAULT_SETTINGS_FILE_NAME
} = defaults

/**
 * @param {string} root - The root directory of the application.
 * @returns {string | void} - The name of the application.
 */
const getAppName = root => {
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
    const pth = join(opts.root, opts.configFileName || `${getAppName(opts.root)}.config.json`)
    return exists(pth) && require(pth)
}


/**
 * @param {string} root - The root directory to use as the base for the full path.
 * @param {Partial<ConfigOpts>?} opts - Optional settings object.
 * @returns {string} - The full path of the Inlang settings file.
 */
const getInlangSettingsPath = (root, opts = {}) =>
    join(root,
        opts.inlangPath || DEFAULT_INLANG_PATH,
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
    const root = resolve(opts.root || DEFAULT_ROOT)
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
    getConfig,
    getAppName,
    getInlangSettingsPath,
    getHostConfig,
    getInstalledLangs,
    getMessagesPathPattern
}