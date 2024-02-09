const { SlashCommandBuilder, BaseInteraction } = require("discord.js");

/**
 * Replies with user information
 *
 * @param {BaseInteraction} interaction - Discords interaction object
 */
async function userInformation(interaction) {
  const user = interaction.user;
  const joinedAt = interaction.member.joinedAt;

  await interaction.reply(
    `This command was run by ${
      user.username
    }, who joined on ${joinedAt}. ${user.avatarURL()}`
  );
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Provides server information."),
  execute: userInformation,
};
