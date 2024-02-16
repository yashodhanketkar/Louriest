const logger = require("../common/logger");
const { Events, Message } = require("discord.js");
const { checkBadWords } = require("../common/prohibitedWords");
const { addInfraction } = require("../common/user");

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

  if (badWord.haveBadWord) {
    await addInfraction(message, badWord.badWord);
    await message.reply(
      `Warning: ${message.author.displayName} - Use of this word is prohibited`
    );

    await logger.logMessage(message, "Use of prohibited word");
    await message.delete();
  }
}

module.exports = {
  name: Events.MessageCreate,
  execute: executeOnMessage,
};
