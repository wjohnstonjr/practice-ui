import { createSlice } from '@reduxjs/toolkit'
import { read2 } from '../services/AddressService';

export const addressSlice = createSlice({
    name: 'addresses',
    initialState: {
        list: [],
    },
    reducers: {
        read: (state) => {
            read2(state);
        },
    },
})

// Action creators are generated for each case reducer function
export const { read } = addressSlice.actions

export default addressSlice.reducer