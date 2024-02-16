const { BaseInteraction, SlashCommandBuilder } = require("discord.js");
const { RandomGenerator } = require("../../common/getRandom.js");

/**
 * Simulates coin toss
 *
 * @param {BaseInteraction} interaction - Discords interaction object
 */
async function coinToss(interaction) {
  interaction.reply({
    content: `Coin toss result ${RandomGenerator.coinToss()}`,
  });
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("coin")
    .setDescription("Simulates coin toss and replies result"),
  execute: coinToss,
};
