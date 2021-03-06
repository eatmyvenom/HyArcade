const config = require("../config.json");
// This requires Rsync to availiable on both the
// main server and on the client sending the
// data, additionally it means that all systems
// must be using linux afaik
const Rsync = require("rsync");
const task = require("./task");
const utils = require("./utils");
const { logger } = require("./utils");

class clusterClient {
    name = "";
    key = "";
    tasks = [];
    files = [];

    constructor(name) {
        this.name = name;
        this.key = config.clusters[name].key;
        this.tasks = config.clusters[name].tasks;
    }

    async doTasks() {
        for (let t of this.tasks) {
            logger.out("Executing task "+t);
            this.files.concat(await task[t]());
        }
    }

    uploadData() {
        if (config.cluster != "main") {
            for (let f of this.files) {
                let rsc = new Rsync()
                    .shell("ssh")
                    .flags("a")
                    .source(f)
                    .destination(`${config.cluserTarget}/${f}`);

                rsc.execute((err, code, cmd) => {
                    utils.logger.out(`${f} uploaded`);
                });
            }
        }
    }
}

module.exports = clusterClient;
