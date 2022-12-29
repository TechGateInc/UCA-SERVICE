const Lecturerouter = require("express").Router();
const bcrypt = require("bcryptjs");
// const lecturerController = require("../controllers/lecturer.Controller")
const Lecturer = require("../models/Lecturer");


//REGISTER
// Lecturerouter.post("/lecturer", async (req,res)=> {
//     if(!req.body){
//         res.status(400).send({message: "Empty Parameters"})
//     }

//     let new_lecturer = new Lecturer({
//         name:req.body.name,
//         password:req.body.password,
//         department:req.body.department,
//         email:req.body.email,
//         courses:req.body.courses,
//     })

//     new_lecturer
//         .save(new_lecturer)
//         .then(data=>{
//             res.send(data)
//         })
//         .catch(err=>{
//             res.status(500).send()
//         })

// })


// Lecturerouter.get("/:id", async (req, res) => {
//   try {
//     const lecturer = await Lecturer.findById(req.params.id);
//     const { password, ...others } = lecturer._doc;
//     return res.status(200).json(others);
//   } catch (err) {
//     return res.status(500).json(err);
//   }
// });


//    UPDATE DETAILS

// Lecturerouter.put("/:id", async (req,res) => {
//     if (req.body.adminId == req.params.id){
//         try{
//             let update = Lecturer.findByIdAndUpdate(
                
//             )
//         } catch{

//         }
//     }
// }) 


//REGISTER 
// router.post("/lecturerRegister", async (req, res) => {
//   try {
//     const salt = await bcrypt.genSalt(10);
//     const hashedPass = await bcrypt.hash(req.body.password, salt);
//     const newLecturer = new Lecturer({
//       username: req.body.username,
//       password: hashedPass,
//     });
//     const lecturer = await newLecturer.save();
//     return res.status(200).json(lecturer);
//   } catch (err) {
//     return res.status(500).json({ err: err.message });
//   }
// });

//LOGIN LECTURER
// router.post("/lecturerLogin", async (req, res) => {
//   try {
//     const lecturer = await Lecturer.findOne({ username: req.body.username });
//     if (!lecturer) {
//       return res.status(400).json("Wrong credential");
//     }
//     const validated = await bcrypt.compare(
//       req.body.password,
//       lecturer.password
//     );
//     if (!validated) {
//       return res.status(400).json("Wrong credentials!");
//     }
//     const { password, ...others } = lecturer._doc;
//     return res.status(200).json(others);
//   } catch (err) {
//     return res.status(500).json(err);
//   }
// });

