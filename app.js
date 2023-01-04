const express = require("express");
const app = express();
const connectDB = require("./migrations/index.js");
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

const mainRoute = require("./routes/main");

app.use("/", mainRoute);

app.get("/", (req, res) => {
  res.send("Server Running");
});

//db connect
connectDB();

const port = process.env.ACCESS_PORT || 5900;

app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});