import axios from 'axios';
import React, { useState } from 'react'
import { AiFillCloseCircle } from 'react-icons/ai'
import { toast } from 'react-toastify';
import "./userform.css"

function UserCreateForm({setModalIsOpen,fetchUsers}) {
    const [formVal,setFormVal] = useState({})
    function handleFormChange(e){
        let {name,value} = e.target;
        setFormVal(prev=>({...prev,[name]:value}))
    }
   
    function handleUserCreation(){
        if(!formVal.userId){
            window.alert("please enter a userId")
        }else if(!formVal.password){
            window.alert("please enter a password")
        }else if(formVal.userId.length<5){
            window.alert("userId must be at least 5 characters")
        }else if(formVal.password.length<5){
            window.alert("password must be at least 5 characters")
        }else{
            createUser(formVal)
        }

    }

    async function createUser(formVal){
          try{
            let result = await axios.post("/api/v1/register",formVal);
            if(result.data.success===true){
                toast.success("user successfully created");
                setModalIsOpen(false);
                fetchUsers()
            }else{
                toast.error("error creating user");
            }
          }catch(e){
            toast.error(`${e.response.data.message}`)
          }
    }

  return (
    <div className="formdiv">
     <h2>Create User</h2>
     <hr />
     <input type="text" name="userId" onChange={handleFormChange} placeholder="Enter userID" />
     <br />
     <input type="password" name="password" onChange={handleFormChange} placeholder='Enter password' />
     <br />
     <label htmlFor="role">Select Role</label>
     <select name="role" id="role" onChange={handleFormChange}>
        <option value="user">user</option>
        <option value="admin">admin</option>
     </select>
     <br />
     <button onClick={handleUserCreation}>Create User</button>
     <button onClick={()=>{
        setModalIsOpen(false);
     }}><AiFillCloseCircle /> close</button>
    </div>
  )
}

export default UserCreateForm