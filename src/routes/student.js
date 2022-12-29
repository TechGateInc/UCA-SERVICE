const Studentrouter = require("express").Router();
const bcrypt = require("bcryptjs");
const Student = require("../models/Student");


//UPDATE 
// Studentrouter.post("/student", async (req,res)=> {
//     if(!req.body){
//         res.status(400).send({message: "Empty Parameters"})
//     }

//     let new_student = new Student({
//         name:req.body.name,
//         password:req.body.password,
//         matricno:req.body.matricno,
//         department:req.body.department,
//         level:req.body.level,
//         group:req.body.group,
//         email:req.body.email,
//         courses:req.body.courses,
//     })

//     new_student
//         .save(new_student)
//         .then(data=>{
//             res.send(data)
//         })
//         .catch(err=>{
//             res.status(500).send()
//         })

// });




//REGISTER STUDENT
// router.post("/studentRegister", async (req, res) => {
//   try {
//     const salt = await bcrypt.genSalt(10);
//     const hashedPass = await bcrypt.hash(req.body.password, salt);
//     const newStudent = new Student({
//       matricno: req.body.matricno,
//       password: hashedPass,
//     });
//     const student = await newStudent.save();
//     return res.status(200).json(student);
//   } catch (err) {
//     return res.status(500).json({ err: err.message });
//   }
// });

//LOGIN STUDENT
// router.post("/studentLogin", async (req, res) => {
//   try {
//     const student = await Student.findOne({ matricno: req.body.matricno });
//     if (!student) {
//       return res.status(400).json("Wrong credential");
//     }
//     const validated = await bcrypt.compare(req.body.password, student.password);
//     if (!validated) {
//       return res.status(400).json("Wrong credentials!");
//     }
//     const { password, ...others } = student._doc;
//     return res.status(200).json(others);
//   } catch (err) {
//     return res.status(500).json(err);
//   }
// });

//UPDATE PASSWORD 

