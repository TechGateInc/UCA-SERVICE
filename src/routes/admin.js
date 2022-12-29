const router = require("express").Router();
const Admin = require("../models/Admin");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

//UPDATE
// router.put("/:id", async (req, res) => {
//   if (req.body.adminId === req.params.id) {
//     if (req.body.password) {
//       const salt = await bcrypt.genSalt(10);
//       req.body.password = await bcrypt.hash(req.body.password, salt);
//     }
//     try {
//       const updatedAdmin = await Admin.findByIdAndUpdate(
//         req.params.id,
//         {
//           $set: req.body,
//         },
//         { new: true }
//       );
//       return res.status(200).json(updatedAdmin);
//     } catch (err) {
//       return res.status(500).json(err);
//     }
//   } else {
//     return res.status(401).json("You can only update your account!");
//   }
// });

//DELETE
// router.delete("/:id", async (req, res) => {
//   if (req.body.adminId === req.params.id) {
//     try {
//       const admin = await Admin.findById(req.params.id);
//       try {
//         await Admin.findByIdAndDelete(req.params.id);
//         return res.status(200).json("Admin has been deleted");
//       } catch (err) {
//         return res.status(500).json(err);
//       }
//     } catch {
//       return res.status(404).json("Admin Cannot be found!");
//     }
//   } else {
//     return res.status(401).json("You can only delete your account!");
//   }
// });

//GET ADMIN
// router.get("/:id", async (req, res) => {
//   try {
//     const admin = await Admin.findById(req.params.id);
//     const { password, ...others } = admin._doc;
//     return res.status(200).json(others);
//   } catch (err) {
//     return res.status(500).json(err);
//   }
// });


//LOGIN ADMIN
// router.post("/adminLogin", async (req, res) => {
//   try {
//     const admin = await Admin.findOne({ username: req.body.username });
//     if (!admin) {
//       return res.status(400).json("Wrong credential");
//     }
//     const validated = await bcrypt.compare(req.body.password, admin.password);
//     if (!validated) {
//       return res.status(400).json("Wrong credentials!");
//     }
//     const { password, ...others } = admin._doc;
//     return res.status(200).json(others);
//   } catch (err) {
//     return res.status(500).json(err);
//   }
// });

// router.post("/", async (req, res) => {
//   try {
//     const salt = await bcrypt.genSalt(10);
//     const hashedPass = await bcrypt.hash(req.body.password, salt);
//     const newAdmin = new Admin({
//       username: req.body.username,
//       password: hashedPass,
//     });
//     const admin = await newAdmin.save();
//     return res.status(200).json(admin);
//   } catch (err) {
//     return res.status(500).json({ err: err.message });
//   }
// });

// module.exports = router;
