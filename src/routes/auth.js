// LOGIN/REGISTER ROUTES FOR ALL USERS(i assume just 1 due to the role based login)

const router = require("express").Router();
const Admin = require("../models/Admin");
const Student = require("../models/Student");
const bcrypt = require("bcryptjs");
const Lecturer = require("../models/Lecturer");
const User = require("../models/User");
const passport = require("passport");
const helpers = require("../helpers/auth.guard");
const initializePassport = require("../helpers/passport-config");
initializePassport(passport);


// siteRouter.get("/login", helpers.loggedIn);

// router.post("/login", async (req, res) => {
//   try {
//     const user = await User.findOne({ email: req.body.email });
//     if (!user) {
//       return res.status(400).json("Wrong credential");
//     }
//     const validated = await bcrypt.compare(req.body.password, user.password);
//     if (!validated) {
//       return res.status(400).json("Wrong credentials!");
//     }
//     const { password, ...others } = user._doc;
//     return res.status(200).json(others);
//   } catch (err) {
//     return res.status(500).json(err); 
//   }
// });

router.post("/login", passport.authenticate('local', (error, user, info) => {
  if (error){
    return res.status(500).json(error);
  }
  if (!user){
    return res.status(401).json(info);
  }
  if (user){
    return res.json(user);
  }
}));

router.post("/register", async (req, res) => {
  try{
      // const salt = await bcrypt.genSalt(10);
      // const hashedPass = await bcrypt.hash(req.body.password, salt);
      // const pass = req.body.password;
      // console.log(hashedPass)

      const newUser = new User({
        email: req.body.email,
        password: req.body.password,
      });
      const user = await newUser.save();
      return res.status(200).json(user);
    } catch (err) {
      return res.status(500).json({ err: err.message });
    }
})  

module.exports = router;
