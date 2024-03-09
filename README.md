# Paco
### Paraglide distributed messages collection utility

![icon100.png](__resources%2Ficon100.png)

This is a small utility package that collects distributed messages json files
scattered allover a project and saves them in the folder and with the format
that [paraglide](https://inlang.com/m/gerre34r/library-inlang-paraglideJs) expects.

Paraglide expects a single file per language, which may not be very useful if you
want to re-utilise a piece (let's say a component). That's why, you may just add a **languagePattern**
file (ex: messages.json) in the specific part/component's folder, and it will end up in
the expected **paraglide** folder after execution.

Before the collection, this utility:

- checks the **{app_name}.config.json** file presence in the root directory
- if found, it checks for an **i118n** key
- if found, it expects the following data to be present:

```json
 {
  "i118n":{
    "sourceLanguageTag": "en",
    "restLanguageTags": [
      "fr",
      "es"
    ],
    "messagesFileName": "messages.json",
    "messagesPath": "__resources/messages",
    "messagesFilePattern": "{languageTag}.json"
  }
}
```

The utility will also check the available languages and entry keys in all collected files
warning about missing ones,