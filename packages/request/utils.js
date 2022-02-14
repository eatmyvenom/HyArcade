module.exports = class utils {
  static sleep(time) {
    return new Promise(resolve => {
      setTimeout(resolve, time);
    });
  }
};
