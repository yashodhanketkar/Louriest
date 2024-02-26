const logger = require("../common/logger");
const { Events, Message } = require("discord.js");
const { checkBadWords } = require("../common/prohibitedWords");
const UserManager = require("../common/user");

/**
 * Handles if prohibited word is used
 *
 * @param {Message} message - The message from the user.
 * @param {string} badWord - Word that cuased this event
 */
async function handleProhibitedWord(message, badWord) {
  const user = message.guild.members.cache.get(message.author.id);
  const isAdmin = user.permissions.has("Administrator");

  await UserManager.addInfraction(message, badWord, isAdmin);
  await message.reply(
    `Warning: ${message.author.displayName} - Use of this word is prohibited`,
  );

  await logger.logMessage(message, "Use of prohibited word");
  await message.delete();
}

/**
 * Executes actions on received messages from users.
 * If the message contains a prohibited word:
 *   - The message will be deleted.
 *   - The user will receive a warning.
 *
 * @param {Message} message - The message from the user.
 */
async function executeOnMessage(message) {
  if (message.author.bot) return;

  const badWord = await checkBadWords(message.content);

  if (badWord.haveBadWord) await handleProhibitedWord(message, badWord.badWord);
}

module.exports = {
  name: Events.MessageCreate,
  execute: executeOnMessage,
};
