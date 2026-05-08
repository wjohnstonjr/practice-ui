import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { DataGrid } from '@mui/x-data-grid';
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state';
import React, { useEffect, useReducer, useState } from 'react';
import AddressTable from '../addresses/AddressTable';
import Customer from './Customer';
import { remove as deleteCustomer } from './CustomerService';
import { useSelector, useDispatch } from 'react-redux';
import { setCustomers, setSelections, setSelected, setDialogOpen } from './CustomerSlice';
import { useGetCustomersQuery } from './CustomerApi';


const formatAddress = (row) => {
    const address = `${row?.address?.street}
${row?.address?.city}, ${row.address?.state} ${row.address?.zip}`
    return address;
}

const CustomerTable = () => {
    const { data, isLoading, isError, refetch } = useGetCustomersQuery();
    const customers = useSelector((state) => state.customers?.list);
    const selections = useSelector((state) => state.customers?.selections);
    const selectionCount = useSelector((state) => state.customers?.selectionCount);
    const dialogOpen = useSelector((state) => state.customers?.dialogOpen);
    const dispatch = useDispatch();
    const addresses = useSelector((state) => state.addresses?.list);

    const handleCreate = () => {
        dispatch(setSelected(null));
        dispatch(setDialogOpen(true));
    }
    const handleUpdate = () => {
        dispatch(setSelected(customers.find((customer) => customer.id == selections[0])));
        dispatch(setDialogOpen(true));
    }
    const handleDelete = () => {
        selections.forEach(id => deleteCustomer(id));
        refetch();
    }
    const customerColumns = [
        { field: 'firstName', headerName: 'First Name', width: 100 },
        { field: 'lastName', headerName: 'Last Name', width: 100 },
        { field: 'addressId', headerName: 'Address ID', valueGetter: (value, row) => row.address?.id, width: 20, hideable: false, disableColumnSelector: true },
        {
            field: 'address', headerName: 'Address', valueGetter: (value, row) => formatAddress(row), width: 300, renderCell: (params) => (
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: 'normal' }}>
                    {params.value}
                </div>
            )
        },
    ];

    if (isLoading) {
        return <div>Loading...</div>;
    } else if (isError) {
        return <div>Failed to load the customers</div>;
    }
    return (
        <div className="customer-container">
            <Box>
                <PopupState variant="popover" popupId="customer-popup-menu">
                    {(popupState) => (
                        <React.Fragment>
                            <Button variant="contained" {...bindTrigger(popupState)}>
                                Actions
                            </Button>
                            <Menu {...bindMenu(popupState)}>
                                <MenuItem onClick={() => {
                                    popupState.close();
                                    handleCreate();
                                }}>Create...</MenuItem>
                                <MenuItem onClick={() => {
                                    popupState.close();
                                    handleUpdate();
                                }} disabled={selectionCount != 1}>Update...</MenuItem>
                                <MenuItem onClick={() => {
                                    popupState.close();
                                    handleDelete();
                                }} disabled={selectionCount == 0}>Delete</MenuItem>
                            </Menu>
                        </React.Fragment>
                    )}
                </PopupState>
                <DataGrid checkboxSelection={true}
                    initialState={{
                        columns: {
                            columnVisibilityModel: { addressId: false },
                        },
                    }}
                    rows={customers}
                    columns={customerColumns}
                    onRowSelectionModelChange={(newRowSelectionModel) => {
                        dispatch(setSelections([...newRowSelectionModel.ids]))
                    }}
                    disableRowSelectionExcludeModel={true}
                />
                <Customer forceUpdate={refetch} />
            </Box>

        </div>
    );
};

export default CustomerTable;
