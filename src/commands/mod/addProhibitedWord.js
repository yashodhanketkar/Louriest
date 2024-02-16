const { SlashCommandBuilder } = require("discord.js");
const { add } = require("../../common/prohibitedWords.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("banword")
    .setDescription("Add word to the prohibited wordlist.")
    .addStringOption((o) => o.setName("word").setDescription("Word to ban.")),
  execute: add,
};
