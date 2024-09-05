import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  visitorData: {
    visitorType: null,
    visitorId: null,
    visitorName:null,
    visitorPhone:null,
    purposeOfVisit:null
  },
  AccessCardId: null,
  CategoryId: null,
  ApprovalId: null,
  HostData: {
    hostName: null,
  },
};

const VisitorSlice = createSlice(
  {
    name: "visitor",
    initialState,
    reducers: {
      setVisitorType: (state, action) => {
        state.visitorData.visitorType = action.payload.visitorType;
        state.visitorData.visitorId = action.payload.visitorId;
        state.visitorData.visitorName = action.payload.visitorName;
        state.visitorData.visitorPhone = action.payload.visitorPhone;
        state.visitorData.purposeOfVisit = action.payload.purposeOfVisitId;
      },
      setAccessCardId: (state, action) => {
        state.AccessCardId = action.payload.accessCardId;
      },
      setCategoryId: (state, action) => {
        state.CategoryId = action.payload.categoryId;
      },
      setApprovalId: (state, action) => {
        state.ApprovalId = action.payload.approvalId;
      },
      
      setHostDetails: (state, action) => {
        state.HostData.hostName = action.payload.hostName;
      },
      ressetVisitorType: (state) => initialState.visitorType,
    },
  },
);

export const { setVisitorType, ressetVisitorType, setAccessCardId, setApprovalId, setCategoryId,setHostDetails } = VisitorSlice.actions;
export default VisitorSlice.reducer;
