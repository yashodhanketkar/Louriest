const { BaseInteraction, SlashCommandBuilder } = require("discord.js");

/**
 * Replies a fact about cats.
 *
 * @param {BaseInteraction} interaction - Discords interaction object
 */
async function catfact(interaction) {
  const factObject = await fetch("https://catfact.ninja/fact")
    .then((res) => res.json())
    .catch((error) => console.error(error));

  await interaction.reply({
    content: factObject.fact,
  });
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("catfact")
    .setDescription("Replies with a fact about cats."),
  execute: catfact,
};
