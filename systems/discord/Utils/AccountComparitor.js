const { DeepSubtract } = require("@hyarcade/helpers-objects");
const { Account } = require("@hyarcade/structures");

/**
 *
 * @param {Account} oldAcc
 * @param {Account} newAcc
 * @returns {Account}
 */
function AccountComparitor(oldAcc, newAcc) {
  return DeepSubtract(oldAcc, newAcc);
}

module.exports = AccountComparitor;
