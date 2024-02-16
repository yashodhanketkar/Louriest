const { SlashCommandBuilder } = require("discord.js");
const { remove } = require("../../common/prohibitedWords.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unbanword")
    .setDescription("Remove word from the prohibited wordlist.")
    .addStringOption((o) => o.setName("word").setDescription("Word to allow.")),
  execute: remove,
};
