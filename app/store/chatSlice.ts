import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
  id: number;
  user: string;
  message: string;
  timestamp: string;
  isOwn: boolean;
}

interface ChatState {
  messages: Message[];
}

const initialState: ChatState = {
  messages: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      const exists = state.messages.find(msg => msg.id === action.payload.id);
      if (!exists) {
        state.messages.push(action.payload);
      }
    },
  },
});

export const { addMessage } = chatSlice.actions;
export default chatSlice.reducer;
