const APIRuntime = require("../APIRuntime");

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {APIRuntime} runtime
 */
module.exports = async (req, res, runtime) => {
  if (req.method == "GET") {
    res.setHeader("Content-Type", "application/json");

    const obj = await runtime.mongoConnector.getInfo();
    const { version } = require("../../../package.json");

    res.write(JSON.stringify({ ...obj, version }));
    res.end();
  } else {
    res.statusCode = 404;
    res.end();
  }
};
