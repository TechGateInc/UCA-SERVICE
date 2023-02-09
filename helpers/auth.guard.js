const bcrypt = require("bcryptjs");
const Student = require("../models/Student");
const Lecturer = require("../models/Lecturer");
const Admin = require("../models/Admin");

module.exports = {
  //this will check if you are authenticated will be called on all protected routes
  auth: (req, res, next) => {
    if (req.isAuthenticated()) return next();
    else res.redirect("/");
  },

  //this check if you have a session and will be called on the login route
  loggedIn: async (req, res, next) => {
    if (req.isAuthenticated()) {
      let user = await req.user;
      // Determine the user's model based on the user object
      let modelstudent = await Student.findOne ({_id : user.id});
      let modellecturer = await Lecturer.findOne({ _id: user.id });
      let modeladmin = await Admin.findOne({ _id: user.id });

      if (modelstudent) {
        // model = "Admin";
        return res.status(200).json(user);
      } else if (modellecturer) {
        // model = "Lecturer";
        return res.status(200).json(user);
      } else if (modeladmin) {
        // model = "Student";
        return res.status(200).json(user);
      }
    } else {
      return next();
    }
  },

  //this will help handle redirects
  redirect: async (req, res) => {
    req.flash("user", req.user);
    let model;
    // Determine the user's model based on the user object
    // Determine the user's model based on the user object
      let modelstudent = await Student.findOne ({_id : user.id});
      let modellecturer = await Lecturer.findOne({ _id: user.id });
      let modeladmin = await Admin.findOne({ _id: user.id });

      if (modelstudent) {
        // model = "Admin";
        return res.status(200).json(user);
      } else if (modellecturer) {
        // model = "Lecturer";
        return res.status(200).json(user);
      } else if (modeladmin) {
        // model = "Student";
        return res.status(200).json(user);
      }
  },
  //this will be called on all Student routes
  studentPermission: async (req, res, next) => {
    let student_user = await Student.findOne({_id : user.id});
    if (student_user) {
      return next();
    } else {
      req.logOut();
      req.flash("error", "Unathorised!");
      return res.status(500).json({ err: err.message });
    }
  },

  //this will be called on all Lecturer routes
  lecturerPermission: async (req, res, next) => {
    let lecturer_user = await Lecturer.findOne({_id : user.id});
    if (lecturer_user) {
      return next();
    } else {
      req.logOut();
      req.flash("error", "Unathorised!");
      return res.status(500).json({ err: err.message });
    }
  },

  //this will be called on all Admin routes
  adminPermission: async (req, res, next) => {
    let admin_user = await Admin.findOne({_id :user.id});
    if (admin_user) {
      return next();
    } else {
      req.logOut();
      req.flash("error", "forbidden! Unathorised Access");
      return res.status(500).json({ err: err.message });
    }
  },
};
