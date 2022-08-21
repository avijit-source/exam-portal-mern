import {createSlice} from '@reduxjs/toolkit';

const user = JSON.parse(window.localStorage.getItem("user"));


const userSlice = createSlice({
    name:"user",
    initialState: {
        currentUser:user ? user : null,
        isFetching:false,
        error:false
    },
    reducers:{
        loginStart: (state) => {
          state.isFetching = true;
        },
        loginSuccess: (state,action) => {
          state.isFetching = false;
          state.currentUser = action.payload;
        },
        loginFailure: (state) => {
          state.isFetching = false;
          state.error = true;
        },
        logoutSuccess: (state) => {
          state.isFetching = false;
          state.currentUser = null;
        },
        logoutFailure: (state) => {
          state.isFetching = false;
          state.error = true;
        }
    }
})

export const {loginStart, loginSuccess, loginFailure,logoutSuccess,logoutFailure } = userSlice.actions;
export default userSlice.reducer;