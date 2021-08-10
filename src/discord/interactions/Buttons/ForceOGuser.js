module.exports = async function ForceOGuser (interaction) {
  const og = interaction.message.interaction.user.id;
  const current = interaction.user.id;
  if(current == og) {
    return true;
  }

  await interaction.reply({
    content: `Only <@${og}> can use this!`,
    ephemeral: true
  });
  return false;
};
