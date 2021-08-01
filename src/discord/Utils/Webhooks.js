const {
    WebhookClient
} = require("discord.js");
const config = require("../../Config");
const cfg = config.fromJSON();

module.exports = class Webhooks {

    /**
     * Webhook for duplicating messages
     *
     * @type {Webhook}
     * @static
     */
    static commandHook;

    /**
     * Webhook for logging igns
     *
     * @type {Webhook}
     * @static
     */
    static ignHook = new WebhookClient(cfg.loggingHooks.ignHook.id, cfg.loggingHooks.ignHook.token);

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
