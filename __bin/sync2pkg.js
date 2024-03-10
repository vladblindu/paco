#!/usr/bin/env node

const fs = require("fs")
const path = require("path")
const {fileURLToPath} = require("node:url")

/**
 * Sync README.md to app name, description and version
 * from the package.json.
 * This utility is meant to be hooked to the git hooks.
 * It assumes that the file location in a location bellow the
 * app's package.json file
 */

/**
 * @param {URL|string} urlOrPath
 * @returns {string}
 */
const toPath = urlOrPath => urlOrPath instanceof URL
    ? fileURLToPath(urlOrPath)
    : urlOrPath

/**
 * @return {string}
 */
const findUpPkg = () => {

    const name = "package.json"
    const cwd = process.cwd()
    const type = "file"

    let directory = path.resolve(toPath(cwd) ?? "")
    const {root} = path.parse(directory)
    while (directory && directory !== root) {
        const filePath = path.isAbsolute(name) ? name : path.join(directory, name)

        try {
            const stats = fs.statSync(filePath, {throwIfNoEntry: false})
            if ((type === "file" && stats?.isFile()) || (type === "directory" && stats?.isDirectory())) {
                return filePath
            }
        } catch {
            console.error(`ERROR: Could not find a package.json file in ${cwd}` +
                "'s upper file system's directories \n.Aborting")
            process.exit(1)
        }

        directory = path.dirname(directory)
    }
}

const resourcesDir = "__resources"
const readmeIcon = "icon100.png"
const README = "README.md"

/**
 * @typdef Package
 * @property {string} name
 * @property {string} description
 * @property {string} version
 * @property {string} repository
 * */

/**
 * @return {string}
 */
const getPkgPath = () => {
    const pkgPth = findUpPkg()
    return path.dirname(pkgPth)
}

/**
 * @param {Package} pkg
 * @return {string}
 */

const readmeHeader = pkg =>
    `# ${pkg.name.toUpperCase()}
### ${pkg.description}
#### Version: ${pkg.version}
![${readmeIcon}](${resourcesDir}%2F${readmeIcon})
#### Repository: ${pkg.repository}

`

/**
 * Replaces the header of a README file with a new header generated from package information.
 *
 * @param {string} readme - The content of the README file as a string.
 * @param {Package} pkg - The package.json content
 * @returns {string} - The updated content of the README file as a string.
 */
const replaceReadmeHeader = (readme, pkg) =>
    readmeHeader(pkg) + readme.split("\n").slice(6).join("\n")

const run = () => {
    console.log("Running sync2pkg - syncing info with data in package.json")
    const root = getPkgPath()
    const pkgPath = path.join(root, "package.json")
    const readmePath = path.join(root, README)

    const pkg = require(pkgPath)

    const readme = fs.readFileSync(readmePath, "utf-8")
    console.log(`Sync ${readmePath}`)

    const newReadme = replaceReadmeHeader(readme, pkg)
    fs.writeFileSync(readmePath, newReadme)

    console.log("OK")
}

run()