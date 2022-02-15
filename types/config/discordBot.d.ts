interface IDiscordBot {
    arcadeBot: IArcadeBot;
    miniWallsBot: IMiniWallsBot;
    testBot: ITestBot;
}
interface IArcadeBot {
    key: string;
    allEnabled: boolean;
}
interface IMiniWallsBot {
    key: string;
    lbMsg: string;
    enabled: IEnabled;
}
interface IEnabled {
    guilds: string[];
    channels: string[];
}
interface ITestBot {
    key: string;
    allEnabled: boolean;
}

