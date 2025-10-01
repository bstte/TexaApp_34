




import { createSlice } from "@reduxjs/toolkit";

const dosageItemsSlice = createSlice({
  name: "DosageItems",
  initialState: [],
  reducers: {
    setDosageItems: (state, action) => action.payload,
   
  },
});


export const {setDosageItems } = dosageItemsSlice.actions;
export const DosageItemList = dosageItemsSlice.reducer;

// export const selectDataById = (state, Id) => {
//   return state.DosageItemList.find((item) => item.id === Id);
// };

