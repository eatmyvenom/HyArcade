const cfg = require("hyarcade-config/Config").fromJSON();
const task = require("./task");
const logger = require("hyarcade-logger");
const {
  exec
} = require("child_process");

/**
 * Run a shell command
 *
 * @param {string} command
 * @returns {string}
 */
function run (command) {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      resolve(stdout);
      if(err) {
        logger.err(stderr);
        reject(err);
      }
    });
  });
}

class clusterClient {
    /**
     * The cluster name
     *
     * @memberof clusterClient
     */
    name = "";

    /**
     * The key the cluster uses
     *
     * @memberof clusterClient
     */
    key = "";

    /**
     * The tasks for the cluster to execute
     *
     * @memberof clusterClient
     */
    tasks = [];

    /**
     * The files this cluster affects
     *
     * @memberof clusterClient
     */
    files = [];

    /**
     * Creates an instance of clusterClient.
     *
     * @param {string} name
     * @memberof clusterClient
     */
    constructor (name) {
      this.name = name;
      this.key = cfg.clusters[name].key;
      this.tasks = cfg.clusters[name].tasks;
    }

    /**
     * Execute all of the tasks this cluster has
     *
     * @memberof clusterClient
     */
    async doTasks () {
      for(const t of this.tasks) {
        logger.out(`Executing task ${t}`);
        this.files.concat(await task[t]());
      }
    }

    /**
     * Send the updated data to the main cluster
     *
     * @memberof clusterClient
     */
    async uploadData () {
      if(this.name != "main") {
        for(const file of this.files) {
          // this requires rsync to be installed on both the server and client
          await run(`rsync -a --rsh=ssh ${file} ${cfg.cluserTarget}/${file}`);
        }
      }
    }
}

module.exports = clusterClient;
