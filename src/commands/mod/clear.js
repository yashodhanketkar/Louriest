const { SlashCommandBuilder } = require("discord.js");

async function getMessages(channel, limit = 0) {
  const messages = await channel.messages.fetch();
  const messageId = messages.map((m) => m.id);

  // return message Id all messages from channel
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
    .setName("mdev")
    .setDescription("Multi dev command for development/testing")
    .addStringOption((o) =>
      o.setName("input").setDescription("The input value")
    ),
  async execute(interaction) {
    const channel = await interaction.channel;
    const userLimit = interaction.options.getString("input") ?? NaN;
    let content = "";

    /*
     * If user enters all, this command will delete all messages.
     * If user enters non-zero numeric value, this command will delete specified number of messages.
     * If both of above conditions fails, this command won't delete any messages.
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

    await interaction.reply({
      content,
      ephemeral: true,
    });
  },
};
