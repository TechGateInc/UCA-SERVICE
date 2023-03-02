const bcrypt = require("bcryptjs");
const Student = require("../models/Student");
const Lecturer = require("../models/Lecturer");
const Admin = require("../models/Admin");
const LocalStrategy = require("passport-local").Strategy;


function initialize(passport){
  
      const authenticateUser = async (email, password, done) => {
        const student = await Student.findOne({ email });
        if (student) {
          const isMatch = await bcrypt.compare(password, student.password);
          if (isMatch) return done(null, student);
        } 

        const lecturer = await Lecturer.findOne({ email });
        if (lecturer) {
          const isMatch = await bcrypt.compare(password, lecturer.password);
          if (isMatch) return done(null, lecturer);
        }

        const admin = await Admin.findOne({ email });
        if (admin) {
          const isMatch = await bcrypt.compare(password, admin.password);
          if (isMatch) return done(null, admin);
        }

        return done(null, false, { message: "Incorrect email or password" });
      };



      passport.use(
        new LocalStrategy({ usernameField: "email" }, authenticateUser)
      );
      
      passport.serializeUser((user, done) => done(null, user.id));

      passport.deserializeUser((id, done) => {
        Student.findById(id, (err, user) => {
          if (err) return done(err);
          if (user) return done(null, user);

          Lecturer.findById(id, (err, user) => {
            if (err) return done(err);
            if (user) return done(null, user);

            Admin.findById(id, (err, user) => {
              if (err) return done(err);
              if (user) return done(null, user);

              return done(null, false, { message: "Unknown user type" });
            });
          });
        });
      });

}

module.exports = initialize;
