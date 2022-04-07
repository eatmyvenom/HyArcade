/**
 *
 * @param {object} oldObj
 * @param {object} newObj
 * @returns {object}
 */
function DeepSubtract(oldObj, newObj) {
  for (const val in oldObj) {
    if (typeof oldObj[val] === "number") {
      oldObj[val] -= newObj?.[val] ?? 0;
    } else if (typeof oldObj?.[val] === "object") {
      oldObj[val] = DeepSubtract(oldObj?.[val] ?? 0, newObj?.[val] ?? 0);
    }
  }

  return oldObj;
}

module.exports = DeepSubtract;
