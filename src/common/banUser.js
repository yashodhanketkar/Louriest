const { Guild } = require("discord.js");

/**
 * Bans the user from guild
 *
 * @param{Guild} guild - Message from user
 * @param{string} reason - Reason for ban
 * @param {string} userId - Id of user
 *
 * @returns {Promise<string>} Generated banInfo
 */
module.exports = async function (guild, reason, userId) {
  let banInformation = "";

  guild.bans
    .create(userId, { reason })
    .then((banInfo) => {
      banInformation = `Banned ${banInfo.user?.tag ?? banInfo.tag ?? banInfo}`;
      console.log(banInformation);
    })
    .catch(console.error);

  return banInformation;
};
