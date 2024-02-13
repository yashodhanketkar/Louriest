const { prisma } = require("../db/index.js");

/**
 * Returns list of prohibited word from database
 *
 * @returns {Promise<string[]>}
 */
async function loadBadWords() {
  const docs = await prisma.prohibitedWord.findMany();
  return docs.map((doc) => doc.value);
}

/**
 * Return type of checkBadWords function
 * @typedef {Object} CheckBadWordsObject
 *
 * @property {boolean} haveBadWord - Indicates whether prohibited word is present
 * @property {string} badWord - Return prohibited found or returns ""
 */

/**
 * Check whether message contains word from prohibited wordlist
 *
 * @param {string} word - word to check
 *
 * @returns {Promise<CheckBadWordsObject>} returns true if message contains bad word
 */
module.exports.checkBadWords = async function (word) {
  const badWords = await loadBadWords();
  let haveBadWord = false;
  let badWordValue = "";
  for (let badWord of badWords) {
    if (word.includes(badWord)) {
      badWordValue = badWord;
      haveBadWord = true;
    }
  }

  return { haveBadWord, badWord: badWordValue };
};

module.exports.loadBadWords = loadBadWords;
