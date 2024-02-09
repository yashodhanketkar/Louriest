const { SlashCommandBuilder } = require("discord.js");

/*
 * This command is used for testing purpose.
 * New commands are created and tested with this command before bulk registration
 */

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dev")
    .setDescription("Dev command for development/testing"),
  async execute(interaction) {
    await interaction.reply("Pong!");
  },
};
