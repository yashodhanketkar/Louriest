const { BaseInteraction, SlashCommandBuilder } = require("discord.js");
const { RandomGenerator } = require("../../common/getRandom.js");

/**
 * Simulates dice toss
 *
 * @param {BaseInteraction} interaction - Discords interaction object
 */
async function diceRoll(interaction) {
  interaction.reply({
    content: `Dice roll result ${RandomGenerator.diceRoll()}`,
  });
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dice")
    .setDescription("Simulates dice roll and replies result"),
  execute: diceRoll,
};
