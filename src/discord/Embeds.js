const cfg = require("../../Config").fromJSON();

exports.waiting = new MessageEmbed()
    .setTitle("Waiting...")
    .setDescription(
        "Since the the database does not contain the account(s) it will take some time to gather the stats. Please wait!"
    )
    .setThumbnail("https://i.imgur.com/GLdqYB2.gif")
    .setColor(0xdcde19)
    .setFooter(
        "Please avoid using this unless they should actually be in the database, too many people slows down the overall system."
    );

exports.accsAdded = new MessageEmbed()
    .setTitle("Accounts added")
    .setDescription(res)
    .setFooter(
        "It will take a little while for these accounts to be fully added to the database, please be patient."
    )
    .setTimestamp(Date.now())
    .setColor(0x44a3e7);

exports.errIptIgn = new MessageEmbed()
    .setTitle("ERROR")
    .setDescription(
        `Input a name or uuid to link your discord to! Use ${cfg.commandCharacter}help for more info on how to use the verify command.`
    )
    .setColor(0xff0000);

exports.errIgnNull = new MessageEmbed()
    .setTitle("ERROR")
    .setDescription(`The ign you specified does not exist or has been changed.`)
    .setColor(0xff0000);

exports.errPlayerLinked = new MessageEmbed()
    .setTitle("ERROR")
    .setDescription("This player has already been linked!")
    .setColor(0xff0000);

exports.errAccLinked = new MessageEmbed()
    .setTitle("ERROR")
    .setDescription("This user has already been linked!")
    .setColor(0xff0000);

exports.linkSuccess = new MessageEmbed()
    .setTitle("Success")
    .setDescription(`${player} linked successfully!`)
    .setColor(0x00d492);

exports.errHypixelMismatch = new MessageEmbed()
    .setTitle("ERROR")
    .setDescription(
        "Your discord tag does not match your hypixel set discord account. In order to link you must set your discord in hypixel to be your exact tag. If you are confused then just try linking via the hystats bot since it uses the same mechanism."
    )
    .setColor(0xff0000);
