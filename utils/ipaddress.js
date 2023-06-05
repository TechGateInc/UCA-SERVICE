const proxyAddr = require("proxy-addr");

exports.ipFinder = (req, res) => {
//   const ipAddress =
    const ipAddress = proxyAddr(req, "loopback");
    // req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  console.log("User IP Address:", ipAddress);

  res.send(ipAddress);
};
