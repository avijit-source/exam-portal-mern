import axios from 'axios';
import React, { useState } from 'react'
import {useForm} from 'react-hook-form';
import { useDispatch,useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {loginSuccess} from '../../redux/userSlice';
// import {fetchexams, logout} from '../../redux/apiCalls';

function AccountForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [disabled,setDisabled] = useState(false);
  const [avatar,setAvatar] = useState(null);
  const {currentUser} = useSelector((state) =>state.user.user);
  const currUser = currentUser?.user;
  // console.log(currUser);
  const userId = currUser._id;
// let avatar;
 const {register,handleSubmit,reset,formState: {errors}} = useForm({criteriaMode: "all"});
 const fileChangedHandler = (e) => {
  //  e.preventDefault();
  const reader = new FileReader();
  const image = e.target.files[0];
  reader.onload = () =>{
    if(reader.readyState===2){
       setAvatar(reader.result)
    }
  }
  if(!image.name.match(/\.(jpg|jpeg|png)$/)){
    toast.error("wrong file selected...choose an image file");
     return false;
    }else{
       reader.readAsDataURL(image);
   }
}
 const onSubmit = async(data,e) =>{
    e.preventDefault();
    setDisabled(true);
    let newData = {...data,avatar};
    try{
      const id = toast.loading("Updating....Please wait",{autoClose:3000})
      const data = await axios.put(`/api/v1/updateuser/${userId}`,newData);
      const rightuser = data.data;
      // console.log(data.data);
      dispatch(loginSuccess(rightuser));

      // fetchexams(dispatch);
      window.localStorage.removeItem("user");
      window.localStorage.setItem("user",JSON.stringify(rightuser));
      e.target.reset()
      toast.update(id, {autoClose:3000, render: "Updated Successfully", type: "success", isLoading: false });
    }catch(err){
      toast.error(err.response.data.message);
    }
    setDisabled(false);
    reset();
    setTimeout(()=>{
      toast.dismiss();
    },3000);
    // logout(dispatch);
    // toast("login again to see changes");
 }
  
    if(!currUser){
      return(
        <h2>login failed</h2>
      )
    }else return (
    <div className="loginclass">
     <form className="login" onSubmit={
      handleSubmit(onSubmit)}>
     <input type="text" name="name" 
     {...register("name",{
      required:"name is required",
      pattern:{
        value:/^[a-zA-Z\s]+$/,
        message: "Please enter a valid name"
      },
      validate:
      {miniLength:value=>value.length>3,
      maxiLength:value=>value.length<20}})}
      placeholder="Enter full name" />
      {errors.name && errors.name.type ==="miniLength" && <span className="errormessage">enter userId greater than 3 characters</span>}
      {errors.name && errors.name.type ==="maxiLength" && <span className="errormessage">enter name smaller than 20 characters</span>}
      <span className="errormessage">{errors.name?.message}</span>

     <input type="email" name="email" {...register("email",
     {
        required:"enter your email address",
         pattern:{
             value: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
             message: "invalid email address"
         }
      }
     )} placeholder="Enter email address" />

      <span className="errormessage">{errors.email?.message}</span>

      <input type="text" name="mobile" {...register("mobile",
     {
      required:"mobile is required",
         pattern:{
             value: /^[6-9]\d{9}$/gi,
             message: "invalid mobile number"
         }
      }
     )} placeholder="Enter mobile number" />

      <span className="errormessage">{errors.mobile?.message}</span> 

      
        <div className="button-wrap">
        <label htmlFor="upload" style={{display:'block',margin:"1rem",textAlign:"center",color:"#0b2e66",fontWeight:"600"}}>upload picture</label>
        <input
       onChange={fileChangedHandler}
        id="upload"
        accept='image/*'
         type="file"/>
      </div>
      
      <button type="submit"
       disabled={disabled}
        id="submitBtn"
        >
           {disabled ? "loading..." :"Submit"}
           </button>
           {currUser?.name && <button style={{marginLeft:"10px"}} id="submitBtn"
           disabled={disabled}
            onClick={()=>navigate("/account/profile")}>
              My Profile
             </button> }
      </form>
    </div>
  )
}

export default AccountForm