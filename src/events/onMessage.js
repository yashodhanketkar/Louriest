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

  if (await checkBadWords(message.content)) {
    await message.reply(
      `Warning: ${message.author.displayName} - Use of this word is prohibited`
    );
    console.log(message.author);
    await message.delete();
    return;
  }
}

module.exports = {
  name: Events.MessageCreate,
  execute: executeOnMessage,
};
