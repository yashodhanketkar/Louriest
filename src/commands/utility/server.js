const { SlashCommandBuilder, BaseInteraction } = require("discord.js");

/**
 * Replies with server information
 *
 * @param {BaseInteraction} interaction - Discords interaction object
 */
async function serverInformation(interaction) {
  await interaction.reply(
    `This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members.`
  );
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("server")
    .setDescription("Provides server information."),
  execute: serverInformation,
};
