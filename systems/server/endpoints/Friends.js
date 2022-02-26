const { SlothpixelApiRequest } = require("../../../packages/request/Request");
const AccountResolver = require("../AccountResolver");

/**
 *
 * @param {*} req
 * @param {*} res
 * @param connector
 */
module.exports = async (req, res, connector) => {
  const url = new URL(req.url, `https://${req.headers.host}`);
  if (req.method == "GET") {
    res.setHeader("Content-Type", "application/json");

    const acc = await AccountResolver(connector, url);
    const friends = await SlothpixelApiRequest.friends(acc.uuid);

    res.write(JSON.stringify(friends));
    res.end();
  } else {
    res.statusCode = 404;
    res.end();
  }
};
