const { MessageComponentInteraction } = require("discord.js");

/**
 * 
 * @param {MessageComponentInteraction} interaction 
 * @returns {Promise<boolean>}
 */
module.exports = async function ForceOGuser (interaction) {
  const og = interaction?.message?.interaction?.user?.id;
  const current = interaction.user.id;
  if(current == og) {
    return true;
  } else if (og == undefined) {
    return true;
  }

  await interaction.reply({
    content: `Only <@${og}> can use this! Run /${interaction.message.interaction.commandName} to do this.`,
    ephemeral: true
  });
  return false;
};
