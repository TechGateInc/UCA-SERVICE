const helpers = require("../helpers/auth.guard");
const AdminRouter = require("./admin");
const LecturerRouter = require("./lecturer");
const StudentRouter = require("./student");
const LoginRouter = require("./auth");
const LocationRouter = require("./location");
const AttendanceRouter = require("./attendance");
const CourseRouter = require("./course");
const DepartmentRouter = require("./department");
const TimetableRouter = require("./timetable");
const VenueRouter = require("./venue");
const Password = require("../sendOTP");
const { studentPermission, lecturerPermission, adminPermission } = require("../helpers/auth.guard");

const mainRoute = require("express").Router();

mainRoute.use("/", LoginRouter);
mainRoute.use("/student", StudentRouter, helpers.auth, studentPermission);
mainRoute.use("/admin", AdminRouter, helpers.auth, adminPermission);
mainRoute.use("/lecturer", LecturerRouter, helpers.auth, lecturerPermission);
mainRoute.use("/attendance", AttendanceRouter);
mainRoute.use("/location", LocationRouter);
mainRoute.use("/course", CourseRouter);
mainRoute.use("/department", DepartmentRouter);
mainRoute.use("/timetable", TimetableRouter);
mainRoute.use("/venue", VenueRouter);

module.exports = mainRoute;
