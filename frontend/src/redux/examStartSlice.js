import {createSlice} from '@reduxjs/toolkit';


const examstartSlice = createSlice({
    name:"exampassword",
    initialState: {
        exampass:"",
    },
    reducers:{
        exampassSuccess: (state,action) => {
            state.exampass = action.payload;
          },
          exampassRemove:(state)=>{
            state.exampass = ""
          }
        
    }
})

export const { exampassSuccess,exampassRemove } = examstartSlice.actions;
export default examstartSlice.reducer;