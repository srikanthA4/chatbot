import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const llmApiUrl = process.env.REACT_APP_LLM_API_URL;

// Async thunk for sending user message and getting response
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (userMessage, thunkAPI) => {
    try {
      const response = await axios.post(`${llmApiUrl}`, {
        prompt: userMessage,
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_LLM_API_KEY}`,
          'Content-Type': 'application/json',
        }
      });
      return response.data.message;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],
    loading: false,
    error: null,
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push({ sender: 'bot', text: action.payload });
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addMessage } = chatSlice.actions;
export default chatSlice.reducer;