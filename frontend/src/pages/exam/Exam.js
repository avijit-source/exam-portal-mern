import axios from 'axios';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import {useDispatch} from 'react-redux';
import { exampassSuccess } from '../../redux/examStartSlice';
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import './Exam.css'
import { questionSuccess } from '../../redux/questionsSlice';
function Exam() {
  const params = useParams();
  const {pathname} = useLocation();
  const dispatch = useDispatch()
  const [disable,setDisable] = useState(false)
  const navigate = useNavigate();
  const {register,handleSubmit,reset,formState: {errors}} = useForm({criteriaMode: "all"});
  const onSubmit = (data)=>{
    examdetailsfetch(data)
  }
  // console.log(`${pathname}/start`);
  // console.log(pathname)
  async function examdetailsfetch(val){
      try{
        setDisable(true)
        setDisable(false)
        dispatch(exampassSuccess(val));
        examFetchQuestions({id:params.id,exampass:val})
        
      }catch(err){
        // toast.error(`${err.response.data.message}`);
        setDisable(false)
      }
  }
  
  
  async function examFetchQuestions(o){
    const {exampass} = o.exampass;
    try{
      const res = await axios.post(`/api/v1/exam/${o.id}`,{exampass});
      dispatch(questionSuccess(res.data));
      navigate(`${pathname}/start`,{replace:true});

  }catch(err){
      toast.error(`${err.response.data.message}`)
  }
  }

  function handleExam(e){
     e.preventDefault();
     reset();
     navigate("/");
  }
  // console.log(params.id);
  let styles = {color: 'red',fontSize:"1.3em",fontWeight:"bold",display:"block",marginBottom:"10px"}
  
  return (
    <div>
      <section style={{marginBottom:"20px"}}>
        <h2 className="animate-charcter">Please read the instructions carefully.</h2>
        <ul style={{listStyle: 'none'}}>
          <li style={styles}>Do not refresh or quit the browser,otherwise your exam will be reset</li>
          <li style={styles}>You can not attend same exam twice</li>
          <li style={styles}>If you click submit button you will be redirected to confirm page</li>
          <li style={styles}>If exam time is over your exam will submitted automatically</li>
        </ul>
      </section>
      <section>
      <form style={{marginTop:"40px"}} className="login" onSubmit={handleSubmit(onSubmit)}>
     <input type="text" name="exampass" 
     {...register("exampass",
     {
      required:"this field is required",
      validate:
      {miniLength:value=>value.length>3,
      maxiLength:value=>value.length<20}})}
      placeholder="Enter exam password" />
      {errors.exampass && errors.exampass.type ==="miniLength" && <span className="errormessage">enter password greater than 3 characters</span>}
      {errors.exampass && errors.exampass.type ==="maxiLength" && <span className="errormessage">enter password smaller than 15 characters</span>}
      <div>
      <button  type="submit" style={{marginBottom:"10px"}} className="button-29" disabled={disable}>Start exam</button>
      <button
       className="button-29" 
       disabled={disable}
          onClick={handleExam}>
            Back to home
          </button>
      </div>
      </form>
      </section>
    </div>
  )
}

export default Exam