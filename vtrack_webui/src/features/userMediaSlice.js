import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  userData: {
    userPhoto: null,
    userSignature: null,
  },
  nidType: "",
  nationalId: null,
};

// Create the slice
const userMediaSlice = createSlice({
  name: "userMedia",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData.userPhoto = action.payload.profilePhoto;
      state.userData.userSignature = action.payload.signature;
    },
    setUserNidData: (state, action) => {
      state.nidType = action.payload.nidType;
      state.nationalId = action.payload.nidImageRaw;
    },
    // setNational_Id: (state, action) => {
    //   console.log(action.payload,'this is paylodf--->')
    //   state.userNidData.national_id = action.payload.nidImage;
    // },

    clearUserMedia: (state) => {
      state.userData = {
        userPhoto: null,
        userSignature: null,
      };
    },
  },
});

// Export actions and reducer
export const { setUserData, setUserNidData, clearUserMedia } = userMediaSlice.actions;
export default userMediaSlice.reducer;
