import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { postData } from "../../service/ApiService";
import ENDPOINTS from "../../service/ApiEndpoints";
import { GetTileApiResponse } from "../../service/ApiResponses/GetTileDataApiResponse";

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  createdAt: string;
  isFailed?: boolean;
}

export interface GuideState {
  messages: ChatMessage[];
  isSendingMessage: boolean;
  isStreaming: boolean;
  isLoading: boolean;
  tilesData: {
    breathe: null | GetTileApiResponse;
    align: null | GetTileApiResponse;
    reflect: null | GetTileApiResponse;
    regulate: null | GetTileApiResponse;
  };
}

const initialState: GuideState = {
  messages: [],
  isSendingMessage: false,
  isStreaming: false,
  isLoading: false,

  tilesData: {
    breathe: null,
    reflect: null,
    align: null,
    regulate: null,
  },
};

export const streamAndSaveMessage = createAsyncThunk(
  "guide/streamAndSaveMessage",
  async (
    { userMessage, category }: { userMessage: string; category?: string },
    { dispatch, rejectWithValue, getState }
  ) => {
    // 1. Get current messages for context/history
    const { messages } = (getState() as { guide: GuideState }).guide;

    // Map current messages to the required API chat history format
    const chatHistory = messages
      .filter((msg) => msg.text) // Only include messages with content
      .map((msg) => ({
        role: msg.isUser ? "user" : "assistant",
        content: msg.text,
      }));

    const userMessageId = `user-${Date.now()}`;
    const aiMessageId = `ai-${Date.now()}`;

    // Dispatch synchronous UI updates
    dispatch(
      addTempUserMessage({
        id: userMessageId,
        text: userMessage,
        isUser: true,
        createdAt: new Date().toISOString(),
      })
    );
    dispatch(
      addTempAIMessage({
        id: aiMessageId,
        text: "",
        isUser: false,
        createdAt: new Date().toISOString(),
      })
    );
    dispatch(setStreaming(true));
    dispatch(setSendingMessage(true));

    try {
      // Post the data. It returns the full, buffered stream string in `response.data`.
      const response = await postData(ENDPOINTS.sendmessage, {
        content: userMessage,
        chatHistory: chatHistory, // Send the current history
        category: category, // Send the selected category
      });

      if (response.status !== 200 || !response.data) {
        throw new Error(`API error: Status ${response.status}`);
      }

      const fullStreamString: any = response.data;

      // 1. Split the string into individual lines/data events
      const lines = fullStreamString
        .split("\n")
        .map((line: string) => line.trim())
        .filter((line: string) => line.startsWith("data:"));

      for (const line of lines) {
        // 2. Remove the "data: " prefix
        const jsonStr = line.replace(/^data:\s*/, "").trim();

        if (jsonStr === "[DONE]") {
          // We've reached the end of the stream content
          break;
        }

        try {
          // 3. Parse the JSON payload
          const data = JSON.parse(jsonStr);
          if (data.content) {
            // 4. Dispatch each content chunk to update the UI
            dispatch(appendChunkToAIMessage(data.content));
            await new Promise((resolve) => setTimeout(resolve, 20));
          }
        } catch (e) {
          console.warn("Skipping malformed JSON line:", jsonStr, e);
        }
      }

      return { success: true };
    } catch (error: any) {
      console.error("Streaming error:", error);
      dispatch(markMessageAsFailed(userMessageId));
      return rejectWithValue(error.message || "Failed to process AI response.");
    } finally {
      // Ensure final state is set regardless of success or failure
      dispatch(setSendingMessage(false));
      dispatch(setStreaming(false));
    }
  }
);

const guideSlice = createSlice({
  name: "guide",
  initialState,
  reducers: {
    // --- Loading/Status Reducers ---
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setSendingMessage: (state, action: PayloadAction<boolean>) => {
      state.isSendingMessage = action.payload;
    },
    setStreaming: (state, action: PayloadAction<boolean>) => {
      state.isStreaming = action.payload;
    },
    // Set all messages (used for clearing or initial load)
    setMessages: (state, action: PayloadAction<ChatMessage[]>) => {
      state.messages = action.payload;
    },

    // --- Core Chat Logic ---
    addTempUserMessage: (state, action: PayloadAction<ChatMessage>) => {
      // Add the user's message
      state.messages.push(action.payload);
    },
    addTempAIMessage: (state, action: PayloadAction<ChatMessage>) => {
      // Add the empty AI message for the "Typing..." indicator
      state.messages.push(action.payload);
    },

    appendChunkToAIMessage: (state, action: PayloadAction<string>) => {
      const lastAIMessageIndex = state.messages
        .slice()
        .reverse()
        .findIndex((msg) => !msg.isUser && !msg.id.startsWith("ai-final-"));

      if (lastAIMessageIndex !== -1) {
        const originalIndex = state.messages.length - 1 - lastAIMessageIndex;
        state.messages[originalIndex].text += action.payload;
      }
    },

    updateLatestAIMessage: (state, action: PayloadAction<string>) => {
      // This is now slightly redundant but can be kept for final cleanup/failsafe
      const lastAIMessageIndex = state.messages
        .slice()
        .reverse()
        .findIndex((msg) => !msg.isUser && msg.text === "");
      if (lastAIMessageIndex !== -1) {
        const originalIndex = state.messages.length - 1 - lastAIMessageIndex;
        state.messages[originalIndex].text = action.payload;
        state.messages[originalIndex].id = `ai-final-${Date.now()}`;
      }
    },

    markMessageAsFailed: (state, action: PayloadAction<string>) => {
      const index = state.messages.findIndex(
        (msg) => msg.id === action.payload
      );
      if (index !== -1) {
        state.messages[index].isFailed = true;
      }
    },

    clearMessages: (state) => {
      state.messages = [];
    },

    // --- SET TILES DATA ---
    setTilesData: (
      state,
      action: PayloadAction<{
        type: string;
        data: GetTileApiResponse;
      }>
    ) => {
      const { type, data } = action.payload;

      // Use a type assertion to ensure 'type' is one of the valid keys
      const tileKey = type as keyof typeof state.tilesData;

      if (state.tilesData.hasOwnProperty(tileKey)) {
        state.tilesData[tileKey] = data;
      }
    },
  },

  // --- THUNK EXTRA REDUCERS ---
  extraReducers: (builder) => {
    builder
      .addCase(streamAndSaveMessage.pending, (state) => {
        state.isSendingMessage = true;
      })
      .addCase(streamAndSaveMessage.fulfilled, (state) => {
        // Success: state already updated by appendChunkToAIMessage
        state.isSendingMessage = false;
      })
      .addCase(streamAndSaveMessage.rejected, (state) => {
        // Failure: markMessageAsFailed handles the specific user message
        state.isSendingMessage = false;
        // You might dispatch a Toast here using middleware or in the component
      });
  },
});

export const {
  setLoading,
  setSendingMessage,
  setStreaming,
  setMessages,
  addTempUserMessage,
  addTempAIMessage,
  appendChunkToAIMessage,
  updateLatestAIMessage,
  markMessageAsFailed,
  clearMessages,
  setTilesData,
} = guideSlice.actions;

export default guideSlice.reducer;
