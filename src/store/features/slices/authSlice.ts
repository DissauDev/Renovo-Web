import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type UserRole = 'ADMIN' | 'EMPLOYEE' | 'PROVIDER';

export interface AuthUser {
  id: number | string;
  email: string;
  name?: string;
  role?: UserRole;
}

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
}

 const initialState: AuthState = { user: null, accessToken: null };


type CredentialsPayload = {
  user: AuthUser;
  accessToken: string;
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<CredentialsPayload>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
