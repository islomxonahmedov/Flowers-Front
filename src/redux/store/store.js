import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../slice/authSlice";
import categorySlice from "../slice/catigorySlice";

export const store = configureStore({
    reducer: {
        auth: authSlice,
        category: categorySlice,
    }
});