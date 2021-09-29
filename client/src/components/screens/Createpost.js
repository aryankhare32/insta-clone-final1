import React,{useState,useEffect} from "react"
import M from "materialize-css"
import { useHistory } from "react-router-dom"
const Createpost= ()=>{

    const history = useHistory()
    const [title,setTitle] = useState("")
    const [body,setBody] = useState("")
    const [image,setImage] = useState("")
    const [url,setUrl] = useState("")
    useEffect(()=>{
        if(url){

        
        fetch("/createpost",{
            method:"post",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                title,
                body,
                pic:url
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.error){
                M.toast({html: data.error,classes:"#f44336 red"})
            } else{
                M.toast({html:"Created Post Successfully",classes:"#4caf50 green"})
                history.push("/")
            }
        })
        .catch(err=>{
            console.log(err);
        })
    }

    },[url])


    const PostDetails = ()=>{
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

    return(
        <div className="card input filled" 
        style={{
            margin:"30px auto",
            maxWidth:"500px",
            padding:"20px",
            textAlign:"center"
        }}>
             <input type="text" placeholder="title" 
             value={title}
             onChange={(e)=>setTitle(e.target.value)}
             />
             <input type="text" placeholder="body" 
             value={body}
             onChange={(e)=>setBody(e.target.value)}
             />
             <div class="file-field input-field">
                <div class="btn">
                    <span>Upload Image</span>
                    <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
                </div>
                <div class="file-path-wrapper">
                    <input class="file-path validate" type="text" />
                </div>
                </div>
                <button className="btn waves-effect waves-light"
                onClick={()=>PostDetails()}
                >
                Submit Post
            </button>

        </div>
    )
}
export default Createpost;