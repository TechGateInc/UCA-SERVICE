const helpers = require("../helpers/auth.guard");
const AdminRouter = require("./admin"); 
const LecturerRouter = require("./lecturer");
const StudentRouter = require("./student");
const LoginRouter = require("./auth");

const mainRoute = require("express").Router();

mainRoute.use('/', LoginRouter);
// mainRoute.use('./student', helpers.auth, helpers.studentPermission, StudentRouter);
// mainRoute.use("./admin", helpers.auth, helpers.adminPermission, AdminRouter);
// mainRoute.use('./lecturer', helpers.auth, helpers.lecturerPermission, LecturerRouter);

module.exports = mainRoute;