const router = require("express").Router();
const fetch = import("node-fetch");

//GET LOCATION
router.post("/", async (req, res) => {
  var fetch_res = await fetch(`https://ipapi.co/${req.ip}/json/`);
  var fetch_data = await res.json();

  res.send(`Location: ${fetch_data}`);
});

module.exports = router;