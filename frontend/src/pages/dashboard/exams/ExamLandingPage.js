import axios from 'axios';
import React, { useCallback, useRef } from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import ExamTable from './ExamTable';
function ExamLandingPage() {
  const examCountRef = useRef(null);
  const [examStatus,setExamStatus] = useState("FETCHING");
  const [exams,setExams] = useState([]);

  const fetchAllExams = useCallback(async() => {
     
    try{
      const res = await axios.get("/api/v1/exams");
      if(res.data.success===true){
        examCountRef.current = res.data.totalExams
        setExams(res.data.exams);
        setExamStatus("LOADED");
      }else{
        setExamStatus("ERROR");
      }
    }catch(e){
      setExamStatus("ERROR");
      console.log(e);
    }
    console.log(examStatus);
},[]) 


  useEffect(() => {
     fetchAllExams();
     return ()=>{
       setExamStatus("IDLE");
     }
  },[fetchAllExams]);


  if(examStatus==="ERROR"){
    return <h2 style={{textAlign:"center",marginLeft:"0%",marginTop:"5%",color:"#030202",fontSize:"30px",fontWeight:"600"}}>
       ERROR TRY AGAIN
    </h2>
  }else if(examStatus==="FETCHING"){
    return <div className="lds-hourglass"></div>
    // return <h2 style={{textAlign:"center",marginLeft:"15%",marginTop:"5%",color:"#030202",fontSize:"30px",fontWeight:"600"}}>LOADING...</h2>
  }else if(examStatus==="LOADED"){
    return (
        <div className="tableFlex">
          <ExamTable exams={exams} examCountRef={examCountRef} fetchAllExams={fetchAllExams} />
        </div>
    )
  }
}

export default React.memo(ExamLandingPage) 