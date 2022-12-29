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
      let role = user.Role.name; 
      if (role == "admin") return res.status(200).json(admin);
      if (role == "lecturer") return res.status(200).json(lecturer);
      if (role == "student") return res.status(200).json(student);
    } else {
      return next();
    }
  },

  //this will help handle redirects
  redirect: (req, res, role) => {
    req.flash("user", req.user);
    if (role == "admin") return res.status(200).json(admin);

    if (role == "lecturer") return res.status(200).json(lecturer);

    if (role == "student") return res.status(200).json(student);
  },
  //this will be called on all Student routes
  studentPermission: async (req, res, next) => {
    let user = JSON.parse(JSON.stringify(await req.user));
    if (user.Role.role_name == "student") {
      return next();
    } else {
      req.logOut();
      req.flash("error", "Unathorised!");
      return res.status(500).json({ err: err.message });
    }
  },

  //this will be called on all Lecturer routes
  lecturerPermission: async (req, res, next) => {
    let user = JSON.parse(JSON.stringify(await req.user));
    if (user.Role.role_name == "lecturer") {
      return next();
    } else {
      req.logOut();
      req.flash("error", "Unathorised!");
      return res.status(500).json({ err: err.message });
    }
  },

  //this will be called on all Admin routes
  adminPermission: async (req, res, next) => {
    let user = JSON.parse(JSON.stringify(await req.user));
    if (user.UserRole.Role.role_name == "admin") {
      return next();
    } else {
      req.logOut();
      req.flash("error", "forbidden! Unathorised Access");
      return res.status(500).json({ err: err.message });
    }
  },
};
