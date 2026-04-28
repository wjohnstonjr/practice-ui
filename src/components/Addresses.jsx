import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { DataGrid } from '@mui/x-data-grid';
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state';
import React, { useEffect, useState } from 'react';

const Addresses = ({ rows, setRows }) => {
    const [rowSelectionModel, setRowSelectionModel] = useState({
        type: 'include',
        ids: new Set(),
    });
    const addressColumns = [
        { field: 'street', headerName: 'Street', valueGetter: (value, row) => row.street, width: 300 },
        { field: 'city', headerName: 'City', valueGetter: (value, row) => row.city, width: 100 },
        { field: 'state', headerName: 'State', valueGetter: (value, row) => row.state, width: 100 },
        { field: 'zip', headerName: 'Zip Code', valueGetter: (value, row) => row.zip, width: 100 },
    ];

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
                                <MenuItem onClick={popupState.close}>Create...</MenuItem>
                                <MenuItem onClick={popupState.close} disabled={rowSelectionModel.ids.size != 1}>Update...</MenuItem>
                                <MenuItem onClick={popupState.close} disabled={rowSelectionModel.ids.size == 0}>Delete</MenuItem>
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
            </Box>
        </div>
    );
};

export default Addresses;
