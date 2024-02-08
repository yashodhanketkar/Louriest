const { SlashCommandBuilder } = require("discord.js");
const { InteractionType } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Provides server information."),

  /**
   * @param {InteractionType} interaction
   */
  async execute(interaction) {
    await interaction.reply(
      `This command was run by ${interaction.user.username}, who joined on ${
        interaction.member.joinedAt
      }.
${interaction.user.avatarURL()}
`
    );
  },
};
