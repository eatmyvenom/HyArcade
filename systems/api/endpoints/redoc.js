const { readFile } = require("fs-extra");
const GetAsset = require("@hyarcade/utils/FileHandling/GetAsset");

/**
 *
 * @param {*} req
 * @param {*} res
 */
module.exports = async (req, res) => {
  if (req.method == "GET") {
    res.setHeader("Content-Type", "text/html");

    res.write(await readFile(GetAsset("api-docs.html")));
    res.end();
  } else {
    res.statusCode = 404;
    res.end();
  }
};
