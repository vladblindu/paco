const {join} = require("path")
const fs = require("fs")
const {existsSync} = require("fs")
const {describe, it, beforeEach, afterEach} = require("node:test")
const assert = require("assert")
const {run} = require("../main.cjs")
const {i118n} = require("./__fixtures__/run.config.json")

const noEmptyStrings = o => Object.values(o).every(e => typeof e === "string" && e.length)

describe("e2e", () => {

    const root = join(__dirname, "__fixtures__")
    const messagePath = join(root, i118n.messagesPath)

    const cleanUp = () => {
        console.log("Cleaning up.")
        if (existsSync(messagePath)) {
            fs.rmSync(
                messagePath,
                {recursive: true, force: true}
            )
            fs.mkdirSync(messagePath)
        }
    }

    beforeEach(cleanUp)
    afterEach(cleanUp)

    it("should do the trick 😂", () => {

        cleanUp()

        process.argv = [
            "node",
            "e2e.specs.cjs",
            "-r", root,
            "-c", "run.config.json",
            "-i", "test.inlang"
        ]
        // run teh app
        run()

        const langs = [
            i118n.sourceLanguageTag,
            ...i118n.restLanguageTags
        ]

        langs.forEach(lang => {
            const pth = join(messagePath, `${lang}.json`)
            assert(existsSync(pth))
            const langCont = require(pth)
            assert.deepEqual(Object.keys(langCont), [
                "about_us",
                "contact_us",
                "work_with_us",
                "services",
                "welcome",
                "home",
                "products",
                "team",
                "careers",
                "blog",
                "shop",
                "feedback",
                "support",
                "faq",
                "newsletter"
            ])
            assert.strictEqual(noEmptyStrings(langCont), true)
        })
    })
})