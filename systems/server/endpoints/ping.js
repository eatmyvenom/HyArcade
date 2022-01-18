/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
module.exports = async (req, res) => {
  if(req.method == "GET") {
    res.setHeader("Content-Type", "application/json");

    res.write(JSON.stringify({ response: "pong" }));
    res.end();
  } else {
    res.statusCode = 404;
    res.end();
  }
};
