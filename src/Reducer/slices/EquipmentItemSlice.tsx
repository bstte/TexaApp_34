
import { createSlice } from "@reduxjs/toolkit";

const EquipmentItemSlice = createSlice({
  name: "EquipmentItems",
  initialState: [],
  reducers: {
    setEquipmentItems: (state, action) => action.payload,
   
  },
});


export const {setEquipmentItems } = EquipmentItemSlice.actions;
export const DosageEquipmentList = EquipmentItemSlice.reducer;


