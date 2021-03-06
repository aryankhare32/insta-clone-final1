import React,{useState,useEffect} from "react";
import {Link,useHistory} from "react-router-dom";
import M from "materialize-css";

const SignUp= ()=>{

    const history = useHistory()
    const [name,setName] = useState("")
    const [password,setPassword] = useState("")
    const [email,setEmail] = useState("")
    const [image,setImage] = useState("")
    const [url,setUrl] = useState(undefined)
    useEffect(()=>{
        if(url){
            uploadFields()
        }
    },[url])


    const uploadPic =()=>{
        const data = new FormData()
        data.append("file",image)
        data.append("upload_preset","Aryan-insta-clone")
        data.append("cloud_name","instaclone-1")
        fetch("https://api.cloudinary.com/v1_1/instaclone-1/image/upload",{
            method:"post",
            body:data
        })
        .then(res=>res.json())
        .then(data =>{
            setUrl(data.url)
        })
        .catch(err=>{
            console.log(err);
        })
    }
    const uploadFields=()=>{
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))
        {
            M.toast({html: "invalid email",classes:"#f44336 red"})
            return;
        }
        fetch("/signup",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                password,
                email,
                pic:url
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.error){
                M.toast({html: data.error,classes:"#f44336 red"})
            } else{
                M.toast({html:data.message,classes:"#4caf50 green"})
                history.push("/signin")
            }
        })
        .catch(err=>{
            console.log(err);
        })
    }
    const PostData = ()=>{
        if(image){
            uploadPic()
        } else{
            uploadFields()
        }
    
    }

    return (
        <div className= "mycard">
            <div className="card auth-card">
            <h2>Instagram</h2>
            <input type="text" placeholder="Name" 
                value={name}
                onChange={(e)=>setName(e.target.value)}
            />
            <input type="text" placeholder="Email" 
                 value={email}
                onChange={(e)=>setEmail(e.target.value)}
            />
            <input type="password" placeholder="Password" 
                 value={password}
                onChange={(e)=>setPassword(e.target.value)}
            />
            <div class="file-field input-field">
                <div class="btn">
                    <span>Upload Profile Pic</span>
                    <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
                </div>
                <div class="file-path-wrapper">
                    <input class="file-path validate" type="text" />
                </div>
                </div>
            <button className="btn waves-effect waves-light"
            onClick={()=>PostData()}>
                SignUp
            </button>
            <h5>
                <Link to="/signin">Already have an account?</Link>
            </h5>
            </div>
        </div>
    )
}
export default SignUp
