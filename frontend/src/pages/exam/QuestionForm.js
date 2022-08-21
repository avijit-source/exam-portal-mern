import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ImQuestion } from 'react-icons/im';
import {motion} from "framer-motion";
import './Question.css'


function QuestionForm(props) {
  const {active,questions,setActive,answer,setAnswer,setAnswerArr,answerArr,selected,setSelected} = props;
  const [radio,setRadio] = useState(null);
  const [answered,setAnswered] = useState([])
  
  
  const handleChange = (e) => {
      
      setRadio(e.target.id);
  
      // console.log(e.target.id);
  }
  const handleSave = (e) => {
      // console.log(answer);
      if(!answerArr.includes(Number(active))){
          setAnswerArr(prev=>[...prev,Number(active)])
      }
      const newArr = [...answer];
      const answered2 = [...answered]
      if(answered2.includes(active)===false){
        setAnswered(prev=>[...prev,Number(active)]);
        const objec = {};
        objec.question = Number(active);
        objec.answer = Number(radio);
        // console.log(objec);
        setAnswer(prev=>[...prev,objec]);
        // console.log(answer);
        return
      }else{
        // console.log(newArr);
        const idx = newArr.findIndex(func);
        function func(newArr){
          return newArr.question==Number(active);
        }
        if(idx!==-1){
          // const newObj = {};
          newArr[idx].answer=Number(radio);
          setAnswer([...newArr])  
        }
      }
      
       
  }
  
  
  const handleBack = (e) => {
    setActive(Number(active)-1);
    setRadio(null);
  }

  const handleNext = (e) => {
    setActive(Number(active)+1);
    setRadio(null);
  }

  
 useEffect(() => {
   setRadio(null);
 },[active])
  
 useEffect(() => {
   
    if(answer.length>0){
      const reversed = [...answer].reverse();
      const filtered = reversed.filter((v,i,a)=>a.findIndex(v2=>v2.question===v.question)===i);

      for(let v of filtered){
        if(Number(v.question)===Number(active)){
          setSelected(v.answer)
        }
      }
    }
    return ()=>{
      setSelected(null);
      
    }
 }) 

 useEffect(() => {
  toast.success("saved",{duration:1000})
 },[answer])

  return (
    
    <motion.div className="examdiv" animate={{x:[0,100,0]}} transition={{ duration: 0.5 }}>
                <p style={{color:selected!==null?"green":"red"}}>Saved Answer : {selected!==null && Number(selected)+1}</p>
                <div className="questionName">
                  {questions && <p style={{color:selected!==null?"green":"red"}}>
                    <ImQuestion /> Q{Number(active)+1})  {questions[Number(active)]?.question}</p>}
                </div>
                  <div className="radiodiv">
                  {
                    questions && questions[active].options.map((val,i)=>{
                         return(
                            
                            <label className="radio" key={i}>
                            <input type="radio" value={val} key={i} id={i} name="questions" onClick={handleChange} />
                              <span>
                                {i===0?"A) ":""}
                                {i===1?"B) ":""}
                                {i===2?"C) ":""}
                                {i===3?"D) ":""}
                                {val}</span></label>
                         )
                    })
                  }
                  
                  </div>

                <div className="exambtndiv">
                <button disabled={active==0} onClick={handleBack} className="button-29">back</button>
                <button disabled={radio===null} onClick={handleSave} className="button-29">Save answer</button>
                <button disabled={active==questions?.length-1 || false} onClick={handleNext} className="button-29">next</button>
                
                </div>
    </motion.div>
  )
}


export default QuestionForm