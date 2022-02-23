const { HypixelApi } = require("hyarcade-requests");
let counts = {};
let countsTime = 0;

/**
 *
 * @param {*} req
 * @param {*} res
 */
module.exports = async (req, res) => {
  if (req.method == "GET") {
    res.setHeader("Content-Type", "application/json");

    if (Date.now() - countsTime > 300000) {
      counts = await HypixelApi.counts();
    }

    res.write(JSON.stringify(counts));
    res.end();
  } else {
    res.statusCode = 404;
    res.end();
  }
};
