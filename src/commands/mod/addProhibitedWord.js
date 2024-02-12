const { SlashCommandBuilder } = require("discord.js");
const { checkPermission } = require("../../common/checkPermissions");
const { setTimeout } = require("node:timers/promises");
const { prisma } = require("../../db/index.js");
const { BaseInteraction } = require("discord.js");

/**
 * Add word to the prohibited words list
 *
 * @param {BaseInteraction} interaction - Discords interaction object
 */
async function addToProhibitedWords(interaction) {
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
  const word = interaction.options.getString("input") ?? "";
  if (word === "") {
    await interaction.editReply({
      content: "Please provide some input",
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
    await interaction.editReply({
      content: `${word} is already added to prohibited wordlist`,
      ephemeral: true,
    });
    return;
  }
  await prisma.prohibitedWord.create({
    data: {
      value: word,
    },
  });
  await interaction.editReply({
    content: `${word} added to prohibited wordlist`,
    ephemeral: true,
  });
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("banword")
    .setDescription("Add word to the prohibited wordlist.")
    .addStringOption((o) => o.setName("word").setDescription("Word to ban.")),
  execute: addToProhibitedWords,
};
