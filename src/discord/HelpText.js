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
