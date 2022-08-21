import React from 'react'
import {useForm} from 'react-hook-form';
import './Login.css';
import {AiOutlineLogin} from 'react-icons/ai';
import {useDispatch,useSelector} from 'react-redux';
import {login} from '../../redux/apiCalls';

function Login() {
 const {isFetching} = useSelector((state) =>state.user);
 const dispatch = useDispatch();
 const {register,handleSubmit,formState: {errors}} = useForm({criteriaMode: "all"});
 const onSubmit = data =>{
    login(dispatch,data);
 }
  return (
    <div className="loginclass">
     <form className="login" onSubmit={handleSubmit(onSubmit)}>
     <h3 style={{textAlign: 'center',color:"#05131F",marginBottom:'5%',fontSize:'1.5rem'}}><AiOutlineLogin /> Exam login</h3>
     <input type="text" name="userId" 
     {...register("userId",{validate:
      {miniLength:value=>value.length>3,
      maxiLength:value=>value.length<15}})}
      placeholder="Enter UserId" />
      {errors.userId && errors.userId.type ==="miniLength" && <span className="errormessage">enter userId greater than 3 characters</span>}
      {errors.userId && errors.userId.type ==="maxiLength" && <span className="errormessage">enter userId smaller than 15 characters</span>}
     
     <input type="password" name="password" {...register("password",
     {validate:
      {miniLength:value=>value.length>3,
      maxiLength:value=>value.length<20}}
     )} placeholder="Enter Password" />

      {errors.password && errors.password.type ==="miniLength" && <span className="errormessage">enter password greater than 3 characters</span>}
      {errors.password && errors.password.type ==="maxiLength" && <span className="errormessage">enter password smaller than 15 characters</span>}
      <button type="submit" id="submitBtn" disabled={isFetching && true}>{isFetching ? "loading.." : "Submit"}</button>
      </form>
    </div>
  )
}

export default Login