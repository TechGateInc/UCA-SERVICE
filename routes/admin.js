const router = require("express").Router();
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const randomstring = require("randomstring");
const createTransport = require("../utils/mail");
const transporter = createTransport();

//UPDATE ADMIN
router.put("/:id", async (req, res) => {
  if (req.body.adminId === req.params.id) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    try {
      const updatedAdmin = await Admin.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      return res.status(200).json(updatedAdmin);
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(401).json("You can only update your account!");
  }
});

//DELETE ADMIN
router.delete("/:id", async (req, res) => {
  if (req.body.adminId === req.params.id) {
    try {
      const admin = await Admin.findById(req.params.id);
      try {
        await admin.findByIdAndDelete(req.params.id);
        return res.status(200).json("Admin has been deleted");
      } catch (err) {
        return res.status(500).json(err);
      }
    } catch {
      return res.status(404).json("Admin Cannot be found!");
    }
  } else {
    return res.status(401).json("You can only delete your account!");
  }
});

//GET ADMIN
router.get("/:id", async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    const { password, ...others } = admin._doc;
    return res.status(200).json(others);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.post("/reset", async (req, res) => {
  const { email } = req.body;

  // Find the user with the given email
  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(400).send({ error: "Invalid email" });

  // Generate and send an OTP
  const otp = generateOTP();
  sendOTP(admin.email, otp);

  // Save the OTP in the user's database record
  admin.otp = otp;
  await admin.save();

  res.send({ message: "OTP sent" });
});

// Route for requesting password reset
router.post("/forgot-password", (req, res, next) => {
  const { email } = req.body;
  const otp = randomstring.generate({
    length: 6,
    charset: "numeric",
  });
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "Password Reset OTP for Attendity",
    html: `
    <br /><div style="flex-direction:column; justify-content:center; align-items:center;">
        <h1>OTP CODE</h1>
        <p>Your request for an OTP code was successful</p>
        <p>Please use this code to veriy your email: ${otp}</p>
        <p>This code will expire in 10 minutes</p>
        <p>Love from Attendity!</p><br><br>
    </div>
    `,
  };
  Admin.findOneAndUpdate(
    { email },
    { $set: { otp } },
    { new: true },
    (err, user) => {
      if (err) {
        console.log(err);
        return res.status(500).send();
      }
      if (!user) {
        return res.status(404).send("Admin not found");
      }
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log(err);
          return res.status(500).send();
        }
        console.log("Message sent: %s", info.messageId);
        res.send("OTP sent to your email");
      });
    }
  );
});

// Route for verifying OTP and resetting password
router.post("/reset-password", (req, res, next) => {
  const { email, otp, password } = req.body;
  Admin.findOne({ email, otp }, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(500).send();
    }
    if (!user) {
      return res.status(404).send("Invalid OTP");
    }
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        console.log(err);
        return res.status(500).send();
      }
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          console.log(err);
          return res.status(500).send();
        }
        Admin.findOneAndUpdate(
          { email },
          { $set: { password: hash, otp: null } },
          { new: true },
          (err, user) => {
            if (err) {
              console.log(err);
              return res.status(500).send();
            }
            if (!user) {
              return res.status(404).send("Admin not found");
            }
            res.send("Password reset successful");
          }
        );
      });
    });
  });
});

module.exports = router;
