import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  validData: {
    email: null,
    otp: null,
    id: null
  },
};

const validSlice = createSlice(
  {
    name: "valid",
    initialState,
    reducers: {
      setValidType: (state, action) => {
        state.validData.email = action.payload.email;
        state.validData.otp = action.payload.otp;
        state.validData.id = action.payload.id;
      },
    //   ressetValidType: (state) => initialState.validType,
      resetValidType: (state) => {
        state.validData = initialState.validData; // Reset to initial state
    },
  },
},
);

export const { setValidType } = validSlice.actions;
export default validSlice.reducer;
