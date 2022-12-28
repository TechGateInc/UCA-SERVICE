const express = require("express");
const app = express();
const connectDB = require("./src/migrations/index.js");
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());


// const authRoute = require("./src/routes/auth");
// const adminRoute = require("./src/routes/admin");
// const studentRoute = require("./src/routes/student");
// const lecturerRoute = require("./src/routes/lecturer");

// app.use("/api/auth", authRoute);
// app.use("/api/admin", adminRoute);
// app.use("/api/student", studentRoute);
// app.use("/api/lecturer", lecturerRoute);

const mainRoute = require('./src/routes/main')

app.use('/', mainRoute);

app.get("/", (req, res) => {
  res.send("Server Running");
});

//db connect
connectDB();

const port = process.env.ACCESS_PORT || 5900;

app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});
