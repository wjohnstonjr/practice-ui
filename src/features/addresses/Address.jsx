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
import { update as updateAddress, create as createAddress } from './AddressService';
import { useDispatch, useSelector } from 'react-redux';
import { setDialogOpen } from './AddressSlice';

const Address = ({ forceUpdate }) => {
    const selectedAddress = useSelector((state) => state.addresses?.selected);
    const dialogOpen = useSelector((state) => state.addresses?.dialogOpen);
    const dispatch = useDispatch();
    const [street, setStreet] = useState(selectedAddress?.street);
    const [city, setCity] = useState(selectedAddress?.city);
    const [state, setState] = useState(selectedAddress?.state);
    const [zip, setZip] = useState(selectedAddress?.zip);
    const handleOk = () => {
        dispatch(setDialogOpen(false));
        if (selectedAddress?.id) {
            updateAddress(selectedAddress.id, street, city, state, zip, forceUpdate)
        } else {
            createAddress(street, city, state, zip, forceUpdate)
        }
    }
    const handleClose = () => {
        dispatch(setDialogOpen(false));
    }

    useEffect(() => {
        if (selectedAddress) {
            setStreet(selectedAddress?.street);
            setCity(selectedAddress?.city);
            setState(selectedAddress.state)
            setZip(selectedAddress.zip)
        } else {
            setStreet("");
            setCity("");
            setState("");
            setZip("");
        }
    }, [dialogOpen, selectedAddress]);
    return (
        <Dialog
            open={dialogOpen}
            onClose={handleClose}
        >
            <DialogTitle id="customer-title">
                {selectedAddress ? "Edit Address" : "Create Address"}
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