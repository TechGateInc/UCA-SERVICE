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

const mainRoute = require("express").Router();

mainRoute.use("/", LoginRouter);
mainRoute.use("/student", StudentRouter);
mainRoute.use("/admin", AdminRouter);
mainRoute.use("/lecturer", LecturerRouter);
mainRoute.use("/attendance", AttendanceRouter);
mainRoute.use("/location", LocationRouter);
mainRoute.use("/course", CourseRouter);
mainRoute.use("/department", DepartmentRouter);
mainRoute.use("/timetable", TimetableRouter);
mainRoute.use("/venue", VenueRouter);

module.exports = mainRoute;
