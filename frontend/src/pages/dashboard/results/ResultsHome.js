import AdminNavbar from '../../../components/AdminNavbar'
import ResultTable from './ResultTable'
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify';

function ResultsHome() {
  const [resultData,setResultData] = useState([]);
  const [resCount,setResCount] = useState(0);
  const [loading,setLoading] = useState(true)
  
  const getTableDataAsync = useCallback(async ()=>{
    try{
        const res = await axios.post("/api/v1/results");
        if(res.data.success===true){
            mapResData(res.data)
          }else{
            toast.error(`error occured`);
            return false;
          }
    }catch(e){
        toast.error(`${e.response.data.message}`)
    }
})

  useEffect(() => {
     getTableDataAsync()
  },[])
  

 function mapResData(resobj){
      setResCount(resobj.totalResults) 
      
      const newresArr = resobj.results.map(res=>{
        const formatDate = new Date(res.createdAt)
        .toLocaleString("en-IN").split(",");
        return {Examname:res.exam.examcode
          ,Studentname:res.student.userId,
         Totalquestions:res.total,
         Attended:res.attended,
         Correct:res.correct,
         Createdat:res.createdAt,
         SubmittedAt:formatDate[1],
         id:res._id
        }
      })
      setResultData(newresArr);
      setLoading(false);
  }

 
  return (
    <>
    <AdminNavbar />
    <div>
      {loading===true?<div className="lds-hourglass"></div>:
      <ResultTable resultData={resultData} getTableDataAsync={getTableDataAsync} resCount={resCount} />
      }
    </div>
   </>
  )
}

export default ResultsHome