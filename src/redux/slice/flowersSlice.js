import { createSlice } from '@reduxjs/toolkit';

const bookSlice = createSlice({
    name: 'flower',
    initialState: {
        flowers: [],
        isLoading: false,
        isError: false,
    },
    reducers: {
        flowerStart: (state) => {
            state.isLoading = true;
            state.isError = false;
        },
        flowerSuccess: (state, action) => {
            state.isLoading = false;
            state.flowers = action.payload.data;
        },
        flowerFailure: (state, action) => {
            state.isLoading = false;
            state.isError = true;
        },
    },
});

export const { flowerStart, flowerSuccess, flowerFailure } = bookSlice.actions;
export default bookSlice.reducer;
