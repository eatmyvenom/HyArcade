# Arcade bot commands (/)
* `stats [player] [game]` - Get somebodys stats in an arcade game, if you don't choose a player and you are linked it will give your stats.
* `leaderboard <game> [timetype] [amount] [start]` - Get some arcade related leaderboard. The game options are documented [here](./bots/Leaderboards).
* `add-account <accounts>` - Add an account to the database. The database is the way that the leaderboards work and therefore I have this command open so people can add relavent players to the database. 
* `name-history [player]` - Gets the hypixel name history of a player. This name history is based only on the names they have logged on to hypixel with.
* `whois [player]` - Gets discord link for a specific account.
* `get-data-raw <path> [player]` - Gets some specific field from an account. This is based on my database format which can be previewed [here](https://github.com/eatmyvenom/hyarcade-requests/blob/main/types/Account.js).
* `verify <player>` - Link yourself to the arcade bot using your hypixel IGN. Your discord tag needs to be set in hypixel for this to work. If you find yourself unable to do this look [here](./bots/Verify) for a more detailed explanation.
* `game-counts [game]` - Gets the amounts of players in various arcade games.
* `info` - Gives you some relavent links to all of the different areas of HyArcade.
* `compare <player1> [player2] [game]` - Compare two players in an arcade game.
* `profile [player]` - Generates an image with cool info about a specific player.
* `top-games [player] [time]` - Gets the top games won of a specific player. If a time is specified then it gets only the games won within that time period.
* `zombies [player]` - Zombies specific stats since there are so many.
* `arcade` - A command group for lesser used commands.
  * `ez` - ez!
  * `help` - Links you to this site.
  * `ping` - Gets bots status and some info about the health of the bot.
  * `lastupdate` - Gets the last time the database refreshed in UTC.

# Other arcade bot commands (%)

* `ping` - Gets bots status and some info about the health of the bot.
* `help` - Links you to this site.
* `info` - Gives you some relavent links to all of the different areas of HyArcade.
* `ez` - EZ!