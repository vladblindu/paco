const {join} = require("path")
const {describe, it} = require("node:test")
const assert = require("node:assert")
const {
    updateInlangSettings,
    compactLangContent,
    writeMessagesData,
    main
} = require("../main.cjs")

const testConfig = require("./__fixtures__/test.config.json")

const messages1 = require("./__fixtures__/src/dir1/messages.json")
const messages2 = require("./__fixtures__/src/dir2/dir21/messages.json")
const messages3 = require("./__fixtures__/src/dir3/dir31/dir311/messages.json")

const compactExpected = require("./__fixtures__/compact.expected.json")
const {makeMessagePath} = require("../helpers.cjs")
const {getMessagesPathPattern} = require("../config.cjs")

describe("updateInlangSettings", () => {

    it("should update settings and write to file", () => {

        const expected = {
            $schema: "test-schema",
            sourceLanguageTag: "ru",
            "plugin.inlang.messageFormat": {
                pathPattern: "./testMsg/{test}.json"
            },
            languageTags: ["ru", "de", "it"],
            modules: []
        }

        const mockWrite = (path, settings) => {
            assert.strictEqual(path, config.inlangSettingsPath)
            assert.deepEqual(settings, expected)
        }

        const config = {
            i118n: {
                sourceLanguageTag: "ru",
                restLanguageTags: ["de", "it"],
                messagesFileName: "msf.json",
                messagesPath: "./testMsg",
                messagesPathPattern: "{test}.json",
            },
            installedLangs: ["ru", "de", "it"],
            inlangSettingsPath: "test.inlang",
            inlangSettings: {
                $schema: "test-schema",
                sourceLanguageTag: "ru",
                "plugin.inlang.messageFormat": {
                    pathPattern: "./testMsg/{test}.json"
                },
                languageTags: ["de", "it"],
                modules: []
            },
            write: mockWrite
        }

        updateInlangSettings(config)
    })
})

describe("compactLangContent", () => {

    it("should compact the lang data", () => {

        const fileData = [
            {
                ...messages1
            },
            {
                ...messages2
            },
            {
                ...messages3
            }
        ]

        const actual = compactLangContent(fileData)
        assert.deepStrictEqual(actual, compactExpected)
    })
})

describe("writeMessagesData", () => {

    it("should write valid paraglide format message", () => {

        const fileData = [
            {
                ...messages1
            },
            {
                ...messages2
            },
            {
                ...messages3
            }
        ]

        const messagesPathPattern = "./test.inlang/{languageTag}.json"

        const tmp = Object.keys(messages1).map(
            lang => ({
                pth: makeMessagePath(messagesPathPattern, lang),
                data: {
                    ...messages1[lang],
                    ...messages2[lang],
                    ...messages3[lang],
                }
            })
        )

        const mockWrite = (pth, data) => {
            const pthIdx = tmp.findIndex(item => item.pth === pth)
            assert.deepEqual(tmp[pthIdx].data, data)
            tmp.splice(pthIdx, 1)
        }

        const opts = {
            messagesPathPattern,
        }

        // noinspection JSCheckFunctionSignatures
        writeMessagesData(fileData, opts, mockWrite)
        assert.strictEqual(tmp.length, 0)
    })
})

describe("main", () => {

    it("should collect all messages files and write valid output", () => {

        const configOpts = {
            root: join(__dirname, "__fixtures__"),
            config: "./main-test.config.json",
            inlangDir: "./test.inlang"
        }

        const pattern = getMessagesPathPattern(testConfig)

        const tmp = Object.keys(messages1).map(
            lang => ({
                pth: makeMessagePath(pattern, lang),
                data: {
                    ...messages1[lang],
                    ...messages2[lang],
                    ...messages3[lang],
                }
            })
        )

        const mockWrite = (pth, data) => {
            const pthIdx = tmp.findIndex(
                item =>
                    item.pth === pth
            )
            assert.deepEqual(tmp[pthIdx].data, data)
            tmp.splice(pthIdx, 1)
        }

        main(configOpts, mockWrite)

        assert.strictEqual(tmp.length, 0)
    })
})