const Student = require("./models/Student");
const Lecturer = require("./models/Lecturer");
const LoginRouter = require("./routes/auth");
const {sendMail} = require("./helpers/nodemailer")

// I am using nodemailer here to send the OTP to the user through email

async function sendOTP(email, otp) {
        let subject = "DIGITAL SUPERSTORE";
        let html = `
        <br /><div style="flex-direction:column; justify-content:center; align-items:center;">
            <h1>OTP CODE</h1>
            <p>Your request for an OTP code was successful</p>
            <p>Please use this code to veriy your email: ${otp}</p>
            <p>This code will expire in 10 minutes</p>
            <p>Love from TechGate!</p><br><br>
        </div>
        `;
        await sendMail(email, subject, html)
}
module.exports = {sendOTP}