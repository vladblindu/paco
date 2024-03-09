const {omit, arrKeyDiff} = require("./helpers.cjs")

/**
 * @param {object} strings
 * @param {string[]} installedLangs
 * @param {string} file
 * @return void
 */
const checkKeys = (strings, installedLangs, file) => {
    const mk = arrKeyDiff(strings, installedLangs)

    if (mk.length) {
        const miss = mk.length > 1 ? mk.join(", ") : mk[0]
        console.warn(
            `WARNING: The strings file ${file} has following missing language(s): ${miss}. ` +
            "Fix manually or use Fink to fix missing messages")
    }
}

/**
 * @param {object} strings
 * @param {string} defaultLang
 * @param {string[]} installedLangs
 * @param {string} file
 * @return boolean
 */
const checkLangFile = (strings, defaultLang, installedLangs, file) => {
    const restLang = omit(strings, defaultLang)
    checkKeys(strings, installedLangs, file)
    if(!strings[defaultLang]){
        console.warn(
            `WARN: The strings file ${file} does not contain the default language ${defaultLang}. ` +
            "Fix manually or use Fink to fix missing messages. Skipping")
        return false
    }
    Object.keys(strings[defaultLang]).forEach(key => {
        Object.keys(restLang).forEach(
            lang => {
                if (!restLang[lang][key]) {
                    console.warn(
                        `WARNING: The strings file ${file} has following missing key ${key} for language ${lang}. ` +
                        "Fix manually or use Fink to fix missing messages")
                }
            }
        )
    })
    return true
}

module.exports = {
    checkLangFile,
    checkKeys
}