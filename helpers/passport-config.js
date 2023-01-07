const bcrypt = require("bcryptjs");
const Student = require("../models/Student");
const Lecturer = require("../models/Lecturer");
const Admin = require("../models/Admin");
const localStrategy = require("passport-local").Strategy;

function initialize(passport) {
  async function authenticateStudent(email, password, done) {
    try {
      const student = await Student.findOne({ email: email });
      if (!student) {
        // No user with the matching email was found
        return done(null, false, { message: "Invalid email or password" });
      }
      // Check if the password is correct
      const isMatch = await bcrypt.compare(password, student.password);
      if (!isMatch) {
        // Incorrect password
        return done(null, false, { message: "Invalid email or password" });
      }
      // The email and password are correct
      return done(null, student);
    } catch (e) {
      return done(e);
    }
  }

  async function authenticateLecturer(email, password, done) {
    try {
      const lecturer = await Lecturer.findOne({ email: email });
      if (!lecturer) {
        // No user with the matching email was found
        return done(null, false, {
          message: "Invalid email or password",
        });
      }
      // Check if the password is correct
      const isMatch = await bcrypt.compare(password, lecturer.password);
      if (!isMatch) {
        // Incorrect password
        return done(null, false, {
          message: "Invalid email or password",
        });
      }
      // The email and password are correct
      return done(null, lecturer);
    } catch (e) {
      return done(e);
    }
  }

  async function authenticateAdmin(email, password, done) {
    try {
      const admin = await Admin.findOne({ email: email });
      if (!admin) {
        // No user with the matching email was found
        return done(null, false, {
          message: "Invalid email or password",
        });
      }
      // Check if the password is correct
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        // Incorrect password
        return done(null, false, {
          message: "Invalid email or password",
        });
      }
      // The email and password are correct
      return done(null, admin);
    } catch (e) {
      return done(e);
    }
  }

  passport.use(
    new localStrategy({ usernameField: "email" }, authenticateStudent)
  );
  passport.use(
    new localStrategy({ usernameField: "email" }, authenticateLecturer)
  );
  passport.use(
    new localStrategy({ usernameField: "email" }, authenticateAdmin)
  );

  passport.serializeUser((user, done) => {
    // Determine the user's model based on the user object
    let model;
    if (user.constructor.modelName === "Student") {
      model = "Student";
    } else if (user.constructor.modelName === "Admin") {
      model = "Admin";
    } else if (user.constructor.modelName === "Lecturer") {
      model = "Lecturer";
    }
    // Serialize the user object
    done(null, { id: user._id, model: model });
  });

  passport.deserializeUser((serializedUser, done) => {
    // Find the user based on the serialized user object
    const Model = mongoose.model(serializedUser.model);

    Model.findById(serializedUser.id, (err, user) => {
      done(err, user);
    });
  });

  // OR
  // IF THE FIRST ONE NO WORK LOL
  //     passport.deserializeUser((serializedUser, done) => {
  //   // Find the user based on the serialized user object
  //   if (serializedUser.model === "Student") {
  //     Student.findById(serializedUser.id, (err, student) => {
  //       done(err, student);
  //     });
  //   } else if (serializedUser.model === "Admin") {
  //     Admin.findById(serializedUser.id, (err, admin) => {
  //       done(err, admin);
  //     });
  //   } else if (serializedUser.model === "Lecturer") {
  //     Lecturer.findById(serializedUser.id, (err, lecturer) => {
  //       done(err, lecturer);
  //     });
  //   }
  // });

  //   passport.deserializeUser(async (id, done)=>{
  //       try {
  //      // Find the user by their ID
  //      const user = await User.findOne({ _id: id });
  //     if (!user) {
  //      // No user with the matching ID was found
  //         return done(null, false);
  //     }
  //       // Return the user
  //      return done(null, user);
  //     } catch (e) {
  //         return done(e);
  //     }
  // })
}

module.exports = initialize;
