// src/store/features/slices/settingsSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

export type Language = "en" | "es";

interface SettingsState {
  language: Language;
}

const initialState: SettingsState = {
  // default inicial; redux-persist lo sobreescribe cuando rehidrata
  language: "en",
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<Language>) {
      state.language = action.payload;
    },
  },
});

export const { setLanguage } = settingsSlice.actions;

export const selectLanguage = (state: RootState) => state.settings.language;

export default settingsSlice.reducer;
