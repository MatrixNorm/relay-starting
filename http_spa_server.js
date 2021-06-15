const express = require("express");
const server = express();

server.all("/*", (req, res) => {
  if (req.url.endsWith(".js") || req.url.endsWith(".css")) {
    res.sendFile(`${__dirname}/dist${req.url}`);
  } else {
    res.sendFile(__dirname + "/dist/index.html");
  }
});

const port = 8080;
server.listen(port, () => {
  console.log("Server listening on port", port);
});
