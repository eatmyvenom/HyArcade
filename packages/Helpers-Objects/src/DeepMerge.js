/**
 * @param item
 * @returns {boolean}
 */
function isObject(item) {
  return item && typeof item === "object" && !Array.isArray(item);
}

/**
 * @param target
 * @param source
 * @returns {object}
 */
function DeepMerge(target, source) {
  const output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    for (const key of Object.keys(source)) {
      if (isObject(source[key])) {
        if (!(key in target)) Object.assign(output, { [key]: source[key] });
        else output[key] = DeepMerge(target[key], source[key]);
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    }
  }
  return output;
}

module.exports = DeepMerge;
