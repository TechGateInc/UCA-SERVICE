require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    const connect = await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
    });

    console.log("MongoDB connected: ", connect.connection.host);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectDB;
