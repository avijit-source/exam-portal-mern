import React from 'react';
import './App.css';
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from './pages/login/Login';
import Home from './pages/home/Home';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';

const Account  = React.lazy(()=>import('./pages/account/Account'))
const AccountDetails = React.lazy(()=>import('./pages/account/AccountDetails'))
const AccountForm = React.lazy(()=>import('./pages/account/AccountForm'))
const UpdatePassword = React.lazy(()=>import('./pages/account/UpdatePassword'));
const Exam = React.lazy(()=>import('./pages/exam/Exam'))
const ConfirmExam = React.lazy(()=>import('./pages/exam/ConfirmExam'));
const ExamPage = React.lazy(()=>import('./pages/exam/ExamPage'));
const ExamHome = React.lazy(()=>import('./pages/dashboard/exams/ExamHome'));
const UsersHome = React.lazy(()=>import('./pages/dashboard/users/UsersHome'))
const ResultsHome = React.lazy(()=>import('./pages/dashboard/results/ResultsHome'));
const ExamNew = React.lazy(()=>import('./pages/dashboard/exams/ExamNew'));
const ExamDetails = React.lazy(()=>import('./pages/dashboard/exams/ExamDetails'))
const ExamEdit = React.lazy(()=>import('./pages/dashboard/exams/ExamEdit'))
const ResultDetails = React.lazy(()=>import('./pages/dashboard/results/ResultDetails'))


function App() {
  const currentUser = useSelector((state) => state.user.user.currentUser);
  // const currUserExams = currentUser.user.exams;
  return (
    <div className="App"
    >
      <React.Suspense fallback="Loading...">
      <Routes>
        <Route path="/" element={!currentUser ? <Login /> : <Navigate to="/home" replace />} />
        <Route path="/home/"
         element={currentUser ? <Home /> : <Navigate to="/" replace /> } />
        <Route path="/exam" element={currentUser ? <ConfirmExam /> : <Navigate to="/" replace />}>
          <Route index element={<Exam />} />
          <Route path=":id" element={<Exam />} />
          <Route path=":id/start" element={<ExamPage />} />
        </Route>
        <Route path="/account" element={currentUser ? <Account /> : <Navigate to="/" replace /> }>
          <Route index element={<AccountDetails />}/>
          <Route path="profile" element={<AccountDetails />} />
          <Route path="edit" element={<AccountForm />} />
        </Route>
        <Route path="/update" element={currentUser ? <UpdatePassword /> : <Navigate to="/" replace />} />
        
        <Route path="/admin">
           <Route index element={currentUser?.user.role==="admin" ?<ExamHome /> : <Navigate to="/" replace />} />
           {/* <Route path="exams" element={currentUser?.user.role==="admin" ?<ExamHome /> : <Navigate to="/" replace />} /> */}
           <Route path="newexam" element={currentUser?.user.role==="admin" ?<ExamNew />: <Navigate to="/" replace />} />
           <Route path="examedit/:examId" element={currentUser?.user.role==="admin" ?<ExamEdit />: <Navigate to="/" replace />} />
           <Route path="examadmin/:examId" element={currentUser?.user.role==="admin" ?<ExamDetails />: <Navigate to="/" replace />} />
           <Route path="users" element={currentUser?.user.role==="admin" ?<UsersHome /> : <Navigate to="/" replace />} />
           <Route path="results" element={currentUser?.user.role==="admin" ?<ResultsHome /> : <Navigate to="/" replace />} />
           <Route path="resultadmin/:resultId" element={currentUser?.user.role==="admin" ?<ResultDetails />: <Navigate to="/" replace />} />
        </Route>
        <Route path="*" element={<p>there is nothing here</p>} />
      </Routes>
      </React.Suspense>
      <ToastContainer
      position="bottom-left"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      />
    </div>
  );
}

export default App;
