const bcrypt = require("bcryptjs");
const User = require("../models/User")
const localStrategy = require("passport-local").Strategy;


function initialize(passport){

    async function authenticateUser(email, password, done){
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        // No user with the matching email was found
        return done(null, false, { message: "Invalid email or password" });
      }
      // Check if the password is correct
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        // Incorrect password
        return done(null, false, { message: "Invalid email or password" });
      }
      // The email and password are correct
      return done(null, user);
    } catch(e){
        return done(e)
    }
}



    passport.use(new localStrategy({usernameField: 'email'}), authenticateUser)

      passport.serializeUser((user, done)=>done(null, user.id))
      passport.deserializeUser(async (id, done)=>{
          try {
         // Find the user by their ID
         const user = await User.findOne({ _id: id });
        if (!user) {
         // No user with the matching ID was found
            return done(null, false);
        }
          // Return the user
         return done(null, user);
        } catch (e) {
            return done(e);
        }
    })

}

module.export = initialize
