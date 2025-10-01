import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import { DosageItemList } from "./slices/dosageItemsSlice";
import { DosageEquipmentList } from "./slices/EquipmentItemSlice";



const rootReducer = combineReducers({
    user: userSlice,
    DosageItemList: DosageItemList ,
    DosageEquipmentList: DosageEquipmentList
});



const store=configureStore({
    reducer:rootReducer
})

export default store;