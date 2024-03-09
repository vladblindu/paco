const {describe, it} = require("node:test")
const {checkLangFile} = require("../check.cjs")
const assert = require("node:assert")
const testData = require("./__fixtures__/src/dir1/messages.json")

describe("check", () => {

    describe("checkLangFile", () => {

        it("should return expected result for specific input", () => {

            let msg = 0

            const safeLog = console.warn

            console.warn = () => {
                msg++
            }

            checkLangFile(
                testData,
                "en",
                ["en", "fr", "it", "de", "es"],
                "about_us.json"
            )

            assert.strictEqual(msg, 0)

            console.warn = safeLog
        })

        it("should return expected result for specific input", () => {

            const incompleteTestData = {
                "en": {
                    "about_us": "About us",
                    "contact_us": "Contact us",
                    "work_with_us": "Work with us",
                    "services": "Our services",
                    "welcome": "Welcome to our website!"
                },
                "fr": {
                    "about_us": "À propos de nous",
                    "contact_us": "Contactez-nous",
                    "work_with_us": "Travailler avec nous",
                    "welcome": "Bienvenue sur notre site Web!"
                },
                "it": {
                    "about_us": "Riguardo a noi",
                    "work_with_us": "Lavora con noi",
                    "services": "I nostri servizi",
                    "welcome": "Benvenuto nel nostro sito Web!"
                },
                "de": {
                    "about_us": "Über uns",
                    "contact_us": "Kontaktiere uns",
                    "work_with_us": "Arbeite mit uns",
                    "services": "Unsere Dienstleistungen",
                    "welcome": "Willkommen auf unserer Website!"
                }
            }

            let msg = []

            const expected = [
                "WARNING: The strings file about_us.json has following missing language(s): es. Fix manually or use Fink to fix missing messages",
                "WARNING: The strings file about_us.json has following missing key contact_us for language it. Fix manually or use Fink to fix missing messages",
                "WARNING: The strings file about_us.json has following missing key services for language fr. Fix manually or use Fink to fix missing messages"
            ]

            const safeLog = console.warn

            console.warn = m => {
                msg.push(m)
            }

            checkLangFile(
                incompleteTestData,
                "en",
                ["en", "fr", "it", "de", "es"],
                "about_us.json"
            )

            assert.deepEqual(msg, expected)

            console.warn = safeLog
        })
    })
})