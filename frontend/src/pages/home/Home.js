import React, { useEffect } from 'react';
import Navbar from '../../components/Navbar';
import './Home.css';
import { BiTime } from 'react-icons/bi';
import {useDispatch,useSelector} from 'react-redux';
import {fetchexams} from '../../redux/apiCalls';
import { useNavigate } from 'react-router-dom';
import {motion} from "framer-motion";

function Home() {
  const dispatch = useDispatch();
  useEffect(()=>{
     fetchexams(dispatch);
  },[dispatch])
  const navigate = useNavigate()
  
  const {isFetching,error,exams} = useSelector((state) =>state.user.exams);

  if(error) {
    window.localStorage.removeItem("user");
  }
//  console.log(exams);
  return (
    <>
    <div>
     <header>
       <Navbar />
     </header>
     <main>
       {isFetching && <h2>loading exams...</h2>}
       {error &&<h2>connection error,no result found</h2>}
       {exams.success && <main>
         <h2>Available exams</h2>
         <div className="row">
         <motion.div className="column"  animate={{ x: [0, 100, 0] }}
           transition={{ duration: 1 }}
           >
           {exams.exams.map((exam)=>(
             <div className="card" key={exam._id}>
             <h3>Exam name: {exam.examcode}</h3>
             <span><BiTime /> Duration : {exam.durations} minutes</span>
             <p>total questions: {exam.count}</p>
             <button className="button" onClick={()=>navigate(`/exam/${exam._id}`)}>Attend now</button>
             </div>
           ))}
         </motion.div>
       </div>
       </main>} 
     </main>
    </div>
    </>
   
  )
}

export default Home