import React from 'react'
import AdminNavbar from '../../../components/AdminNavbar'
import ExamLandingPage from './ExamLandingPage'
import './Home.css'


function ExamHome() {
 
  return (
     <div className="main-contain">
        <div>
        <AdminNavbar />
        </div>
        <ExamLandingPage />
     </div>
     
  )
}

export default ExamHome