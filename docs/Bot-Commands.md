# Arcade bot commands (/)

### Syntax
Each point listed here is a command. Everything in the `< >` is a required argument and everything in the `[ ]` is optional.
If you are verified you can use "!" in any `<player>` input to resolve to yourself.

### Commands
* `stats <player> [game] [time]` - Get somebodys stats in an arcade game, if you don't choose a player and you are linked it will give your stats.
* `leaderboard <category> <stat> [type] [start]` - Get some arcade related leaderboard. The options are auto generated, if you try to use an option that does not show up in the list it will not work.
* `top-games <player> [time]` - Gets the top games won of a specific player. If a time is specified then it gets only the games won within that time period.
* `status <player>` - Displays current whereabouts of any player.
* `compare <player1> <player2> <game>` - Compare two players in arcade games.
* `whois <player>` - Shows information about how a player may be recognized.
* `party-games <player> [game] [time]` - Shows a players party games stats including all stats from each minigame.
* `zombies <player>` - Zombies specific stats since there are so many.
* `verify <player>` - Link yourself to the arcade bot using your hypixel IGN. Your discord tag needs to be set in hypixel for this to work. If you find yourself unable to do this look [here](./bots/Verify) for a more detailed explanation.
* `add-account <accounts>` - Add an account to the database. The database is the way that the leaderboards work and therefore I have this command open so people can add relavent players to the database. 
* `info` - Gives you some relavent links to all of the different areas of HyArcade.
* `arcade` - A command group for lesser used commands.
  * `help` - Links you to this site.
  * `ez` - ez?
  * `ping` - Gets bots status and some info about the health of the bot.
  * `database` - Shows info about the database the bot uses.
  * `unverify` - Deletes your discord id from the database if you are linked.
  * `verify` - Link yourself to the arcade bot using your hypixel IGN. Your discord tag needs to be set in hypixel for this to work. If you find yourself unable to do this, look [here](./bots/Verify) for a more detailed explanation.
  * `leaderboard <category> <stat> [type] [start]` - Get some arcade related leaderboard. The options are auto generated, if you try to use an option that does not show up in the list it will not work.
  * `stats <player> [game] [time]` - Get somebodys stats in an arcade game, if you don't choose a player and you are linked it will give your stats.
  * `achievements <player> [game]` - Show a players Arcade Games achievement completion.
  * `info` - Gives you some relavent links to all of the different areas of HyArcade.
  * `game-counts` - Show how many people are currently playing all arcade games.
  * `get-data-raw <player> <path>` - Gets raw data from the Hyarcade database for a player.

# Text Commands (a!)

### DISCLAIMER:
I do not provide support in any way for using text commands, if you are having trouble then use the slash commands.

* `stats <player> [game] [time]` - Get somebodys stats in an arcade game, if you don't choose a player and you are linked it will give your stats.
* `leaderboard <game> <timetype> [amount] [start]` - Get some arcade related leaderboard. The game options are documented [here](./bots/Leaderboards).
* `whois <player>` - Shows information about how a player may be recognized.
* `getraw <player> <path>` - Gets raw data from the Hyarcade database for a player.
* `apiraw <player> <path>` - Returns raw stats from the hypixel api.
* `top-games <player> [time]` - Gets the top games won of a specific player. If a time is specified then it gets only the games won within that time period.
* `lastupdate` - Shows the last time the database was refreshed.
* `dbinfo` - Give basic info about the bots database
* `ping` - Gets bots status and some info about the health of the bot.
* `help` - Links you to this site.
* `info` - Gives you some relavent links to all of the different areas of HyArcade.
* `ez` - EZ!