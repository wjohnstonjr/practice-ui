import React, { useEffect, useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    MenuItem,
    Select,
    TextField
} from '@mui/material';
import { update as updateAddress, create as createAddress } from '../services/AddressService';

const Address = ({ open, setOpen, row, forceUpdate }) => {
    const [street, setStreet] = useState(row?.street);
    const [city, setCity] = useState(row?.city);
    const [state, setState] = useState(row?.state);
    const [zip, setZip] = useState(row?.zip);
    const handleOk = () => {
        setOpen(false);
        if (row?.id) {
            updateAddress(row.id, street, city, state, zip)
            forceUpdate();
        } else {
            createAddress(street, city, state, zip)
            forceUpdate();
        }
    }
    const handleClose = () => {
        setOpen(false);
    }

    useEffect(() => {
        if (row) {
            setStreet(row?.street);
            setCity(row?.city);
            setState(row.state)
            setZip(row.zip)
        } else {
            setStreet("");
            setCity("");
            setState("");
            setZip("");
        }
    }, [open, row]);
    return (
        <Dialog
            open={open}
            onClose={handleClose}
        >
            <DialogTitle id="customer-title">
                {row ? "Edit Customer" : "Create Customer"}
            </DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Street"
                    fullWidth
                    variant="standard"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    label="City"
                    fullWidth
                    variant="standard"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    label="State"
                    fullWidth
                    variant="standard"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    label="Zip Code"
                    fullWidth
                    variant="standard"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleOk} autoFocus>OK</Button>
            </DialogActions>
        </Dialog>

    );
}
export default Address;