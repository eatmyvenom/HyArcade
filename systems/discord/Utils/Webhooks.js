const { Webhook } = require("discord.js");

class Webhooks {
  /**
   * Webhook for logging commands
   *
   * @type {Webhook}
   */
  commandHook;

  /**
   * Webhook for logging output
   *
   * @type {Webhook}
   */
  logHook;

  /**
   * Webhook for logging errors
   *
   * @type {Webhook}
   */
  errHook;

  /**
   * Webhook for logging verifications
   *
   * @type {Webhook}
   */
  verifyHook;
}

module.exports = new Webhooks();
