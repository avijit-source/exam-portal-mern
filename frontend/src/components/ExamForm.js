import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import './examform.css';
import {motion} from "framer-motion";
import axios from 'axios';
import { toast } from 'react-toastify';

function ExamForm() {
    const params = useParams();
    const [hasId,setHasId] = useState(null);
    const [examdata,setExamdata] = useState({});
    const [manualQuestion,setManualQuestion] = useState({})
    const navigate = useNavigate();

    useEffect(() => {
        if(params.examId){
            setHasId(params.examId)
        }
    },[params,setHasId]);
    
    function handleInputChange(e){
        const {name,value} = e.target;

        if(name==="durations"){

        const newState = {...examdata,durations:parseInt(value)};
        setExamdata(newState)

        }else{
            const newState = {...examdata,[name]:value};
            setExamdata(newState)
        }
       
    }

    async function newExamPost(edata,str){
        if(str==="NEW"){
            try{
                const res = await axios.post("/api/v1/exam/new",edata);
                console.log(res.data);
                if(res.data.success){
                    toast.success("successfully added exam");
                    navigate(-1)
                }
            }catch(err){
                    toast.error(err.response.data.message);
            }
        }else if(str==="EDIT" && hasId!==null){
               try{
                  if(edata.questions){
                    const res = await axios.put(`/api/v1/exam/${hasId}`,{...edata,count:edata.questions.length});
                    console.log(res.data);
                    if(res.data.success){
                    toast.success("successfully updated exam");
                    navigate(-1);
                  }
                  }else{
                    const res = await axios.put(`/api/v1/exam/${hasId}`,edata);
                    console.log(res.data);
                    if(res.data.success){
                    toast.success("successfully updated exam");
                    navigate(-1);
                  }
                }
                  
               }catch(err){
                  toast.error(err.response.data.message)
               }
        }
    }

    function readExcel(file) {
        const promise = new Promise((resolve, reject) =>{
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file);

            fileReader.onload = (e) =>{
                const bufferArray = e.target.result;

                const wb = XLSX.read(bufferArray,{type:"buffer"});

                const wsname = wb.SheetNames[0];

                const ws = wb.Sheets[wsname];

                const data = XLSX.utils.sheet_to_json(ws);

                resolve(data);
            };

            fileReader.onerror =(error)=>{
                reject(error);
            }
        })
        promise.then(d=>{
            makeQuestionsObj(d)
        })
    }

    function makeQuestionsObj(arr){
        const newArr = arr.map(o=>{
            if(o.question && o.option1 && o.option2 && o.option3 && o.option4 && o.answer){
                return {
                    question:o.question,
                    options:[o.option1,o.option2,o.option3,o.option4],
                    answer:o.answer
                 }
            }else{
                return false;
            }     
        })
        newArr && setExamdata(prev=>({
            ...prev,
            questions:prev.questions ?[...prev.questions,...newArr] :newArr
        }))
    }

    function handleSubmitQuestion(e){
        const {name,value} = e.target;
        if(name==="answer"){
            const newObj = {...manualQuestion,[name]:parseInt(value)}
            setManualQuestion(newObj)
        }else{
            const newObj = {...manualQuestion,[name]:value}
            setManualQuestion(newObj)
        }
    }
    function handleSubmit(e){
        e.preventDefault();
        const newObj = {
            question:manualQuestion.question,
            options:[manualQuestion.option1,
                     manualQuestion.option2,
                     manualQuestion.option3,
                    manualQuestion.option4
                    ],
            answer:manualQuestion.answer        
        }
        const oldquestions = examdata.questions || [];
        oldquestions.push(newObj);
        setExamdata(prev=>({
            ...prev,
            questions:oldquestions
        }))
    }
    function handleExamSubmit(str){
        for(let key in examdata){
            if(examdata[key].length<1||
             examdata[key]===null ||
              examdata[key]===undefined || examdata[key].toString()==="NaN"){
                delete examdata[key];
              }
        }
        if(str==="edit"){
            console.log("edit page");
            newExamPost(examdata,"EDIT")
        }else if(str==="new"){
            console.log("new page");
            newExamPost(examdata,"NEW")
        }
    }

  return (
    <div className="examform">
        <h2 style={{textDecoration:"underline"}}>{hasId!==null?"Edit":"Add new"} exam</h2>
        <div className="uploadForm">
        <div className="firstForm">
        <h2>Enter exam details</h2>
        <form>
            <input type="text" placeholder="exam code" onChange={handleInputChange} name="examcode" minLength="4" required />
            <br />
            <input type="text" placeholder="exam password" onChange={handleInputChange} name="exampass" minLength="6" required />
            <br />
            <input type="number" placeholder="exam durations(minutes)" onChange={handleInputChange} name="durations" min="5" max="500" required />
            <br />
            <label htmlFor="file">upload excel file</label>
            <br />
            <input type="file" id="file" onChange={(e)=>{
                const file = e.target.files[0]
                if(file.name.split('.')[1]==="xlsx"){
                    readExcel(file)
                }else{
                    window.alert("please upload a valid xlsx file");
                }
            }} />
        </form>
        </div>
        <div className="secondForm">
            <h4>If you don't have excel file, manually type questions here</h4>
            <form onSubmit={handleSubmit}>
                <textarea name="question" cols="35" rows="5" placeholder="write a question"
                onChange={handleSubmitQuestion}
                ></textarea>
                <br />
                <input type="text" name="option1" onChange={handleSubmitQuestion} placeholder="option 1" />
                <br />
                <input type="text" name="option2" onChange={handleSubmitQuestion} placeholder="option 2" />
                <br />
                <input type="text" name="option3" onChange={handleSubmitQuestion} placeholder="option 3" />
                <br />
                <input type="text" name="option4" onChange={handleSubmitQuestion} placeholder="option 4" />
                <br />
                <label htmlFor="answerinput">choose correct option[1,2,3,4]</label>
                <br />
                <input type="number" name="answer" id="answerinput" onChange={handleSubmitQuestion} placeholder="correct option" />
                <br />
                <button type="submit" className="submitmanual"
                 disabled={manualQuestion.answer===undefined
                    ||  !manualQuestion.answer
                  || manualQuestion.answer>4 ||
                   manualQuestion.answer<0||
                   manualQuestion.question?.length<4||
                   manualQuestion.question===undefined||
                   manualQuestion.option1?.length<1||
                   manualQuestion.option1===undefined||
                   manualQuestion.option2?.length<1||
                   manualQuestion.option2===undefined||
                   manualQuestion.option3?.length<1||
                   manualQuestion.option3===undefined||
                   manualQuestion.option4?.length<1||
                   manualQuestion.option4===undefined
                   }>
                    add questions</button>
                <input type="reset" />
            </form>
        </div>
        {examdata?.questions?.length>0 && <motion.div className="preview"
         style={{overflowY:"scroll", height:"450px",marginTop:"20px"}}
         animate={{
            x: 0,
            y: 0,
            rotate: [0,360,0],
          }}
          transition={{ duration: 0.8 }}
         >
            <h2>Preview</h2>
            {examdata?.questions?.map((q,i)=>(
                <section key={i} style={{border:"2px solid black",maxWidth:"70%",marginLeft:"70px",
                marginBottom:"7px",backgroundColor:"#F2F9F7"}}>
                  <p>question-{i+1}: {q.question}</p>
                  <hr />
                  <p>option-1: {q.options[0]}</p>
                  <p>option-2: {q.options[1]}</p>
                  <p>option-3: {q.options[2]}</p>
                  <p>option-4: {q.options[3]}</p>
                  <hr />
                  <p>answer: {q.answer}</p>
                </section>
            ))}
        </motion.div> }
        
        </div>
      {hasId===null &&  <button
        className="buttonsubmit buttonsubmit2"
        onClick={() =>handleExamSubmit("new")}
        disabled=
        {examdata.questions===undefined
        || (examdata.examcode === undefined || examdata.examcode===""|| examdata.examcode?.length<4) ||
        (examdata.exampass === undefined || examdata.exampass==="" || examdata.exampass?.length<4) ||
          ( !examdata.durations || examdata.durations === undefined || examdata.durations<5) 
        }>
            upload exam</button>}

        {
            hasId!==null && <button
            className="buttonsubmit buttonsubmit2"
            onClick={()=>handleExamSubmit("edit")}
            disabled=
            {
               
             (examdata.examcode === undefined || examdata.examcode==="" || examdata.examcode?.length<4)
             && (examdata.exampass === undefined || examdata.exampass===""|| examdata.exampass?.length<4)
             && (!examdata.questions) && ( !examdata.durations || examdata.durations === undefined || examdata.durations<5)
             
             
            }>
                Edit exam</button>
        }
    </div>
  )
}

export default ExamForm;

// (examdata.examcode === undefined || examdata.examcode==="" || examdata.examcode?.length<4)
//                 && (examdata.exampass === undefined || examdata.exampass===""|| examdata.exampass?.length<4)
//                 && (examdata.durations === undefined || !examdata.durations && examdata?.durations<5 ) 
//                 && (examdata.questions===undefined)