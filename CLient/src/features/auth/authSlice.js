import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: !!sessionStorage.getItem('authToken'),
    user: JSON.parse(localStorage.getItem('userData')) || null,
    token: sessionStorage.getItem('authToken'),
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      sessionStorage.removeItem('authToken');
      localStorage.removeItem('userData');
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;