import {createSlice} from '@reduxjs/toolkit';


const examSlice = createSlice({
    name:"exams",
    initialState: {
        exams:[],
        isFetching:false,
        error:false
    },
    reducers:{
        examfetchStart: (state) => {
          state.isFetching = true;
        },
        examfetchSuccess: (state,action) => {
          state.isFetching = false;
          state.exams = action.payload;
        },
        examfetchFailure: (state) => {
          state.isFetching = false;
          state.error = true;
        },
        
        examfetchRemove:(state)=>{
          state.isFetching = false;
          state.error = false;
          state.exams=[]
        }
    }
})

export const {examfetchStart,examfetchSuccess,examfetchFailure,examfetchRemove } = examSlice.actions;
export default examSlice.reducer;