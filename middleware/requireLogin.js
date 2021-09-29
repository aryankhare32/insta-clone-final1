const jwt= require("jsonwebtoken");
// const {JWT_SECRET} = require(")
const {JWT_SECRET} = require("../config/keys")
const mongoose = require("mongoose");
const user = mongoose.model("User")

module.exports=(req,res,next)=>{
    const{authorization} = req.headers
    //authorization ----> Bearer asjdhflkjashdlfj
    if(!authorization){
        res.status(401).json({error:"you must be logged in"})
    }
    const token = authorization.replace("Bearer ","")
    jwt.verify(token,JWT_SECRET,(err,payload)=>{
        if(err){
           return res.status(401).json({error:"you must be logged in"})
        }
        const {_id}=payload
        user.findById(_id).then(userData=>{
            req.user = userData
            next()
        })
        
    })

}