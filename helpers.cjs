const fs = require("fs")

/**
 * @param {object} a1
 * @param {string[]} a2
 * @return string[]
 */
const arrKeyDiff = (a1, a2) =>
    a2.filter(k => !a1[k])

/**
 * @param {object} o
 * @param {string} key
 * @return {Record<string, any>}
 */
const omit = (o, key) => {
    const tmp = {...o}
    delete tmp[key]
    return tmp
}

/**
 * @param {string} pth
 * @param {object} o
 * @returns {void}
 */
const writeJson = (pth, o) => {
    console.log(`INFO: Writing file: ${pth}`)
    fs.writeFileSync(pth, JSON.stringify(o, null, 2))
}

/**
 * @param {string} srcRoot - The root directory to search for message files.
 * @param {string} pattern - The file pattern to match for message files.
 * @returns {string[]} - An array of message file paths matching the pattern.
 */
const collectMessageFiles = (srcRoot, pattern) => {
    /** @type string[] */
    const files = fs.readdirSync(srcRoot, {recursive: true})
    if (!files.length) {
        console.warn(`WARN: ${srcRoot} looks empty. Are you sure this is the targeted directory?`)
        process.exit(1)
    }
    const messageFiles = files.filter(f => f.endsWith(pattern))
    if (!messageFiles.length) {
        console.warn(`WARN: No message files ending in ${pattern} found in ${srcRoot}. Aborting.`)
        process.exit(1)
    }
    return messageFiles
}

/**
 * Checks if a file system item exists.
 * @param {string} pth - The path of the file system item to check.
 * @param {boolean?} strict=true - Indicates whether to abort the process if the item is not found.
 * @returns {true | void} true if the item exists
 */
const exists = (pth, strict = true) => {
    if (!fs.existsSync(pth)) {
        console.error(`ERROR: File system item not found: ${pth}`)
        if (strict) {
            console.error("Process aborted")
            process.exit(1)
        }
        return true
    }
    return true
}
/**
 * Replaces a placeholder in a given pattern with a language code.
 * @param {string} pattern - The pattern containing the placeholder.
 * @param {string} lang - The language code to replace the placeholder with.
 * @returns {string} - The modified pattern with the placeholder replaced.
 */
const makeMessagePath = (pattern, lang) =>
    pattern.replace(/{(.*?)}/, lang)

module.exports = {
    arrKeyDiff,
    omit,
    collectMessageFiles,
    exists,
    writeJson,
    makeMessagePath
}