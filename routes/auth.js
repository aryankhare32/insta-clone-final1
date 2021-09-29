const express= require('express');
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../config/keys");
const requireLogin = require("../middleware/requireLogin");


router.post("/signup",(req,res)=>{
    const{name,email,password,pic} =req.body;
    if(!email || !name || !password){
        return res.status(422).json({error:"Please add all the fields"}) // res.json is sending a respose in json format
    }
    User.findOne({email})
    .then((savedUser)=>{
        if(savedUser)
        {
          return res.status(422).json({error:"user already exists with that email"})
        }
        bcrypt.hash(password,12)
        .then((hashedpassword)=>{
            const user=new User({
                email,
                password:hashedpassword,
                name,
                pic:pic
            })
            user.save()
            .then(user =>{
                res.json({message:"saved succesfully"})
            })
            .catch(err=>{
                console.log(err)
            })
        })
       
    }) 
    .catch(err=>{
        console.log(err);
    })
})

router.post("/signin",(req,res)=>{
    const {email,password} = req.body;
    if(!email || !password)
    {
       return res.status(422).json({error:"Please fill all the fields"})
    }

    User.findOne({email:email})
    .then((savedUser)=>{
        if(!savedUser){
          return res.status(422).json({error:"Invalid email or Password"})
        }
        bcrypt.compare(password,savedUser.password) // the order should be --> first the password entered and then the password from the database
        .then(doMatch=>{
            if(doMatch)
            {
                // res.json({message:"Successfully Signed In"});
                const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                const{_id , name , email, followers, following, pic} = savedUser
                res.json({token,user:{_id, name, email, followers, following, pic}});

            } else {
                return res.status(422).json({error:"Invalid email or Password"})
            }
        })
        .catch(err =>{
            console.log(err)
        })
    })
})
module.exports = router