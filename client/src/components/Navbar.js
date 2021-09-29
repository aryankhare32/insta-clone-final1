import React,{useContext} from "react"
import {Link,useHistory} from "react-router-dom"
import { UserContext } from "../App"


const Navbar = () =>{
  const{state,dispatch} = useContext(UserContext)
  const history = useHistory()
  const renderList= ()=>{
    if(state){
      return [
        <li><Link to="/profile">Profile</Link></li>,
        <li><Link to="/create">Create Post</Link></li>,
        <li><Link to="/myfollowingpost">My Following Posts</Link></li>,
        <li>
          <button className="btn #ff8a80 red accent-1"
            onClick={()=>{
              localStorage.clear()
              dispatch({type: "CLEAR"})
              history.push("/signin")
            }
            }>
                LogOut
            </button>
        </li>

      ]
    }else {
      return[
        <li><Link to="/signin">SingIn</Link></li>,
        <li><Link to="/signup">SignUp</Link></li>
        
      ]
    }
  }
    return(
        <nav>
    <div className="nav-wrapper white">
      <Link to={state? "/" :"/signin"} className="brand-logo left">Instagram</Link>
      <ul id="nav-mobile" className="right ">
        {renderList()}

      </ul>
    </div>
  </nav>
    )
}
export default Navbar