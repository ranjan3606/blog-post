import { configureStore } from '@reduxjs/toolkit';
import blogReducer from './BlogReducer';

const store = configureStore({
  reducer: {
    blog: blogReducer,
  },
});

export default store;