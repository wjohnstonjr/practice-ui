import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { DataGrid } from '@mui/x-data-grid';
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state';
import React, { useEffect, useReducer, useState } from 'react';
import { read as readAddresses, remove as deleteAddress } from '../services/AddressService';
import Address from './Address';

const Addresses = ({ rows, setRows }) => {
    const [rowSelectionModel, setRowSelectionModel] = useState({
        type: 'include',
        ids: new Set(),
    });
    const [, forceUpdate] = useReducer((x) => {
        x + 1;
        readAddresses(setRows);
    }, 0);
    const addressColumns = [
        { field: 'street', headerName: 'Street', valueGetter: (value, row) => row.street, width: 300 },
        { field: 'city', headerName: 'City', valueGetter: (value, row) => row.city, width: 100 },
        { field: 'state', headerName: 'State', valueGetter: (value, row) => row.state, width: 100 },
        { field: 'zip', headerName: 'Zip Code', valueGetter: (value, row) => row.zip, width: 100 },
    ];
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const handleCreate = () => {
        setSelectedAddress(null);
        setDialogOpen(true);
    }
    const handleUpdate = () => {
        setSelectedAddress(rows.find((address) => address.id == rowSelectionModel.ids.values().next().value));
        setDialogOpen(true);
    }
    const handleDelete = () => {
        rowSelectionModel.ids.forEach(id => deleteAddress(id));
        forceUpdate();
        forceUpdate();
    }
    useEffect(() => {
    }, []);
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
                                }} disabled={rowSelectionModel.ids.size != 1}>Update...</MenuItem>
                                <MenuItem onClick={() => {
                                    popupState.close();
                                    handleDelete();
                                }} disabled={rowSelectionModel.ids.size == 0}>Delete</MenuItem>
                            </Menu>
                        </React.Fragment>
                    )}
                </PopupState>
                <DataGrid checkboxSelection={true}
                    rows={rows}
                    columns={addressColumns}
                    onRowSelectionModelChange={(newRowSelectionModel) => {
                        setRowSelectionModel(newRowSelectionModel);
                    }}
                    rowSelectionModel={rowSelectionModel}
                    disableRowSelectionExcludeModel={true}
                />
                <Address open={dialogOpen} setOpen={setDialogOpen} row={selectedAddress} forceUpdate={forceUpdate} />

            </Box>
        </div>
    );
};

export default Addresses;
