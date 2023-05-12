const express = require("express");
const app = express();
const connectDB = require("./migrations/index.js");
const cors = require("cors");
const passport = require("passport");
const initializePassport = require("./helpers/passport-config.js");
const flash = require("express-flash");
const session = require("express-session");

app.use(passport.initialize());
initializePassport(passport);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(flash());

// Set up session middleware
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 30 * 60 * 1000, // 30 minutes in milliseconds
    },
  })
);

app.use(passport.session());

app.use(cors());

const mainRoute = require("./routes/main");

app.use("/", mainRoute);

app.get("/", (req, res) => {
  res.send("Server Running");
});

//db connect
connectDB();

const port = process.env.ACCESS_PORT;

app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});
