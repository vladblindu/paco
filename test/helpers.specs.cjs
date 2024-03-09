const {describe, it} = require("node:test")
const assert = require("node:assert")
const {arrKeyDiff, makeMessagePath} = require("../helpers.cjs")


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
})