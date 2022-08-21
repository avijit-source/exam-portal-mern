import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FcAnswers } from 'react-icons/fc';
import { BsFillJournalBookmarkFill } from 'react-icons/bs';
import {useSelector} from 'react-redux';

// import classNames from "classnames";

import "./Exam.css"
import QuestionForm from './QuestionForm';
import Timer from '../../components/Timer';
import { useCallback } from 'react';
import axios from 'axios';

function ExamPage() {

  const params = useParams();
  const {exampass} = useSelector((state) =>state.user.password.exampass); 
  const questionsObj = useSelector((state) => state.user.questions?.question?.exam?.questions)
  const examduration = useSelector((state) => state.user.questions?.question?.exam?.durations);
  
  const navigate = useNavigate()

  useEffect(() => {
      if(!exampass){
        navigate(`/exam/${params.id}`);
        toast.error("you are not authorized to access this page")
      }
  })



  const [timeUp,setTimeUp] = useState(false);
  const [active,setActive] = useState(0);
  const [answer,setAnswer] = useState([]);
  const [answerArr,setAnswerArr] = useState([]);
  const [bookmark,setBookmark] = useState([]);
  const [selected,setSelected] = useState(null);
    

     

    function handleSubmitConfirm(){
      const value = window.confirm("are you sure you want to submit");
      if(value===true){
        handleSubmit()
      }else{
        return false;
      }
    }
    function handleClick(e){
       e.preventDefault();
       setActive(e.target.id);

    }
    // console.log(questions);
    
    const handleSubmit = useCallback(()=>{
      const dup = [...answer];
      if(dup.length>0){
        const reversed = dup.reverse()
        const filtered = reversed.filter((v,i,a)=>a.findIndex(v2=>v2.question===v.question)===i);
      
        const arrAnswers = [];
        filtered.forEach((val,i)=>{
          checkLoop(val,i)
        })

        function checkLoop(v,idx){
           questionsObj.forEach((vall,inn)=>{
             if(inn===Number(v.question)){
               
                arrAnswers.push({_id:vall._id ,answer:Number(v.answer)+1})
             }
           })
          
        }

        const obj = {exam:params.id,answersheet:[...arrAnswers]}
        // console.log(questions);
        // console.log(obj);
        createResult(obj);
        // console.log(questions);
      }else{
        navigate("/");
      }
  //  console.log(result);
    },[answer,navigate,params.id,questionsObj])

    async function createResult(resObj){
      try{
      let res = await axios.post("/api/v1/result/new",resObj);
      if(res.data.success===true){
       navigate("/");
       toast.success("successfully exam given");
    }else{
        toast.error("error creating result");
       navigate("/");
    }
  }catch(e){
    toast.error(`${e.response.data.message}`);
    navigate("/");
  }
    }
 
   
    function handleBookMark(){
        if(!bookmark.includes(Number(active))){
          const arrNew = [...bookmark,Number(active)];
          const filtered = [...new Set(arrNew)]
          setBookmark(filtered)
        }
        // console.log(bookmark);
    }

    function removeBookmark(){
      // console.log(bookmark.includes(Number(active)));
        if(bookmark.includes(Number(active))){
          const idx = bookmark.findIndex(funcActive);
          function funcActive(v){
            return v===Number(active)
          }
          const newArr = [...bookmark]
          newArr.splice(idx,1)
          setBookmark(newArr)
        }
    }

    useEffect(() => {
      if(timeUp===true){
        handleSubmit()
        alert("time up")

      }
   },[timeUp,answer,handleSubmit])

   
    // const disableselect = (e) => {  
    //   return false  
    // } 
  
    // if(loading){
    //   return <h2>loading...</h2>
    // }
        return (
         
            <div
            // onContextMenu={(e)=>e.preventDefault()}
             >
              <div className="sidenav">
                {questionsObj?.map((val,i)=>{
                  return <button
                   id={i}
                   key={i}
                   onClick={handleClick}
                   className={answerArr.includes(i)?"attended":"not-attended"}
                   >
                      {Number(i)+1}
                      </button>
                })}
                <div style={{fontSize:"1.1em",fontWeight:"600",padding:"10px"}}>
                   <div style={{borderRadius:"5%",overflow:"scroll", height:"150px"}} className="bookmarkdiv">
                     <span className="notification" style={{marginTop:"10px"}}><BsFillJournalBookmarkFill />
                    <span className="badge"> {bookmark.length}</span> bookmarks </span>
                    {bookmark.map((val,i)=>{
                     return <span key={i} style={{border:"1px solid black",padding:"2px",margin:"2px",
                     backgroundColor:"white",color:"#ff0000",display:"inline-block"}}>Q{Number(val)+1}</span>
                   })}
                     </div>
                    
                   </div>
                   <br/>
                   <button onClick={handleSubmitConfirm} style={{color:"white"}} className="button-29">Submit Exam</button>
              </div>
               <div className="main">
                   <div style={{margin:"0px",padding:"0px",display:"flex",justifyContent:"center",alignItems:"center"}}>
                   
                   
                   {
                       bookmark.includes(Number(active)) && <button className="button-29" onClick={removeBookmark}>Remove Bookmark</button>
                     }
                     {
                       !bookmark.includes(Number(active)) && <button className="button-29" onClick={handleBookMark}>Add bookmark</button>
                     }
                     
                    
                    <Timer duration={examduration} setTimeUp={setTimeUp} timeUp={timeUp} />
                   </div>
                   
                 <QuestionForm
                  active={active}
                  selected={selected}
                  setSelected={setSelected}
                   answerArr={answerArr}
                    setAnswerArr={setAnswerArr}
                     questions={questionsObj}
                      answer={answer}
                       setAnswer={setAnswer}
                        setActive={setActive} />
                 
            </div>
            <div style={{fontWeight:"600",padding:"10px",marginLeft:"20%"}}>
                   <div style={{borderRadius:"5%"}}><span className="notification" ><FcAnswers />
                    <span className="badge">
                       {answerArr.length}</span> Answered </span>
                       {/* {answerArr.map((val,i)=>{
                    return <span key={i} style={{border:"2px solid black",
                    margin:"5px",
                    padding:"5px",
                    display:"inline-block",
                    backgroundColor:"white",color:"#084a05"}}>Q{Number(val)+1}</span>
                   })} */}
                        </div>
                        </div>
            
            
            </div>
            
           
          )
    
}

export default ExamPage