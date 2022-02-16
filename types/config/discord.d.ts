interface IDiscord {
    token: string;
    backupToken?: string;
    miniToken: string;
    mwToken: string;
    testToken: string;
    trustedUsers: string[];
    miniWalls: IMiniWalls;
    logChannel: string;
    errChannel: string;
    cmdChannel: string;
    verifyChannel: string;
    statusHook: string;
    leaderboards: ILeaderboards;
    lbarchive: ILbarchive;
    presences: IPresencesItem[];
    setup: ISetup;
}
interface IMiniWalls {
    lbMsg: string;
    guilds: string[];
    channels: string[];
}
interface ILeaderboards {
    bd: string;
    bh: string;
    dw: string;
    es: string;
    fh: string;
    fb: string;
    gw: string;
    hns: string;
    hitw: string;
    hs: string;
    miw: string;
    pg: string;
    pp: string;
    to: string;
    z: string;
    c: string;
    g: string;
}
interface ILbarchive {
    lifetime: ILifetime;
    monthly: IMonthly;
    weekly: IWeekly;
}
interface ILifetime {
    bd: string;
    bh: string;
    dw: string;
    es: string;
    fh: string;
    fb: string;
    gw: string;
    hns: string;
    hitw: string;
    hs: string;
    miw: string;
    pg: string;
    pp: string;
    to: string;
    z: string;
    c: string;
    g: string;
}
interface IMonthly {
    bd: string;
    bh: string;
    dw: string;
    es: string;
    fh: string;
    fb: string;
    gw: string;
    hns: string;
    hitw: string;
    hs: string;
    miw: string;
    pg: string;
    pp: string;
    to: string;
    z: string;
    c: string;
    g: string;
}
interface IWeekly {
    bd: string;
    bh: string;
    dw: string;
    es: string;
    fh: string;
    fb: string;
    gw: string;
    hns: string;
    hitw: string;
    hs: string;
    miw: string;
    pg: string;
    pp: string;
    to: string;
    z: string;
    c: string;
    g: string;
}
interface IPresencesItem {
    activities: IActivitiesItem[];
    status: string;
}
interface IActivitiesItem {
    name: string;
    type: string;
}
interface ISetup {
    bot: IBot;
    mini: IMini;
    test: ITest;
    mw: IMw;
}
interface IBot {
    username: string;
    icon: string;
}
interface IMini {
    username: string;
    icon: string;
}
interface ITest {
    username: string;
    icon: string;
    presences: IPresencesItem[];
}
interface IMw {
    username: string;
    icon: string;
    presences: IPresencesItem[];
}

