const { SlashCommandBuilder } = require("discord.js");
const { checkPermission } = require("../../common/checkPermissions");

async function getMessages(channel, limit = 0) {
  const messages = await channel.messages.fetch();
  const messageId = messages.map((m) => m.id);

  // return message Id of all messages from channel
  if (limit === 0) return messageId;

  /*
   * Checks if limit is greater than number of messages
   * If true, set possibleLimit to number of messages in channel
   * If false, set possibleLimit to users limit
   */
  const possibleLimit = limit > messageId.len ? messageId.len : limit;
  return messageId?.slice(0, possibleLimit);
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Multi dev command for development/testing")
    .addStringOption((o) =>
      o.setName("limit").setDescription("Number of messages to delete.")
    ),
  async execute(interaction) {
    const channel = await interaction.channel;

    await interaction.deferReply({
      ephemeral: true,
    });

    // checks for neccessary permissions to delete the message
    const hasPermission = await checkPermission(interaction, "ManageMessages");

    if (!hasPermission) {
      await interaction.editReply({
        content:
          "Failed! You don't have neccessary permissions to perform this action.",
        ephemeral: true,
      });
      return;
    }

    const userLimit = interaction.options.getString("limit") ?? NaN;
    let content = "";

    /*
     * If user enters all, this command will delete all messages.
     * If user enters non-zero numeric value, this command will delete specified number of messages.
     * If both of these conditions fails, this command won't delete any messages.
     */
    if (userLimit === "all") {
      await channel.bulkDelete(await getMessages(channel));
      content = "All messages are deleted";
    } else {
      const limit = parseInt(Number(userLimit));
      if (limit) {
        await channel.bulkDelete(await getMessages(channel, limit));
        content = `${limit} ${limit === 1 ? "message" : "messages"} deleted`;
      } else {
        content = `No message has been deleted.\n"${userLimit}" is invalid input`;
      }
    }

    await require("node:timers/promises").setTimeout(200);

    await interaction.reply({
      content,
      ephemeral: true,
    });
  },
};
