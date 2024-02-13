const { SlashCommandBuilder } = require("discord.js");
const { checkPermission } = require("../../common/checkPermissions");
const { setTimeout } = require("node:timers/promises");
const { prisma } = require("../../db/index.js");
const { BaseInteraction } = require("discord.js");

/**
 * Remove word from the prohibited words list
 *
 * @param {BaseInteraction} interaction - Discords interaction object
 */
async function removeFromProhibitedWords(interaction) {
  await interaction.deferReply({
    ephemeral: true,
  });

  const hasPermission = await checkPermission(interaction, "ModerateMembers");

  if (!hasPermission) {
    await interaction.editReply({
      content:
        "Failed! You don't have neccessary permissions to perform this action.",
      ephemeral: true,
    });
    return;
  }

  const word = interaction.options.getString("word") ?? "";

  if (word === "") {
    await interaction.editReply({
      content: "Please provide valid input",
      ephemeral: true,
    });
    return;
  }

  await setTimeout(200);

  const wordIsPresent = Boolean(
    await prisma.prohibitedWord.findUnique({
      where: {
        value: word,
      },
    })
  );

  if (wordIsPresent) {
    await prisma.prohibitedWord.delete({
      where: {
        value: word,
      },
    });
    await interaction.editReply({
      content: `${word} is removed from prohibited wordlist`,
      ephemeral: true,
    });
    return;
  }

  await interaction.editReply({
    content: `Prohibited wordlist does not contain ${word}`,
    ephemeral: true,
  });
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unbanword")
    .setDescription("Remove word from the prohibited wordlist.")
    .addStringOption((o) => o.setName("word").setDescription("Word to allow.")),
  execute: removeFromProhibitedWords,
};
