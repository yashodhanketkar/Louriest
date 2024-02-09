const { Events } = require("discord.js");

/**
 * Prints message once bot is connected
 *
 * @param {Client} client - Client instance
 */
async function executeOnConnect(client) {
  console.log(`Ready! Logged in as ${client.user.tag}`);
}

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute: executeOnConnect,
};
