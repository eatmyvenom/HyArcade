exports.help = `Get info on how to use commands and what they do. 
Using this with another argument for a command will give more data on how to use the command`;

exports.verify = `Link your discord to your account

To link your discord first has to be set in your hypixel social media.
To set this do the following:
Go to lobby -> Click the player head -> Click "Social Media" -> Click discord -> put your discord tag in the chat.`;

exports.link = `Link a minecraft account to a discord ID. This is only for trusted users as it means that any discord account can be linked to any minecraft account

The linking process takes some time to merge a players discord data with their hypixel data, please allow 5-10 minutes of time before complaining about it.`;

exports.newacc = `Add an account by name or uuid to the database. This should not be used for just random people you find, if you do that and add people who will just end up slowing down the whole system you will be blacklisted from using the bot.`;

exports.stats = `Give the general arcade stats of a player. If the arcade game argument is filled then it also adds stats from that game. If something looks wrong thats probably because it is, the hypixel api isn't exactly known for providing accurate data. I apologize if this is the case but there is not much at all that can be done about it.`;

exports.unlinkedstats = `Give the general arcade stats of a player not in the database. Please don't use this over and over, it slows down the database from updating which is annoying to say the least.`;

exports.status = `Get the current status of a player in the database.`;

exports.lb = `Get the current leaderboard from most arcade games, type refers to a time type, this can be either "daily" "weekly" "monthly" or "lifetime" with shorter version available.

Due to the hypixel api not having time based data, this data is based on my own database at a previous point in time. Due to this issue, people added within the week/month/day will not show up until the start of the next time period. This isn't something I can do much about.`;

exports.games = `use any of these with the leaderboard or stats command 
- party
- farmhunt
- hysays
- hitw
- miniwalls
- football
- enderspleef
- throwout
- galaxywars
- dragonwars
- bounty
- blockingdead
- hide
- zombies
- ctw
- pixelpainters
- easter
- grinch
- scuba
- halloween

There are also short versions availiable`;

exports.getraw = `Get the raw data from a field of a player in the database. The field is what is stored in my database internally. Therefore the field names probably won't make sense. This command is really only here for me so I can make sure someones stats aren't messed up.`;

exports.names = `Get the name history of someone. This only returns the names that they have used on hypixel. If they never logged on with a name they once had then it will not show up.`;

exports.whois = `Check the discord link of a player. If the person is not linked then it will just say "undefined" instead of their id and mention.`;

exports.searching = 
`The bot searches for a player by going down a list of possiblilites for who a player can be it goes through each of these until one of them returns a valid account

1) If the input is 18 characters long then it tries to get the account whos discord ID matches the input.
2) If the input is 16 characters or less in length it tries to get the account whos ign matches the input.
3) If the input is longer than 16 characters then it tries to get the account whos uuid matches the input.
4) If the input is 16 characters or less in length it tries to get the account whos name starts with the input.
5) If the input is 22 characters in length (a ping on mobile) it tries to get the account whos discord ID matches the ID specified in the ping
6) If the input is 21 characters in length (a ping on desktop) it tries to get the account whos discord ID matches the ID specified in the ping
7) It iterates through each previous name of each account and checks if the name starts with the input.
8) If the result is allowed to be the executing user it gets the account whos discord ID matches the user who sent the command.
9) After all of that it just gets the uuid from the ign from mojang api and then gets the stats from hypixel`;

exports.Role_Handling =
`Every time the database updates its data it sets a flag in the shared runtime file. Every 10 seconds the process handling the bot checks this file for that flag. If the flag is detected then it goes through every discord with a role handler and grabs all the members. For every member if their discord ID matches an account in the bots database (basically if they are linked) it checks that role handlers specific stat against the role of the account. It iterates the roles top down, if the account doesn't have above a specific win count it moves on to the next win count. When it finds the win count role appropriate for the user it checks if they have the role already, if so then it moves on the next person. If the correct role is not assigned then it assigns it. It then goes through the rest of the win count roles and makes sure they are not set. If there is another win count role set then it removes it from the user and then moves on to the next person.`

