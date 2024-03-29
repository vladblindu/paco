type Inlang = {
    sourceLanguageTag?: string
    restLanguageTags?: string[]
    messagesFileName?: string
    messagesPath?: string
    messagesFilePattern?: string
}

type HostConfig = {
    i118n: Inlang
};

type PluginMessageFormat = {
    pathPattern: string;
};

type InlangSettings = {
    $schema: string
    sourceLanguageTag: string
    languageTags: string[]
    modules: string[]
    "plugin.inlang.messageFormat": PluginMessageFormat
}

type WriteJson = (pth: string, o: object) => void

type ConfigOpts = {
    root: string
    sourceRoot?: string
    inlangDir?: string
    settingsFileName?: string,
    config?: string
}

type PartialHostConfig = Partial<HostConfig>

type Config = {
    root: string
    i118n: Inlang
    inlangSettings?: InlangSettings
    srcRoot: string
    messagesPathPattern: string
    installedLangs: string[]
    inlangSettingsPath: string,
}

type Package = {
    name: string,
    version: string,
    description: string,
    author?: string
    repository?: string
}