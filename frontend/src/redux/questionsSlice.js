import {createSlice} from '@reduxjs/toolkit';


const examstartSlice = createSlice({
    name:"questions",
    initialState: {
        question:{}
    },
    reducers:{
        questionSuccess: (state,action) => {
            state.question = action.payload;
          },
        questionRemove: (state) => {
            state.question = {};
        }
        
    }
})

export const { questionSuccess,questionRemove } = examstartSlice.actions;
export default examstartSlice.reducer;