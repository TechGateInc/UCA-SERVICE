const nodemailer = require("nodemailer");

function createTransport() {
  return nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
}

module.exports = createTransport;
