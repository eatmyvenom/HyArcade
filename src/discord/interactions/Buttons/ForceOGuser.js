module.exports = async function ForceOGuser(interaction) {
    let og = interaction.message.interaction.user.id;
    let current = interaction.user.id;
    if(current == og) {
        return true;
    }

    await interaction.reply({ content: `Only <@${og}> can use these buttons.`, ephemeral: true });
    return false;
}