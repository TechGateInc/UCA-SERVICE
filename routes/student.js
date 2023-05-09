const router = require("express").Router();
const bcrypt = require("bcryptjs");
const Student = require("../models/Student");

//UPDATE STUDENT
router.put("/update/:id", async (req, res) => {
  if (req.body.studentId === req.params.id) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    try {
      const updatedStudent = await Student.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      return res.status(200).json(updatedStudent);
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(401).json("You can only update your account!");
  }
});

//DELETE STUDENT
router.delete("/:id", async (req, res) => {
  if (req.body.studentId === req.params.id) {
    try {
      const student = await Student.findById(req.params.id);
      try {
        await Student.findByIdAndDelete(req.params.id);
        return res.status(200).json("Student has been deleted");
      } catch (err) {
        return res.status(500).json(err);
      }
    } catch {
      return res.status(404).json("Student Cannot be found!");
    }
  } else {
    return res.status(401).json("You can only delete your account!");
  }
});

//GET STUDENT
router.get("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    const { password, ...others } = student._doc;
    return res.status(200).json(others);
  } catch (err) {
    return res.status(500).json(err);
  }
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
  Student.findOneAndUpdate(
    { email },
    { $set: { otp } },
    { new: true },
    (err, user) => {
      if (err) {
        console.log(err);
        return res.status(500).send();
      }
      if (!user) {
        return res.status(404).send("Student not found");
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
  Student.findOne({ email, otp }, (err, user) => {
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
        Student.findOneAndUpdate(
          { email },
          { $set: { password: hash, otp: null } },
          { new: true },
          (err, user) => {
            if (err) {
              console.log(err);
              return res.status(500).send();
            }
            if (!user) {
              return res.status(404).send("Student not found");
            }
            res.send("Password reset successful");
          }
        );
      });
    });
  });
});

module.exports = router;
