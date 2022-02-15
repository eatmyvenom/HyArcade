interface IConfig {
    key: string;
    mode: string;
    alwaysForce: boolean;
    logRateLimit: boolean;
    watchdogTimeout: number;
    cluster: string;
    sortDirection: string;
    printAllWins: boolean;
    arcadeWinLimit: number;
    cringeGameLowerBound: number;
    cringeGameUpperBound: number;
    showDaytime: boolean;
    commandCharacter: string;
    clusterTarget: string;
    webhook: IWebhook;
    loggingHooks: ILoggingHooks;
    mojang: IMojang;
    std: IStd;
}
interface IWebhook {
    id: string;
    token: string;
    username: string;
    pfp: string;
}
interface ILoggingHooks {
    ignHook: IIgnHook;
    copyHook: ICopyHook;
}
interface IIgnHook {
    id: string;
    token: string;
}
interface ICopyHook {
    id: string;
    token: string;
}
interface IMojang {
    sleep: number;
}
interface IStd {
    disable: boolean;
    out: string;
    err: string;
}

