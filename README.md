# PACO
### Paraglide Paraglide distributed messages collection utility
#### Version: 1.0.0
![icon100.png](__resources%2Ficon100.png)
#### Repository: https://github.com/vladblindu/paco.git


Usage:
> npm i @mtag-io/paco
> 
> yarn add @mtag-io/paco

This is a small utility package that collects distributed messages json files
scattered allover a project and saves them in the folder and with the format
that [paraglide](https://inlang.com/m/gerre34r/library-inlang-paraglideJs) expects.

>The present utility assumes you have an already installed instance of **paraglide**.

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

#### TODO:
- missing languages and key reporting in terminal should be put in a table. 
Right now it's a mess I agree 💩


There are for sure a lot of other improvements to be made. Please fork and
do whatever you think it would make this little piece of code better and
also file any issue you encounter. I will do my best to fix them.
