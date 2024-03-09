const {describe, it} = require("node:test")
const assert = require("node:assert")
const {arrKeyDiff, makeMessagePath, parseArgs} = require("../helpers.cjs")
const {appArgs} = require("../config.cjs")


describe("helpers", () => {

    describe("arrKeysDiff", () => {

        it("should report the no missing keys", () => {
            const a1 = {a: 1, b: 2, c: 3}
            const a2 = ["a", "b", "c"]
            const actual = arrKeyDiff(a1, a2)
            assert.strictEqual(actual.length, 0)
        })

        it("should report the missing keys", () => {
            const a1 = {a: 1, b: 2, c: 3}
            const a2 = ["a", "b", "c", "d", "e"]
            const actual = arrKeyDiff(a1, a2)
            console.log(actual)
            assert.deepEqual(actual, ["d", "e"])
        })
    })

    describe("makeMessagePath", () => {

        it("should create the right path", () => {
            const pat = "./test.inlang/{languageTag}.json"
            const lang = "en"
            const expected = "./test.inlang/en.json"
            assert.strictEqual(
                makeMessagePath(pat, lang),
                expected
            )
        })
    })

    describe("parseArgs", () => {

        const expected = {
            help: true,
            version: true,
            config: "test.config.json",
            root: "./",
            srcRoot: "./src",
            inlangDir: "./test.inlang",
            settingsFileName: "test.settings.json"
        }

        it("should parse valid short args", () => {
            process.argv = [
                "node",
                "helpers.specs.cjs",
                "-h",
                "-v",
                "-c", "test.config.json",
                "-r", "./",
                "-R", "./src",
                "-i", "./test.inlang",
                "-s", "test.settings.json"
            ]

            const expected = {
                help: true,
                version: true,
                config: "test.config.json",
                root: "./",
                srcRoot: "./src",
                inlangDir: "./test.inlang",
                settingsFileName: "test.settings.json"
            }
            const actual = parseArgs(appArgs)
            assert.deepEqual(actual, expected)
        })

        it("should parse valid long args", () => {
            process.argv = [
                "node",
                "helpers.specs.cjs",
                "--help",
                "--version",
                "--config", "test.config.json",
                "--root", "./",
                "--srcRoot", "./src",
                "--inlangDir", "./test.inlang",
                "--settingsFileName", "test.settings.json"
            ]
            const actual = parseArgs(appArgs)
            assert.deepEqual(actual, expected)
        })
    })
})