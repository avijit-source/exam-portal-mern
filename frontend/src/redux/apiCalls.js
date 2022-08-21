import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {loginStart,loginSuccess,loginFailure,logoutSuccess,logoutFailure} from './userSlice';
import { examfetchStart,examfetchSuccess,examfetchFailure,examfetchRemove } from './examSlice';
import { questionSuccess,questionRemove } from './questionsSlice';
import {exampassRemove} from './examStartSlice';

export let login = async(dispatch,user) => { 
    dispatch(loginStart());
    try{
        const res = await axios.post("/api/v1/login",user);
        dispatch(loginSuccess(res.data));
        window.localStorage.setItem("user",JSON.stringify(res.data));
        toast.success(`welcome,${res.data.user.userId}`);
    }catch(err){
        dispatch(loginFailure());
        toast.error(`${err.response.data.message}`);
    }
}

export let logout = async(dispatch) =>{
       dispatch(questionRemove());
       dispatch(exampassRemove());
       dispatch(examfetchRemove());
    try{
        await axios.get("/api/v1/logout");
        dispatch(logoutSuccess());
        window.localStorage.removeItem("user");
        toast.success("logout successful")
    }catch(err){
        dispatch(logoutFailure());
        toast.error(`${err.response.data.message}`)
    }
}

export let fetchexams = async(dispatch) =>{
    dispatch(examfetchStart())
    try{
        const res = await axios.get("/api/v1/exams");
        dispatch(examfetchSuccess(res.data))
    }catch(err){
        dispatch(examfetchFailure());
        toast.error(`${err.response.data.message}`)
    }
}

export let questionsfetch = async(dispatch,obj) =>{
    try{
        const res = await axios.post(`/api/v1/exam/${obj.id}`,{exampass:obj.exampass});
        dispatch(questionSuccess(res.data));
    }catch(err){
        toast.error(`${err.response.data.message}`);
    }
}



