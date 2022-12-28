const helpers = require("../../helpers/auth.guard");
const AdminRouter = require("/admin.js"); 
const LecturerRouter = require("/lecturer");
const StudentRounter = require("/student");
const LoginRouter = require("/auth")

const mainRoute = require("express").Router();

mainRoute.use('/', helpers.auth, LoginRouter);
mainRoute.use('/student', helpers.auth, StudentRounter);
mainRoute.use('/admin', helpers.auth, AdminRouter);
mainRoute.use('/lecturer', helpers.auth, LecturerRouter);

module.exports = mainRoute;