import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import ExamDetailsTable from './ExamDetailsTable';


function ExamDetailsPage() {
    const params = useParams();
    const [questions,setQuestions] = useState([]);
    const countRef = useRef(null)
    const [error,setError] = useState(false);
    const [loading,setLoading] = useState(true);
    useEffect(() => {
      if(params.examId){
        handleExam(params.examId)
      }
    },[params])
    async function handleExam(id){
        try{
           const {data} = await axios.get("/api/v1/exams");
           const val = data.exams.find(exam=>exam._id===id);
           const res = await axios.post(`/api/v1/exam/${id}`,{exampass:val.exampass});
           const finalRes = res.data;
          if(finalRes.success===true){
            const newArr = finalRes.exam.questions.map(q=>{
                return{
                    question:q.question,
                    option1: q.options[0],
                    option2: q.options[1],
                    option3: q.options[2],
                    option4: q.options[3],
                    answer:q.answer
                }
              })
              setQuestions(newArr)
              countRef.current = {count:finalRes.exam.count,
                createdBy:finalRes.exam.createdBy.userId,
                examcode:finalRes.exam.examcode}
          }
          setLoading(false);
        }catch(e){
            setError(true)
            console.log(e.response.data.message);
        }
    }

    if(error){
        return(
           <h2>Error occured please check connection</h2>
        )
    }
    if(loading===true){
        return(
            <div className="lds-hourglass"></div>
        )
    }else if(loading===false){
        return (
            <div>
                <ul style={{paddingTop:"10px",paddingBottom:"10px",fontWeight:"600",fontSize:"1.1em",marginLeft:"30%",width:"30%",backgroundColor:"whitesmoke",listStyleType:"none"}}>
                {countRef.current && <li>Exam Code: {countRef.current.examcode}</li>}
                {countRef.current && <li>Total questions:{countRef.current.count}</li>}
                {countRef.current && <li>Exam Created By(user Id): {countRef.current.createdBy}</li>}
                </ul>
                <ExamDetailsTable questions={questions} examcode={countRef.current.examcode} />
            </div>
          )
    }
  
}

export default ExamDetailsPage