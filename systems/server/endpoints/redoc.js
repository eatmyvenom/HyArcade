const { readFile } = require("fs-extra");

/**
 *
 * @param {*} req
 * @param {*} res
 */
module.exports = async (req, res) => {
  if (req.method == "GET") {
    res.setHeader("Content-Type", "text/html");

    res.write(await readFile("assets/api-docs.html"));
    res.end();
  } else {
    res.statusCode = 404;
    res.end();
  }
};
