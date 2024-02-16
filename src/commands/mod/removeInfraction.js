const { SlashCommandBuilder } = require("discord.js");
const UserManager = require("../../common/user.js");
const { checkPermission } = require("../../common/checks.js");

async function removeInfraction(interaction) {
  const hasPermission = await checkPermission(interaction, "ModerateMembers");
  if (!hasPermission) {
    await interaction.reply({
      content:
        "Failed! You don't have neccessary permissions to perform this action.",
      ephemeral: true,
    });
    return;
  }

  let content = "Error: Operation failed";
  const userId = (await interaction.options.getString("userid")) ?? NaN;

  if (userId && (await UserManager.removeInfraction(userId))) {
    content = "Successfully removed latest infraction";
  }

  await interaction.reply({
    content,
    ephemeral: true,
  });
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("removeinfraction")
    .setDescription("Remove the latest infraction from records.")
    .addStringOption((o) => o.setName("userid").setDescription("Users ID.")),
  execute: removeInfraction,
};
