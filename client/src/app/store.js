import {configureStore} from '@reduxjs/toolkit';
import userReducer from '../features/user/UserSlice';
import diaryReducer from '../features/diary/DiarySlice'

export const store = configureStore({
    reducer: {
        user: userReducer,
        diary: diaryReducer
    }
});
