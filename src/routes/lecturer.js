const Lecturerouter = require("express").Router();
const bcrypt = require("bcryptjs");
// const lecturerController = require("../controllers/lecturer.Controller")
const Lecturer = require("../models/Lecturer");

//REGISTER
Lecturerouter.post("/lecturer", async (req,res)=> {
    if(!req.body){
        res.status(400).send({message: "Empty Parameters"})
    }

    let new_lecturer = new Lecturer({
        name:req.body.name,
        password:req.body.password,
        department:req.body.department,
        email:req.body.email,
        courses:req.body.courses,
    })

    new_lecturer
        .save(new_lecturer)
        .then(data=>{
            res.send(data)
        })
        .catch(err=>{
            res.status(500).send()
        })

})


Lecturerrouter.get("/:id", async (req, res) => {
  try {
    const lecturer = await Lecturer.findById(req.params.id);
    const { password, ...others } = lecturer._doc;
    return res.status(200).json(others);
  } catch (err) {
    return res.status(500).json(err);
  }
});


//    UPDATE DETAILS

Lecturerouterr.put("/:id", async (req,res) => {
    if (req.body.adminId == req.params.id){
        try{
            let update = Lecturer.findByIdAndUpdate(
                
            )
        } catch{

        }
    }
}) 


