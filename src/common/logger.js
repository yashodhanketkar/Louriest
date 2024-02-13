const { CommandInteraction, Message } = require("discord.js");
const { prisma } = require("../db");
const { TextChannel } = require("discord.js");
/**
 * Log object containing message event details.
 * @typedef {Object} LogType
 * @property {string} type - The type of log (e.g., "MESSAGE").
 * @property {string} name - The name or description of the message event.
 * @property {string} userId - The ID of the user who sent the message.
 * @property {string} author - The username of the user who sent the message.
 * @property {string} date - The date and time when the message event occurred.
 */

/**
 * A utility class for logging interactions and messages in Discord.
 * Logs are sent to a specified channel and stored in a database.
 */
class Logger {
  /**
   * Logs a command interaction in the specified channel and stores it in the database.
   *
   * @param {CommandInteraction} interaction - The Discord interaction instance representing a command.
   */
  async logInteraction(interaction) {
    const channel = interaction.guild.channels.cache.find(
      (c) => c.name === "logs"
    );

    const log = {
      type: "INTERACTION",
      name: interaction.commandName,
      userId: interaction.user.id,
      author: interaction.user.username,
      date: interaction.createdAt,
    };

    await this.processLog(channel, log);
  }

  /**
   * Logs a message event in the specified channel and stores it in the database.
   *
   * @param {Message} message - The Discord message instance representing a message event.
   * @param {string} name - The name or description of the message event.
   */
  async logMessage(message, name) {
    const channel = message.guild.channels.cache.find((c) => c.name === "logs");

    const log = {
      type: "MESSAGE",
      name,
      userId: message.author.id,
      author: message.author.username,
      date: message.createdAt,
    };

    await this.processLog(channel, log);
  }

  /**
   * Logs message to logs channel and store to the database
   *
   * @param {TextChannel} channel - Assigned log channel
   * @param {LogType} log - Log object
   */
  async processLog(channel, log) {
    await channel.send(`${log.author} - **"${log.name}"** - ${log.date}`);
    delete log.author;
    await prisma.log.create({ data: { ...log } });
  }
}

const logger = new Logger();

module.exports = logger;
