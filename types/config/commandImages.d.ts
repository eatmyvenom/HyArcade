interface ICommandImages {
    profile: IProfile;
    topGames: ITopGames;
    leaderboard: ILeaderboard;
    gameStats: IGameStats;
}
interface IProfile {
    file: string;
    overlay: string;
}
interface ITopGames {
    file: string;
    overlay: string;
}
interface ILeaderboard {
    file: string;
    overlay: string;
}
interface IGameStats {
    file: string;
    overlay: string;
}

