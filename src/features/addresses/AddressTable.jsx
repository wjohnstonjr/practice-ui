import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { DataGrid } from '@mui/x-data-grid';
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state';
import React, { useEffect, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetAddressesQuery } from './AddressApi';
import { remove as deleteAddress } from './AddressService';
import Address from './Address';
import { setAddresses, setSelections, setSelected, setDialogOpen } from './AddressSlice';


const AddressTable = () => {
    const { data, isLoading, isError, refetch } = useGetAddressesQuery();
    const addresses = useSelector((state) => state.addresses?.list);
    const selections = useSelector((state) => state.addresses?.selections);
    const selectionCount = useSelector((state) => state.addresses?.selectionCount);
    const dialogOpen = useSelector((state) => state.addresses?.dialogOpen);
    const dispatch = useDispatch();

    const addressColumns = [
        { field: 'street', headerName: 'Street', valueGetter: (value, row) => row.street, width: 300 },
        { field: 'city', headerName: 'City', valueGetter: (value, row) => row.city, width: 100 },
        { field: 'state', headerName: 'State', valueGetter: (value, row) => row.state, width: 100 },
        { field: 'zip', headerName: 'Zip Code', valueGetter: (value, row) => row.zip, width: 100 },
    ];
    const handleCreate = () => {
        dispatch(setSelected(null));
        dispatch(setDialogOpen(true));
    }
    const handleUpdate = () => {
        dispatch(setSelected(addresses.find((address) => address.id == selections[0])));
        dispatch(setDialogOpen(true));
    }
    const handleDelete = () => {
        selections.forEach(id => {
            deleteAddress(id, refetch);
        });

    }

    if (isLoading) {
        return <div>Loading...</div>;
    } else if (isError) {
        return <div>Failed to load the addresses</div>;
    }
    return (
        <div className="address-container">
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
                    rows={addresses}
                    columns={addressColumns}
                    onRowSelectionModelChange={(newRowSelectionModel) => {
                        dispatch(setSelections([...newRowSelectionModel.ids]))
                    }}
                    disableRowSelectionExcludeModel={true}
                />
                <Address forceUpdate={refetch} />

            </Box>
        </div>
    );
};

export default AddressTable;
