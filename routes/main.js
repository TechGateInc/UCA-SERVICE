const helpers = require("../helpers/auth.guard");
const AdminRouter = require("./admin"); 
const LecturerRouter = require("./lecturer");
const StudentRouter = require("./student");
const LoginRouter = require("./auth")
const LocationRouter = require("./location")

const mainRoute = require("express").Router();

mainRoute.use('/', LoginRouter);
mainRoute.use('/student', StudentRouter);
mainRoute.use('/admin', AdminRouter);
mainRoute.use('/lecturer', LecturerRouter);
mainRoute.use('/location', LocationRouter);

module.exports = mainRoute;