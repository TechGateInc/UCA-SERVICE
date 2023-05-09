const AdminRouter = require("./admin");
const LecturerRouter = require("./lecturer");
const StudentRouter = require("./student");
const AuthRouter = require("./auth");
const LocationRouter = require("./location");
const AttendanceRouter = require("./attendance");
const CourseRouter = require("./course");
const DepartmentRouter = require("./department");
const SchoolRouter = require("./school");
const TimetableRouter = require("./timetable");
const ClassRouter = require("./class");
const VenueRouter = require("./venue");

const mainRoute = require("express").Router();

mainRoute.use((req, res, next) => {
  if (
    req.session &&
    req.session.cookie &&
    req.session.cookie.expires &&
    req.session.cookie.expires < new Date()
  ) {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
      }
      res.redirect("/login");
    });
  } else {
    next();
  }
});

mainRoute.use("/", AuthRouter);
mainRoute.use("/student", StudentRouter);
mainRoute.use("/admin", AdminRouter);
mainRoute.use("/lecturer", LecturerRouter);
mainRoute.use("/attendance", AttendanceRouter);
mainRoute.use("/location", LocationRouter);
mainRoute.use("/course", CourseRouter);
mainRoute.use("/department", DepartmentRouter);
mainRoute.use("/school", SchoolRouter);
mainRoute.use("/timetable", TimetableRouter);
mainRoute.use("/class", ClassRouter);
mainRoute.use("/venue", VenueRouter);

module.exports = mainRoute;
