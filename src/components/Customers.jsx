import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { DataGrid } from '@mui/x-data-grid';
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state';
import React, { useEffect, useState } from 'react';
import Addresses from './Addresses';
import Customer from './Customer';

const formatAddress = (row) => {
    const address = `${row?.address?.street}
${row?.address?.city}, ${row.address?.state} ${row.address?.zip}`
    return address;
}

const Customers = ({ addresses }) => {
    const [addressList, setAddressList] = useState(addresses);
    const [rows, setRows] = useState([]);
    const [rowSelectionModel, setRowSelectionModel] = useState({
        type: 'include',
        ids: new Set(),
    });
    const [dialogOpen, setDialogOpen] = useState(false);
    const handleCreate = () => {
        setSelectedCustomer(null);
        setDialogOpen(true);
    }
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const handleUpdate = () => {
        if (rowSelectionModel.type == 'include') {
            setSelectedCustomer(rows.find((customer) => customer.id == rowSelectionModel.ids.values().next().value));
        } else {
            setSelectedCustomer(rows.filter((customer) => rowSelectionModel.ids.has(customer.id))[0]);
        }
        setDialogOpen(true);
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
    useEffect(() => {
        fetch('http://localhost:8080/customers')
            .then((response) => response.json())
            .then((data) => {
                setRows(data);
            })
            .catch((err) => {
                console.log(err.message);
            });
        setAddressList(addresses);
    }, [addresses]);
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
                                }} disabled={(rowSelectionModel.type == 'include' && rowSelectionModel.ids.size != 1) ||
                                    ((rowSelectionModel.type == 'exclude' && (rows.size - rowSelectionModel.ids.size) != 1))}>Update...</MenuItem>
                                <MenuItem onClick={popupState.close} disabled={(rowSelectionModel.type == 'include' && rowSelectionModel.ids.size == 0) ||
                                    (rowSelectionModel.type == 'exclude' && rowSelectionModel.ids.size == rows.size)}>Delete</MenuItem>
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
                    rows={rows}
                    columns={customerColumns}
                    onRowSelectionModelChange={(newRowSelectionModel) => {
                        setRowSelectionModel(newRowSelectionModel);
                        console.log(Addresses.rows)
                    }}
                    rowSelectionModel={rowSelectionModel}
                />
                <Customer open={dialogOpen} setOpen={setDialogOpen} row={selectedCustomer} addresses={addresses} />
            </Box>

        </div>
    );
};

export default Customers;
