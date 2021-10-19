# Arcade bot commands (/)

### Whats this
Each point listed here is a command. Everything in the `< >` is a required argument and everything in the `[ s]` is optional.
There are other commands that are not listed here, this is intentional as they are most likely not useful for most people.

### Commands
* `stats <player> [game] [time]` - Get somebodys stats in an arcade game, if you don't choose a player and you are linked it will give your stats.
* `leaderboard <game> <timetype> [amount] [start]` - Get some arcade related leaderboard. The game options are documented [here](./bots/Leaderboards).
* `whois <player>` - Shows information about how a player may be recognized.
* `status <player>` - Displays current whereabouts of any player.
* `compare <player1> <player2> <game>` - Compare two players in arcade games.
* `profile <player>` - Generates an image with arcade info for a specific player.
* `top-games <player> [time]` - Gets the top games won of a specific player. If a time is specified then it gets only the games won within that time period.
* `add-account <accounts>` - Add an account to the database. The database is the way that the leaderboards work and therefore I have this command open so people can add relavent players to the database. 
* `zombies <player>` - Zombies specific stats since there are so many.
* `arena <player>` - Overall arena stats because why not.
* `paintball <player>` - Overall paintball stats because why not.
* `quake <player>` - Overall quake stats because why not.
* `verify <player>` - Link yourself to the arcade bot using your hypixel IGN. Your discord tag needs to be set in hypixel for this to work. If you find yourself unable to do this look [here](./bots/Verify) for a more detailed explanation.
* `info` - Gives you some relavent links to all of the different areas of HyArcade.
* `arcade` - A command group for lesser used commands.
  * `ez` - ez?
  * `help` - Links you to this site.
  * `ping` - Gets bots status and some info about the health of the bot.

# Other arcade bot commands (a!)

* `stats <player> [game] [time]` - Get somebodys stats in an arcade game, if you don't choose a player and you are linked it will give your stats.
* `leaderboard <game> <timetype> [amount] [start]` - Get some arcade related leaderboard. The game options are documented [here](./bots/Leaderboards).
* `whois <player>` - Shows information about how a player may be recognized.
* `getraw <player> <path>` - Gets raw data from the Hyarcade database for a player.
* `apiraw <player> <path>` - Returns raw stats from the hypixel api.
* `profile <player>` - Generates an image with arcade info for a specific player.
* `top-games <player> [time]` - Gets the top games won of a specific player. If a time is specified then it gets only the games won within that time period.
* `lastupdate` - Shows the last time the database was refreshed.
* `dbinfo` - Give basic info about the bots database
* `ping` - Gets bots status and some info about the health of the bot.
* `help` - Links you to this site.
* `info` - Gives you some relavent links to all of the different areas of HyArcade.
* `ez` - EZ!