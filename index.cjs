const arg = require("arg")
const {main} = require("./main.cjs")
const {getAppName} = require("./config")

const appArgs = {
    // Args
    "--help": Boolean,
    "--version": Boolean,
    "--config": String,
    "--root": String,
    "--srcRoot": String,
    "--inlangPath": String,
    "--settingsFileName": String,

    // Aliases
    "-h": "--help",
    "-v": "--version",
    "-c": "--config",
    "-r": "--root",
    "-R": "--srcRoot",
    "-i": "--inlangPath",
    "-s": "--settingsFileName"
}
const helpScreen = `
Usage:
    --help or -h for this help screen
    --version or -v for the version of the cli
    --config or -c to specify a different host config file
    --root or -r to specify a different root dir
    --srcRoot or -R to specify a different src root dir
    --inlangPath or -i to specify a different paraglide config dir
    --settingsFileName or -i to specify a different paraglide settings file
 
    Defaults:
        root: cwd
        config: ./{host-app-name}.config.json
        srcRoot: src
        inlangPath: "project.inlang"
        settingsFilename: "settings.json"

For more detailed information see the documentation at: 

`
main()