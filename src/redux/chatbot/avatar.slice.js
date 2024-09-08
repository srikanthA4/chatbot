// src/slices/avatarSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for generating avatar
export const generateAvatar = createAsyncThunk(
  'avatar/generateAvatar',
  async (userInput, thunkAPI) => {
    try {
      const response = await axios.post('https://api.d-id.com/animations', {
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_AVATAR_API_KEY}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      });
      return response.data.avatarUrl;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const avatarSlice = createSlice({
  name: 'avatar',
  initialState: {
    avatarUrl: '',
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateAvatar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateAvatar.fulfilled, (state, action) => {
        state.loading = false;
        state.avatarUrl = action.payload;
      })
      .addCase(generateAvatar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default avatarSlice.reducer;
