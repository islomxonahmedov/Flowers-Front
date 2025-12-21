import { createSlice } from "@reduxjs/toolkit";
import { clearLocalStorage, saveToLocalStorage } from "../../config/localstorage";

const initialState = {
    isLoading: false,
    auth: null,
    userId: null, 
    isLoggedIn: false,
    isError: null,
};

const AuthSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        authStart: (state) => {
            state.isLoading = true;
        },
        authSuccess: (state, action) => {
            state.isLoading = false;
            state.auth = action.payload.data;
            state.userId = action.payload.data._id;
            state.isLoggedIn = true;
            if (action.payload.token) {
                saveToLocalStorage("token", action.payload.token);
            }
        },
        authFailure: (state, action) => {
            state.isLoading = false;
            state.isError = action.payload;
        },
        authLogout: (state) => {
            state.isLoading = false;
            state.isLoggedIn = false;
            state.auth = null;
            state.userId = null; 
            clearLocalStorage();
        },
    },
});

export const {
    authStart,
    authSuccess,
    authFailure,
    authLogout,
} = AuthSlice.actions;
export default AuthSlice.reducer;
