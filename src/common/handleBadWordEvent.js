const { prisma } = require("../db/index.js");
const { Message } = require("discord.js");
const banUser = require("./banUser.js");

/**
 * Get user id
 *
 * @param {Message} message - Original text message
 *
 * @returns {Promise<string>} Infraction ID
 */
async function getUserId(message) {
  // gets user object from database
  let user = await prisma.user.findUnique({
    where: {
      discordId: String(message.author.id),
    },
  });

  // user are only added to database if they have commited infractions
  // if user not present in database create new user
  if (!user) {
    user = await prisma.user.create({
      data: {
        discordId: message.author.id,
        infractionCount: 0,
      },
    });
  }
  return String(user.id);
}

/**
 * Adds infraction to infraction list
 *
 * @param {Message} message - Original text message
 * @param {string} word - Word that cuased of infraction
 * @param {boolean} isAdmin - Check whether user is admin
 *
 * @returns {Promise<string>} Infraction ID
 */
module.exports.addInfraction = async function (message, word, isAdmin) {
  const userId = await getUserId(message);

  await prisma.user.update({
    where: { id: userId },
    data: { infractionCount: { increment: 1 } },
  });

  const user = await prisma.user.findUnique({ where: { id: userId } });

  // gets prohibited word object from database
  const prohibitedWord = await prisma.prohibitedWord.findUnique({
    where: { value: word },
  });

  const infractions = await prisma.infraction.create({
    data: {
      message: message.content,
      date: message.createdAt,
      userId,
      prohibitedWordId: String(prohibitedWord.id),
    },
  });

  if (!isAdmin && user.infractionCount > 2) {
    await banUser(message.guild, `Used "${word}" in chat`, user.discordId);
  }

  return String(infractions.id);
};
