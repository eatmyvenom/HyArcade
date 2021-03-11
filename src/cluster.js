const config = require("../config.json");
// This requires Rsync to availiable on both the
// main server and on the client sending the
// data, additionally it means that all systems
// must be using linux afaik
const task = require("./task");
const { logger } = require("./utils");
const { exec } = require("child_process");

function run(command) {
    return new Promise((resolve, reject) => {
        exec(command, (err, stdout, stderr) => {
            resolve(stdout);
            if (err) {
                logger.err(stderr);
                reject(err);
            }
        });
    });
}

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
            logger.out("Executing task " + t);
            this.files.concat(await task[t]());
        }
    }

    async uploadData() {
        if (this.name != "main") {
            for (let file of this.files) {
                await run(
                    `rsync -a --rsh=ssh ${file} server:/home/eatmyvenom/pg-api/${file}`
                );
            }
        }
    }
}

module.exports = clusterClient;
