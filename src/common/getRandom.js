/**
 * A misc class for generating random choices or values.
 */
class RandomGenerator {
  /**
   * Generates a random integer between a specified range.
   *
   * @param {number} [min=0] - The minimum value of the range.
   * @param {number} [max=1] - The maximum value of the range.
   *
   * @returns {number} - A random integer within the specified range.
   */
  core = function (min = 0, max = 1) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  /**
   * @returns {string} returns either heads or tails.
   */
  coinToss = () => {
    return this.core(0, 1) ? "heads" : "tails";
  };

  /**
   * @returns {Number} Returns integer value between 1 or 6.
   */
  diceRoll = () => this.core(1, 6);

  /**
   * @returns {Number} Returns integer value between 1 or 4.
   */
  optionGuesser = () => this.core(1, 4);
}

module.exports.RandomGenerator = new RandomGenerator();
