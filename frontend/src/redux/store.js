import {combineReducers, configureStore} from '@reduxjs/toolkit';
import userReducer from './userSlice';
import examReducer from './examSlice';
import examstartReducer from './examStartSlice'
import questionReducer from './questionsSlice'

const rootReducer = combineReducers({ user: userReducer, exams:examReducer,password:examstartReducer,questions:questionReducer });
export const store = configureStore({
    reducer: {
        user:rootReducer
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})
