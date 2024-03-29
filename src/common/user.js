const { Guild, Message } = require("discord.js");
const { prisma } = require("../db");

/**
 * A utility class to manage users.
 */
class UserManager {
  /**
   * Bans the user from guild.
   *
   * @param {Guild} guild - The discords guild object.
   * @param {string} reason - The reason for the ban.
   * @param {string} userId - The user's ID.
   *
   * @returns {Promise<string>} Generated ban information.
   */
  async ban(guild, reason, userId) {
    let banInformation = "";

    await guild.bans
      .create(userId, { reason })
      .then((banInfo) => {
        banInformation = `Banned ${
          banInfo.user?.tag ?? banInfo.tag ?? banInfo
        }`;
      })
      .catch(console.error);

    const admins = (await guild.members.fetch()).filter((member) =>
      member.permissions.has("Administrator"),
    );

    for (let admin of admins) {
      const user = admin[1];
      if (user.user.bot) continue;
      await user.send(banInformation);
    }

    return banInformation;
  }

  /**
   * Get the user ID.
   *
   * @param {Message} message - The original text message.
   *
   * @returns {Promise<string>} Return user's ID.
   */
  async getUserId(message) {
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
   * Adds an infraction to the infraction list.
   *
   * @param {Message} message - The original text message.
   * @param {string} word - Word that cuased of infraction.
   * @param {boolean} isAdmin - Check whether the user is an admin.
   *
   * @returns {Promise<string>} Infraction ID
   */
  async addInfraction(message, word, isAdmin) {
    const userId = await this.getUserId(message);

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
      await this.ban(message.guild, `Used "${word}" in chat`, user.discordId);
    }

    return String(infractions.id);
  }

  /**
   * Removes latest infraction from the infraction list.
   * Reduces infractionCount by 1.
   *
   * @param {Message} userId - The users id.
   * @returns {Promise<boolean>} return whether was operation successful
   */
  async removeInfraction(userId) {
    const user = await prisma.user.findUnique({ where: { discordId: userId } });

    if (!user || user.infractionCount <= 0) return false;

    try {
      const latestInfraction = await prisma.infraction.findFirst({
        where: { userId: user.id },
        orderBy: { date: "desc" },
      });

      await prisma.infraction.delete({ where: { id: latestInfraction.id } });
      await prisma.user.update({
        where: { discordId: userId },
        data: { infractionCount: { decrement: 1 } },
      });

      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  /**
   * Reset infractions.
   * Delete all infractions and set infractionCount to 0.
   *
   * @param {string} userId - The users id.
   */
  async resetInfractions(userId) {
    const user = await prisma.user.findUnique({ where: { discordId: userId } });

    if (!user) return false;

    try {
      await prisma.infraction.deleteMany({
        where: {
          userId: user.id,
        },
      });

      await prisma.user.update({
        where: { discordId: userId },
        data: { infractionCount: 0 },
      });

      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}

module.exports = new UserManager();
