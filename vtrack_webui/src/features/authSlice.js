import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  userId: 0,
  isApproved: null,
  adminUserId: 0,
  emailAddress: null,
};

const userAuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.userId = action.payload.userId;
      state.isApproved = action.payload.isApproved;
    },
    setEmailAddress: (state, action) => {
      state.emailAddress = action.payload.emailAddress;
    },
    setAdminUserId: (state, action) => {
      state.adminUserId = action.payload.adminUserId;
    },
  },
});

export const { setEmailAddress, setLoggedIn, setLoggedOut, setAdminUserId } = userAuthSlice.actions;
export default userAuthSlice.reducer;
