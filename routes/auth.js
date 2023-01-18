const router = require("express").Router();
const Admin = require("../models/Admin");
const Student = require("../models/Student");
const bcrypt = require("bcryptjs");
const Lecturer = require("../models/Lecturer");
const passport = require ("passport");
const initializePassport = require("../helpers/passport-config");
const mongoose =  require ('mongoose');
const OTP = require("../generateOTP");
initializePassport(passport);

//REGISTER ADMIN
router.post("/adminRegister", async (req, res) => {
  try {
    // const salt = await bcrypt.genSalt(10);
    // const hashedPass = await bcrypt.hash(req.body.password, salt);
    const newAdmin = new Admin({
      username: req.body.username,
      password: req.body.password,
    });
    // console.log(newAdmin);
    const admin = await newAdmin.save();
    return res.status(200).json(admin);
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
});

//LOGIN ADMIN
// router.post("/adminLogin", async (req, res) => {
//   try {
//     const admin = await Admin.findOne({ username: req.body.username });
//     if (!admin) {
//       return res.status(400).json("Wrong credential");
//     }
//     const validated = await bcrypt.compare(req.body.password, admin.password);
//     if (!validated) {
//       return res.status(400).json("Wrong credentials!");
//     }
//     const { password, ...others } = admin._doc;
//     return res.status(200).json(others);
//   } catch (err) {
//     return res.status(500).json(err);
//   }
// });

//REGISTER STUDENT
router.post("/studentRegister", async (req, res) => {
  try {
    // const salt = await bcrypt.genSalt(10);
    // const hashedPass = await bcrypt.hash(req.body.password, salt);
    const newStudent = new Student({
      matricno: req.body.matricno,
      password: req.body.password,
    });
    const student = await newStudent.save();
    return res.status(200).json(student);
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
});

//LOGIN STUDENT
// router.post("/studentLogin", async (req, res) => {
//   try {
//     const student = await Student.findOne({ matricno: req.body.matricno });
//     if (!student) {
//       return res.status(400).json("Wrong credential");
//     }
//     const validated = await bcrypt.compare(req.body.password, student.password);
//     if (!validated) {
//       return res.status(400).json("Wrong credentials!");
//     }
//     const { password, ...others } = student._doc;
//     return res.status(200).json(others);
//   } catch (err) {
//     return res.status(500).json(err);
//   }
// });

//REGISTER LECTURER
router.post("/lecturerRegister", async (req, res) => {
  try {
    // const salt = await bcrypt.genSalt(10);
    // const hashedPass = await bcrypt.hash(req.body.password, salt);
    const newLecturer = new Lecturer({
      username: req.body.username,
      password: req.body.password,
    });
    const lecturer = await newLecturer.save();
    return res.status(200).json(lecturer);
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
});

//LOGIN LECTURER
// router.post("/lecturerLogin", async (req, res) => {
//   try {
//     const lecturer = await Lecturer.findOne({ username: req.body.username });
//     if (!lecturer) {
//       return res.status(400).json("Wrong credential");
//     }
//     const validated = await bcrypt.compare(
//       req.body.password,
//       lecturer.password
//     );
//     if (!validated) {
//       return res.status(400).json("Wrong credentials!");
//     }
//     const { password, ...others } = lecturer._doc;
//     return res.status(200).json(others);
//   } catch (err) {
//     return res.status(500).json(err);
//   }
// });


//LOGIN
router.post("/login", passport.authenticate("local", (error, user, info) => {
    if (error) {
      return res.status(500).json(error);
    }
    if (!user) {
      return res.status(401).json(info);
    }
    if (user) {
      return res.json(user);
    }
  })
);


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
