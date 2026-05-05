import { createSlice } from '@reduxjs/toolkit';

export const customerSlice = createSlice({
    name: 'customers',
    initialState: {
        list: [],
        selections: [],
        selectionCount: 0,
        selected: null,
        dialogOpen: false,
    },
    reducers: {
        setCustomers: (state, addresses) => {
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
export const { setCustomers, setSelections, setSelected, setDialogOpen } = customerSlice.actions

export default customerSlice.reducer