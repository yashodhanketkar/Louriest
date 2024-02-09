const { SlashCommandBuilder, BaseInteraction } = require("discord.js");

/**
 * Replies with Pong!
 *
 * @param {BaseInteraction} interaction - Discords interaction object
 */
async function replyPong(interaction) {
  await interaction.reply("Pong!");
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with ping!"),
  execute: replyPong,
};
