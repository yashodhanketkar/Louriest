const { prisma } = require("../db");
const { checkPermission } = require("./checks");
const { setTimeout } = require("node:timers/promises");

/**
 * Returns a list of prohibited words from the database.
 *
 * @returns {Promise<string[]>} - Array of prohibited words.
 */
async function loadBadWords() {
  const docs = await prisma.prohibitedWord.findMany();
  return docs.map((doc) => doc.value);
}

/**
 * A utility class to moderate chat messages.
 */
class ProhibitedWords {
  /**
   * Adds word to the prohibited words list.
   *
   * @param {BaseInteraction} interaction - Discords interaction object.
   */
  async add(interaction) {
    await interaction.deferReply({
      ephemeral: true,
    });
    const hasPermission = await checkPermission(interaction, "ModerateMembers");
    if (!hasPermission) {
      await interaction.editReply({
        content:
          "Failed! You don't have neccessary permissions to perform this action.",
        ephemeral: true,
      });
      return;
    }
    const word = interaction.options.getString("word") ?? "";
    if (word === "") {
      await interaction.editReply({
        content: "Please provide some input",
        ephemeral: true,
      });
      return;
    }
    await setTimeout(200);
    const wordIsPresent = Boolean(
      await prisma.prohibitedWord.findUnique({
        where: {
          value: word,
        },
      })
    );
    if (wordIsPresent) {
      await interaction.editReply({
        content: `${word} is already added to prohibited wordlist`,
        ephemeral: true,
      });
      return;
    }
    await prisma.prohibitedWord.create({
      data: {
        value: word,
      },
    });
    await interaction.editReply({
      content: `${word} added to prohibited wordlist`,
      ephemeral: true,
    });
  }

  /**
   * Removes word from the prohibited words list.
   *
   * @param {BaseInteraction} interaction - Discords interaction object.
   */
  async remove(interaction) {
    await interaction.deferReply({
      ephemeral: true,
    });

    const hasPermission = await checkPermission(interaction, "ModerateMembers");

    if (!hasPermission) {
      await interaction.editReply({
        content:
          "Failed! You don't have neccessary permissions to perform this action.",
        ephemeral: true,
      });
      return;
    }

    const word = interaction.options.getString("word") ?? "";

    if (word === "") {
      await interaction.editReply({
        content: "Please provide valid input",
        ephemeral: true,
      });
      return;
    }

    await setTimeout(200);

    const wordIsPresent = Boolean(
      await prisma.prohibitedWord.findUnique({
        where: {
          value: word,
        },
      })
    );

    if (wordIsPresent) {
      await prisma.prohibitedWord.delete({
        where: {
          value: word,
        },
      });
      await interaction.editReply({
        content: `${word} is removed from prohibited wordlist`,
        ephemeral: true,
      });
      return;
    }

    await interaction.editReply({
      content: `Prohibited wordlist does not contain ${word}`,
      ephemeral: true,
    });
  }

  /**
   * Lists currently prohibited/banned words.
   *
   * @param {BaseInteraction} interaction - Discords interaction object.
   */
  async list(interaction) {
    const badWordList = await loadBadWords();
    let content = "Currently prohibited wordlist is empty.";

    if (badWordList.length === 1) {
      content = `Currently only "${badWordList[0]}" is banned.`;
    } else if (badWordList.length > 1) {
      content = `This is list of current prohibited words\n${
        "[" + badWordList.join(", ") + "]"
      }`;
    }

    await interaction.reply({
      content,
      ephemeral: true,
    });
  }

  /**
   * Object returned by checkBadWords function
   *
   * @typedef {Object} CheckBadWordsObject
   * @property {boolean} haveBadWord - Indicates whether prohibited word is present
   * @property {string} badWord - Return prohibited found or returns ""
   */

  /**
   * Check whether message contains word from the prohibited wordlist.
   *
   * @param {string} message - The message to check.
   *
   * @returns {Promise<CheckBadWordsObject>} returns whether message contains prohibited word
   */
  async checkBadWords(message) {
    const badWords = await loadBadWords();
    let haveBadWord = false;
    let badWordValue = "";
    for (let badWord of badWords) {
      if (message.includes(badWord)) {
        badWordValue = badWord;
        haveBadWord = true;
      }
    }

    return { haveBadWord, badWord: badWordValue };
  }
}

module.exports = new ProhibitedWords();
