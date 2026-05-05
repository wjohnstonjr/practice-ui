import { createSlice } from '@reduxjs/toolkit';

export const addressSlice = createSlice({
    name: 'addresses',
    initialState: {
        list: [],
        selections: [],
        selectionCount: 0,
        selected: null,
        dialogOpen: false,

    },
    reducers: {
        setAddresses: (state, addresses) => {
            state.list = addresses.payload;
        },
        setSelections: (state, selections) => {
            state.selections = selections.payload;
            state.selectionCount = state.selections.length;
        },
        setSelected: (state, selection) => {
            state.selected = selection.payload;
        },
        setDialogOpen: (state, dialogOpen) => {
            state.dialogOpen = dialogOpen.payload;
        }
    },
})

// Action creators are generated for each case reducer function
export const { setAddresses, setSelections, setSelected, setDialogOpen } = addressSlice.actions

export default addressSlice.reducer