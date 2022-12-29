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

route.post("/login", passport.authenticate('local', {
  successRedirect: res.json(user),
  failureRedirect: res.json(error),
  failureFlash: true,
}), (req, res)=>{
    helpers.redirect(req, res, req.user.UserRole.Role.role_name)
});

module.exports = router;
