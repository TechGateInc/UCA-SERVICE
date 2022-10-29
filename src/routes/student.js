const Studentrouter = require("express").Router();
const bcrypt = require("bcryptjs");
const Student = require("../models/student");


//REGISTER
Studentrouter.post("/student", async (req,res)=> {
    if(!req.body){
        res.status(400).send({message: "Empty Parameters"})
    }

    let new_student = new Student({
        name:req.body.name,
        password:req.body.password,
        matricno:req.body.matricno,
        department:req.body.department,
        level:req.body.level,
        group:req.body.group,
        email:req.body.email,
        courses:req.body.courses,
    })

    new_student
        .save(new_student)
        .then(data=>{
            res.send(data)
        })
        .catch(err=>{
            res.status(500).send()
        })

});


//UPDATE PASSWORD 

