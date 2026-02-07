import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("token") || null,
  admin: JSON.parse(localStorage.getItem("admin")) || null,
  isAuthenticated: !!localStorage.getItem("token")
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
      localStorage.setItem("token", token);
      localStorage.setItem("admin", JSON.stringify(admin));
    },
    
    updateProfile: (state, action) => {
      state.admin = { ...state.admin, ...action.payload };
      localStorage.setItem("admin", JSON.stringify(state.admin));
    },
    
    logout: (state) => {
      state.token = null;
      state.admin = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("admin");
    },
    
    clearError: (state) => {
      state.error = null;
    }
  },
  
  extraReducers: (builder) => {
    // You can add extra reducers for async actions here if needed
  }
});

export const { 
  setCredentials, 
  updateProfile, 
  logout, 
  clearError 
} = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentToken = (state) => state.auth.token;
export const selectCurrentAdmin = (state) => state.auth.admin;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;