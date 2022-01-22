const Account = require("hyarcade-requests/types/Account");

/**
 * 
 * @param {*} oldObj 
 * @param {*} newObj 
 * @returns {*}
 */
function subtractNumbers (oldObj, newObj) {
  for(const val in oldObj) {
    if(typeof oldObj[val] == "number") {
      oldObj[val] -= newObj?.[val] ?? 0;
    } else if(typeof oldObj?.[val] == "object") {
      oldObj[val] = subtractNumbers(oldObj?.[val] ?? 0, newObj?.[val] ?? 0);
    }
  }

  return oldObj;
}

/**
 * 
 * @param {Account} oldAcc 
 * @param {Account} newAcc 
 * @returns {Account}
 */
function AccountComparitor (oldAcc, newAcc) {
  return subtractNumbers(oldAcc, newAcc);
}

module.exports = AccountComparitor;