import { createSlice } from "@reduxjs/toolkit";

const LOCAL_STORAGE_TOKEN_KEY = "admin-token";
const LOCAL_STORAGE_ADMIN_KEY = "admin";

const parseJSON = (value) => {
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

const storedToken = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
const storedAdmin = localStorage.getItem(LOCAL_STORAGE_ADMIN_KEY);

const initialState = {
  token: storedToken || null,
  admin: parseJSON(storedAdmin),
  isAuthenticated: !!storedToken
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, admin } = action.payload;
      state.token = token;
      state.admin = admin;
      state.isAuthenticated = true;
      localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);
      localStorage.setItem(LOCAL_STORAGE_ADMIN_KEY, JSON.stringify(admin));
    },
    updateProfile: (state, action) => {
      state.admin = { ...state.admin, ...action.payload };
      localStorage.setItem(LOCAL_STORAGE_ADMIN_KEY, JSON.stringify(state.admin));
    },
    logout: (state) => {
      state.token = null;
      state.admin = null;
      state.isAuthenticated = false;
      localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
      localStorage.removeItem(LOCAL_STORAGE_ADMIN_KEY);
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const { setCredentials, updateProfile, logout, clearError } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectCurrentToken = (state) => state.auth.token;
export const selectCurrentAdmin = (state) => state.auth.admin;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
