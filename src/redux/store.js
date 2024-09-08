import chatReducer from './chatbot/chat.slice';
import avatarReducer from './chatbot/avatar.slice';
import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux';

export const store = configureStore({
    reducer:{
        chat: chatReducer,
        avatar: avatarReducer,
       },
       middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
        }),
})


export const useAppDispatch = () => useDispatch();

// Export the store's selector function
export const useAppSelector = useSelector;

export default store; 