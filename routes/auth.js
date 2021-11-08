const express= require('express');
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const crypto = require("crypto");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../config/keys");
const {SENDGRID_API} = require("../config/keys")
const requireLogin = require("../middleware/requireLogin");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:SENDGRID_API
    }
}))


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
                // transporter.sendMail({
                //     to:user.email,
                //     from:"aryankhare32@gmail.com",
                //     subject:"Signup Success",
                //     html:"<h1>Welcome to Instagram</h1>"
                // })
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

router.post("/reset-password",(req,res)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err)
            }
            const token= buffer.toString("hex")
            User.findOne({email:req.body.email})
            .then(user=>{
                if(!user){
                    return res.status(422).json({error:"User doesn't exist with that email!"})
                }
                user.resetToken = token
                user.expireToken = Date.now() + 3600000
                user.save().then((result)=>{
                    transporter.sendMail({
                        to:user.email,
                        from:"aryankhare32@gmail.com",
                        subject:"Password reset",
                        html:`
                        <p>You requested for password reset </p>
                        <h5> Click on this <a href="http://localhost:3000/reset/${token}">link</a> to reset password</h5>
                        `
                    })
                    res.json({message:"Check your e-mail"})
                })
            })
        
    })
})

router.post("/new-password",(req,res)=>{
    const newPassword = req.body.password
    const sentToken = req.body.token
    User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
    .then(user=>{
        if(!user){
            return res.status(422).json({error:"Try again, session expired."})
        }
        bcrypt.hash(newPassword,12).then(hashedpassword=>{
            user.password = hashedpassword
            user.resetToken = undefined
            user.expireToken = undefined
            user.save().then((saveduser)=>{
                res.json({message:"Password Update sucessful"})
            })
        })
    }).catch(err=>{
        console.log(err)
    })
})

module.exports = router