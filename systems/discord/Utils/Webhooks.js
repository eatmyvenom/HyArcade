const { Webhook } = require("discord.js");

module.exports = class Webhooks {
  /**
   * Webhook for logging commands
   *
   * @type {Webhook}
   * @static
   */
  static commandHook;

  /**
   * Webhook for logging output
   *
   * @type {Webhook}
   * @static
   */
  static logHook;

  /**
   * Webhook for logging errors
   *
   * @type {Webhook}
   * @static
   */
  static errHook;

  /**
   * Webhook for logging verifications
   *
   * @type {Webhook}
   * @static
   */
  static verifyHook;
};
