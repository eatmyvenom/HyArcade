const { Webhook } = require("discord.js");

module.exports = class Webhooks {
  /**
   * Webhook for duplicating messages
   *
   * @type {Webhook}
   * @static
   */
  static commandHook;

  /**
   * Webhook for logging standard output
   *
   * @type {Webhook}
   * @static
   */
  static logHook;

  /**
   * Webhook for logging standard error
   *
   * @type {Webhook}
   * @static
   */
  static errHook;
};
