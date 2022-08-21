import axios from 'axios';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminNavbar from '../../../components/AdminNavbar'
import MarksheetTable from './marksheet';

function ResultDetails() {
  const { resultId } = useParams();
  const [resultData,setResultData] = useState([]);
  useEffect(() => {
      if(resultId){
        getSingleResult(resultId);
      }
  }, [resultId])

  async function getSingleResult(id) {
    try {
      let res = await axios.post("/api/v1/result/get", { id });
      if (res.data.success === true) {
        let answersheet = res.data.result.answersheet        
        let ques = res.data.result.exam.questions;
        let answerObj = answersheet.map((val,i)=>{
          let temp = ques.find(el=>el._id===val._id);
          if(temp.question){
            val.question = temp.question;
            val.questionCorrectAns = temp.answer;
            val.option1 = temp.options[0];
            val.option2 = temp.options[1];
            val.option3 = temp.options[2];
            val.option4 = temp.options[3];
          }
          return val;
        })
        let resObj = {};
        resObj.userId = res.data.result.student.userId;
        resObj.examname = res.data.result.exam.examcode;
        resObj.totalquestions = res.data.result.total;
        resObj.attended = res.data.result.attended;
        resObj.correct = res.data.result.correct;
        resObj.timeofsubmit = new Date(res.data.result.createdAt).toLocaleString("en-IN");
        resObj.answersheet = [...answerObj];
        setResultData(resObj);
      } else {
        toast.error(`error occured`);
        return false;
      }
    } catch (e) {
      toast.error(`${e.response.data.message}`)
    }
  }


  return (
    <>
      <AdminNavbar />
      <div>
        <MarksheetTable resultData={resultData} />
      </div>
    </>
  )
}

export default ResultDetails