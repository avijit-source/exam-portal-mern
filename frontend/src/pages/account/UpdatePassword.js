import axios from 'axios';
// import e from 'express';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { logout } from '../../redux/apiCalls';
import "./UpdatePassword.css";

function UpdatePassword() {
 const navigate = useNavigate()
  const [disabled,setDisabled] = useState(false);
  const dispatch = useDispatch();
  const {register,handleSubmit,formState: {errors},getValues,watch} = useForm({criteriaMode: "all"});
  async function updatepassword(val){
      setDisabled(true)
      try{
      const id = toast.loading("Updating....Please wait",{autoClose:3000})
      await axios.put("/api/v1/password/update",val);
      toast.update(id, {autoClose:3000, render: "Updated Successfully", type: "success", isLoading: false });
      logout(dispatch);
      }catch(err){
        toast.error(err.response.data.message);
      }
  }
  const onSubmit = data =>{
    updatepassword(data);
    setTimeout(()=>{
        toast.dismiss();
    },3000);
    setDisabled(false);
 }
function accountNavigate(e){
  e.preventDefault();
  navigate("/account")
}


  return (
        <div className="modal-content">
         <form className="login" onSubmit={handleSubmit(onSubmit)}>
     <h3 style={{textAlign: 'center',color:"#05131F",marginBottom:'5%',fontSize:'1.5rem'}}> Update password</h3>
     <input type="password" name="oldPassword" 
     {...register("oldPassword",
     {
      required:"this field is required",
      validate:
      {miniLength:value=>value.length>3,
      maxiLength:value=>value.length<20}})}
      placeholder="Enter Your old password" />
      {errors.oldPassword && errors.oldPassword.type ==="miniLength" && <span className="errormessage">enter password greater than 3 characters</span>}
      {errors.oldPassword && errors.oldPassword.type ==="maxiLength" && <span className="errormessage">enter password smaller than 15 characters</span>}
     
     <input type="password" name="newPassword" {...register("newPassword",
     { required:"this field is required",
       validate:
      {miniLength:value=>value.length>3,
      maxiLength:value=>value.length<20}}
     )} placeholder="Enter your new Password" />
     {errors.newPassword && errors.newPassword.type ==="miniLength" && <span className="errormessage">enter new password greater than 3 characters</span>}
      {errors.newPassword && errors.newPassword.type ==="maxiLength" && <span className="errormessage">enter new password smaller than 15 characters</span>}
    
    <input type="password" name="varifyPassword" {...register("varifyPassword",
     {
      required:"this field is required",
      validate:{
          matchpass:value=>value===watch("newPassword")
      }
      }
     )} placeholder="confirm Password" />
     {watch("varifyPassword")!== watch("newPassword") && getValues("varifyPassword") ? (<span className="errormessage" style={{display:"block"}}>password do not match</span>) : null}
      <div className="btn-group">
      <button type="submit" disabled={disabled}>Update Password</button>
      <button disabled={disabled}
       style={{display:"block"}}
          onClick={accountNavigate}>
            Back to Account
          </button>
      </div>
      </form>
         </div>
  )
}

export default UpdatePassword