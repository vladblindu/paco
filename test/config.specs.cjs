const {join} = require("path")
const {describe, it} = require("node:test")
const {
    getAppName,
    getInlangSettingsPath,
    getHostConfig,
    getInstalledLangs,
    getMessagesPathPattern,
    getConfig
} = require("../config.cjs")
const {DEFAULT_INLANG_PATH, DEFAULT_SETTINGS_FILE_NAME} = require("../defaults.json")
const assert = require("node:assert")

const root = join(__dirname, "__fixtures__")

describe("config", () => {

    describe("getAppName", () => {

        it("should extract the app name", () => {
            const appName = getAppName(root)
            assert.strictEqual(appName, "test")
        })

    })

    describe("getInlangSettingsPath", () => {

        it("should get the right inlangSettingsPath with defaults", () => {
            const actual = getInlangSettingsPath(root)
            assert.strictEqual(
                actual,
                join(root, `${DEFAULT_INLANG_PATH}/${DEFAULT_SETTINGS_FILE_NAME}`)
            )
        })

        it("should get the right inlangSettingsPath with options", () => {
            const actual = getInlangSettingsPath(root, {
                inlangPath: "test.inlang",
                settingsFileName: "tSettings.json"
            })
            assert.strictEqual(
                actual,
                join(root, "test.inlang/tSettings.json")
            )
        })
    })

    describe("getHostConfig", () => {

        it("should return the right config file", () => {
            const actual = getHostConfig({root})
            assert.ok(actual.i118n)
        })
    })

    describe("getInstalledLangs", () => {

        const hostConfig = {
            i118n: {
                sourceLanguageTag: "l0",
                restLanguageTags: ["l1", "l2"]
            }
        }

        it("should return the right langs", () => {
            const actual = getInstalledLangs(hostConfig)
            assert.deepEqual(actual, [
                "l0", "l1", "l2"
            ])
        })
    })

    describe("getMessagesPathPattern", () => {
        const hostConfig = {
            i118n: {
                messagesPath: "./test.inlang",
                messagesFilePattern: "{langTag}.json"
            }
        }

        it("should return a valid getMessagesPathPattern", () => {
            const actual = getMessagesPathPattern(hostConfig)
            assert.strictEqual(
                actual,
                "./test.inlang/{langTag}.json"
            )
        })
    })

    describe("getConfig", () => {

        it("should return the right config", () => {

            const configOpts = {
                root,
                configFileName: "test.config.json",
                inlangPath: "test.inlang"
            }
            const actual = getConfig(configOpts)
            const expected = {
                root,
                "i118n": {
                    sourceLanguageTag: "ru",
                    restLanguageTags: [
                        "it",
                        "de"
                    ],
                    messagesFileName: "messages.json",
                    messagesPath: "./test-messages",
                    messagesFilePattern: "{test}.json"
                },
                inlangSettings: {
                    $schema: "https://inlang.com/schema/project-settings",
                    sourceLanguageTag: "en",
                    languageTags: [
                        "en",
                        "ro"
                    ],
                    modules: [],
                    "plugin.inlang.messageFormat": {
                        "pathPattern": "./messages/{languageTag}.json"
                    }
                },
                srcRoot: join(root, "src"),
                messagesPathPattern: "./test-messages/{test}.json",
                installedLangs: [
                    "ru",
                    "it",
                    "de"
                ],
                inlangSettingsPath: join(root, "test.inlang/settings.json")
            }

            assert.deepEqual(actual, expected)
        })
    })
})

