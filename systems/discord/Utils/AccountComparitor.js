const { Account } = require("@hyarcade/account");
const { DeepSubtract } = require("@hyarcade/helpers-objects");

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
