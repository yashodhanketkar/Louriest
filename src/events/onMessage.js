const { addInfraction } = require("../common/handleBadWordEvent");
const { checkBadWords } = require("../common/checkBadWords");
const { Events, Message } = require("discord.js");

/**
 * Checks message from users
 * If message contains prohibited word
 *   - message will be deleted
 *   - user will get a warning
 *
 * @param {Message} message - message from user
 */
async function executeOnMessage(message) {
  if (message.author.bot) return;

  const badWord = await checkBadWords(message.content);

  if (badWord.haveBadWord) {
    await addInfraction(message, badWord.badWord);
    await message.reply(
      `Warning: ${message.author.displayName} - Use of this word is prohibited`
    );

    await message.delete();
  }
}

module.exports = {
  name: Events.MessageCreate,
  execute: executeOnMessage,
};
