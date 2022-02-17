const https = require("https");

/**
 *
 * @param {string} url
 * @param {*} headers
 * @param {*} json
 * @returns {Promise<object>}
 */
function PostRequest(url, headers, json) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, { headers, method: "POST" }, res => {
      let data = "";

      res.on("data", chunk => (data += chunk));
      res.on("end", () => {
        if (res.headers["content-type"] == "application/json") {
          resolve(JSON.parse(data));
        } else {
          resolve(data);
        }
      });

      res.on("error", reject);
    });

    req.on("error", reject);

    req.write(JSON.stringify(json));
    req.end();
  });
}

module.exports = PostRequest;
