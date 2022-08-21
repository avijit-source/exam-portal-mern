import React from 'react'
import AdminNavbar from '../../../components/AdminNavbar'
import ExamForm from '../../../components/ExamForm'
import './Home.css'

function ExamNew() {
  return (
    <>
        <AdminNavbar />
        <div>
        <ExamForm />
        </div>
     </>
  )
}

export default ExamNew