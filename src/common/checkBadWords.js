const { prisma } = require("../db/index.js");
// const badWords = ["otaku", "idiot"];

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
 * Check whether message contains word from prohibited wordlist
 *
 * @param {string} word - word to check
 *
 * @returns {Promise<boolean>} returns true if message contains bad word
 */
module.exports.checkBadWords = async function (word) {
  const badWords = await loadBadWords();
  let haveBadWord = false;
  for (let badWord of badWords) {
    if (word.includes(badWord)) {
      haveBadWord = true;
    }
  }

  return haveBadWord;
};
