import React, { useEffect, useState } from 'react'
import { FcClock } from 'react-icons/fc';


function Timer({duration,setTimeUp}) {
  // const [seconds,setSeconds] = useState(0);
  // const [minutes,setMinutes] = useState(duration);
  
  // useEffect(() => {
  //   console.log("effect");
  //   const timer = setTimeout(() =>{
  //     setSeconds(seconds-1);
  //      if(minutes===0 && seconds === 0){
  //         setTimeUp(true);
  //     }
  //      if(seconds === 0){
  //          setSeconds(59);
  //          setMinutes(minutes-1);
  //      }
  //      return ()=>clearTimeout(timer)
  //   },1000)
  // },[minutes,seconds])
 console.log("render");
   const [countDown,setCountDown] = useState(0);
   
   useEffect(() =>{
    let timerId;
    setCountDown(Number(duration)*60);
    timerId = setInterval(()=>{
       setCountDown((prev)=>prev-1);
    },1000);

    return ()=>clearInterval(timerId)
   },[])

   useEffect(() => {
     if(countDown<0){
      setTimeUp(true);
      setCountDown(0);
     }
   },[countDown]);

   const seconds = String(countDown%60).padStart(2,0);
   const minutes = String(Math.floor(countDown/60)).padStart(2,0);
  return (
    <div>
      <h4 className="glow">
         <FcClock />
                      {/* {minutes?.toString().length<2 ? "0"+minutes : minutes} :
                    {seconds?.toString().length<2 ? "0"+seconds : seconds}  */}
                    {`${minutes} : ${seconds}`}
                    </h4>
    </div>
  )
}

export default Timer