const { SlashCommandBuilder } = require("discord.js");
const { setTimeout } = require("node:timers/promises");
const { prisma } = require("../../db/index.js");
const { BaseInteraction } = require("discord.js");

/**
 * Lists currently prohibited/banned words
 *
 * @param {BaseInteraction} interaction - Discords interaction object
 */
async function addToProhibitedWords(interaction) {
  const badWordList = "[" + (await loadBadWords()).join(", ") + "]";
  await interaction.reply({
    content: `This is list of current prohibited words\n${badWordList}`,
    ephemeral: true,
  });
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bannedwords")
    .setDescription("Lists currently prohibited/banned words"),
  execute: addToProhibitedWords,
};
