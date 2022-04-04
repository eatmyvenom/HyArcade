const { SlothpixelApiRequest } = require("@hyarcade/requests");
const AccountResolver = require("../AccountResolver");
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

    const acc = await AccountResolver(runtime);
    const friends = await SlothpixelApiRequest.friends(acc.uuid);

    res.write(JSON.stringify(friends));
    res.end();
  } else {
    res.statusCode = 404;
    res.end();
  }
};
