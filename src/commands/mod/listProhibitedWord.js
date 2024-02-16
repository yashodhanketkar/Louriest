const { SlashCommandBuilder } = require("discord.js");
const { list } = require("../../common/prohibitedWords.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bannedwords")
    .setDescription("Lists currently prohibited/banned words"),
  execute: list,
};
