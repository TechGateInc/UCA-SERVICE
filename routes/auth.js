const router = require("express").Router();
const Admin = require("../models/Admin");
const Student = require("../models/Student");
const bcrypt = require("bcryptjs");
const Lecturer = require("../models/Lecturer");
const passport = require("passport");
const initializePassport = require("../helpers/passport-config");
const mongoose =  require ('mongoose');
const OTP = require("../generateOTP");
initializePassport(passport);

//REGISTER ADMIN
router.post("/adminRegister", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);

    // let user = req.body.username
    const newAdmin = new Admin({
      email: req.body.email,
      password: hashedPass,
    });

        // console.log(user);
    const admin = await newAdmin.save();
    return res.status(200).json(admin);
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
});

//REGISTER STUDENT
router.post("/studentRegister", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const newStudent = new Student({
      email: req.body.email,
      password: hashedPass,
    });
    const student = await newStudent.save();
    return res.status(200).json(student);
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
});

//REGISTER LECTURER
router.post("/lecturerRegister", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const newLecturer = new Lecturer({
      email: req.body.email,
      password: hashedPass,
      name: req.body.name,
    });
    const lecturer = await newLecturer.save();
    return res.status(200).json(lecturer);
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
});

//LOGIN
router.post("/login", (req,res) => {
        passport.authenticate("local", (error, user, info) => {
          if (error) {
            return res.status(500).json(error);
          }
          if (!user) {
            return res.status(401).json(info);
          }
          if (user) {
            return res.json(user);
          }
        })(req, res);
        // console.log(req.body.email);
});

//LOGOUT
router.get("/logout", (req, res) => {
  //logs-out user
  req.logout();
  //redirect
  res.redirect("/");
})


//FORGOT PASSWORD
// router.get("/forget-password", async (res, req) => {
//   try{
//     let user = req.body.username;

//     const lecturerCheck = await Lecturer.findOne({username : user});
//     const studentCheck = await Student.findOne({username : user});
//     const adminCheck = await Admin.findOne({username : user});

//     if (lecturerCheck || studentCheck || adminCheck){
//       let newotp = OTP;
//       let now = new Date()
//       console.log(newotp);

//     } else {
//       return res.status(400).json("There is no Account with that Username Registered, Please Register!");
//     }

//   } catch (error) {
//           return res.json(error);
//   }
// });



module.exports = router;
