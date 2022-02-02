const { MessageEmbed } = require("discord.js");
const { COLOR_RED, COLOR_SUCCESS, COLOR_YELLOW } = require("./Colors");

exports.ERROR_UNKNOWN = new MessageEmbed()
  .setTitle("ERROR")
  .setColor(COLOR_RED)
  .setDescription("The command you tried to run caused an unknown error!");

exports.ERROR_BLACKLIST = new MessageEmbed()
  .setTitle("ERROR")
  .setColor(COLOR_RED)
  .setDescription("You are not allowed to use any commands since you are blacklisted from using the bot!");

exports.ERROR_NEED_PLAYER = new MessageEmbed()
  .setTitle("ERROR")
  .setColor(COLOR_RED)
  .setDescription("The player you specified does not seem to exist!");

exports.ERROR_UNLINKED = new MessageEmbed()
  .setTitle("ERROR")
  .setColor(COLOR_RED)
  .setDescription("No account was able to be resolved from your input.");

exports.ERROR_API_DOWN = new MessageEmbed()
  .setTitle("ERROR")
  .setColor(COLOR_RED)
  .setDescription("Due to a hypixel api outage all commands are disabled to prevent errors.");

/**
 * For when someone has not put their discord tag into hypixel correctly
 */
exports.ERROR_LINK_HYPIXEL_MISMATCH = new MessageEmbed()
  .setTitle("ERROR")
  .setDescription(
    "Your discord tag does not match your hypixel set discord account. In order to link you must set your discord in hypixel to be your exact tag. Read [this](https://docs.hyarcade.xyz/bots/Verify) to see a more detailed explanation.",
  )
  .setColor(COLOR_RED);

exports.ERROR_LINK_HYPIXEL_MISMATCH_AUTO = new MessageEmbed()
  .setTitle("ERROR")
  .setDescription(
    "Your discord tag does not match your hypixel set discord account. In order to link you must set your discord in hypixel to be your exact tag. Read [this](https://docs.hyarcade.xyz/bots/auto-verify) to see a more detailed explanation.",
  )
  .setColor(COLOR_RED);

exports.ERROR_LINK_HYPIXEL_MISMATCH_MW = new MessageEmbed()
  .setTitle("ERROR")
  .setDescription(
    "Your discord tag does not match your hypixel set discord account. In order to link you must set your discord in hypixel to be your exact tag. Read [this](https://docs.hyarcade.xyz/bots/mw-verify) to see a more detailed explanation.",
  )
  .setColor(COLOR_RED);

/**
 * Account link was successful
 */
exports.INFO_LINK_SUCCESS = new MessageEmbed()
  .setTitle("Success")
  .setDescription("Account linked successfully!")
  .setColor(COLOR_SUCCESS);

exports.ERROR_INPUT_IGN = new MessageEmbed()
  .setTitle("ERROR")
  .setDescription(
    "Input a name or uuid to link your discord to! Read [this](https://docs.hyarcade.xyz/bots/Verify) to see a more detailed explanation.",
  )
  .setColor(COLOR_RED);

exports.ERROR_INPUT_IGN_MW = new MessageEmbed()
  .setTitle("ERROR")
  .setDescription(
    "Input a name or uuid to link your discord to! Read [this](https://docs.hyarcade.xyz/bots/mw-verify) to see a more detailed explanation.",
  )
  .setColor(COLOR_RED);

exports.ERROR_IGN_UNDEFINED = new MessageEmbed()
  .setTitle("ERROR")
  .setDescription("The ign you specified does not exist or has been changed.")
  .setColor(COLOR_RED);

exports.ERROR_PLAYER_PREVIOUSLY_LINKED = new MessageEmbed()
  .setTitle("ERROR")
  .setDescription("This player has already been linked!")
  .setColor(COLOR_RED);

exports.ERROR_ACCOUNT_PREVIOUSLY_LINKED = new MessageEmbed()
  .setTitle("ERROR")
  .setDescription("This user has already been linked!")
  .setColor(COLOR_RED);

exports.ERROR_NO_LEADERBOARD = new MessageEmbed()
  .setTitle("ERROR")
  .setDescription(
    "Sorry that leaderboard is not availiable. Go to [this page](https://docs.hyarcade.xyz/bots/Leaderboards) to see what is available.",
  )
  .setColor(COLOR_RED);

exports.WARN_WAITING = new MessageEmbed()
  .setTitle("Waiting...")
  .setDescription(
    "Since the the database does not contain the account(s) it will take some time to gather the stats. Please wait!",
  )
  .setThumbnail("https://i.imgur.com/GLdqYB2.gif")
  .setColor(COLOR_YELLOW)
  .setFooter({
    text: "Please avoid using this unless they should actually be in the database, too many people slows down the overall system.",
  });

exports.INFO_HOW_TO_SLASH = new MessageEmbed()
  .setTitle("Incorrect usage...")
  .setColor(COLOR_YELLOW)
  .setDescription(
    "Having trouble with slash commands? Read [this article](https://support.discord.com/hc/en-us/articles/1500000368501-Slash-Commands-FAQ) for help!",
  );
