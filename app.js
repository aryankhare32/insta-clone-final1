const express = require("express")
const app = express()
const mongoose = require('mongoose');
const PORT = 5000
// const{MONGOURI}=require('./keys')
const {JWT_SECRET,MONGOURI} = require('./config/keys')



mongoose.connect(MONGOURI,{useNewUrlParser:true,useUnifiedTopology:true})
mongoose.connection.on('connected',()=>{
    console.log("connected to mongo YEah!")
})
mongoose.connection.on('error',(err)=>{
    console.log("error connecting",err);
})

require("./models/user")
require("./models/post")



app.use(express.json()); // This is a middle ware for parsing incoming requests
app.use(require("./routes/auth"))
app.use(require("./routes/post"))
app.use(require("./routes/user"))

if(process.env.NODE_ENV == 'production'){
    const path= require("path")
    
    app.get('/',(req,res)=>{
        app.use(express.static(path.resolve(__dirname,'client','build')))
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

app.listen(PORT,()=>{
    console.log("server is up and running ",PORT); 
})