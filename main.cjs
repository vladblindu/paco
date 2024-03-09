const {join} = require("path")
const {getConfig} = require("./config.cjs")
const {
    writeJson,
    collectMessageFiles,
    makeMessagePath,
} = require("./helpers.cjs")
const {checkLangFile} = require("./check.cjs")

/**
 * @param {Config & {write?: WriteJson} | {}} [opts]
 */
const updateInlangSettings = (opts = {}) => {
    console.log("Updating the paraglide settings file...")
    const tmp = {
        ...opts.inlangSettings
    }
    // transfer default lang
    tmp.sourceLanguageTag = opts.i118n.sourceLanguageTag ?? tmp.sourceLanguageTag
    // transfer root and messages patter format
    tmp["plugin.inlang.messageFormat"] = opts.messagesPathPattern || tmp["plugin.inlang.messageFormat"]
    // transfer installed langs
    tmp.languageTags = opts.installedLangs || tmp.languageTags
    try {
        (opts.write || writeJson)(opts.inlangSettingsPath, tmp)
        console.log("OK")
    } catch (err) {
        console.error(`ERROR: Unable to write inlang settings file in: ${opts.inlangSettingsPath}`)
        console.error("Reason: ", err)
        process.exit(1)
    }
}

// create a unique object containing all collected message files
const compactLangContent = fileData =>
    fileData.reduce(
        (acc, langCont) => {
            Object.keys(langCont).forEach(k => {
                acc[k] = {
                    ...acc[k],
                    ...langCont[k]
                }
            })
            return acc
        }, {}
    )

/**
 * @description write the resulting language files in to the paraglide expected folder
 * @param {object} fileData
 * @param {Config} config - write key serves for mock testing only
 * @param {WriteJson?} write
 * write is present only for testing purposes
 */
const writeMessagesData = (fileData, config, write = writeJson) => {
    const messagesData = compactLangContent(fileData)
    Object.keys(messagesData).forEach(lang => {
        const pth = makeMessagePath(config.messagesPathPattern, lang)
        write(pth, messagesData[lang])
    })
}

/**
 * @param {ConfigOpts} [opts]
 * @param {WriteJson?} write
 * write is present only for testing purposes
 */
function main(opts, write = writeJson) {
    const config = getConfig(opts)
    const fileData = collectMessageFiles(config.srcRoot, config.i118n.messagesFileName)
        .reduce((acc, f) => {
            const pth = join(config.srcRoot, f)
            const langCont = require(pth)
            if (checkLangFile(langCont, config.i118n.sourceLanguageTag, config.installedLangs, f))
                acc.push(langCont)
            return acc
        }, [])
    writeMessagesData(fileData, config, write)
}

module.exports = {
    updateInlangSettings,
    collectMessageFiles,
    compactLangContent,
    writeMessagesData,
    main
}
