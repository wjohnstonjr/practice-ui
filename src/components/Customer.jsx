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

const Customer = ({ open, setOpen, row, addresses }) => {
    const handleClose = () => {
        setOpen(false);
    }
    const [firstName, setFirstName] = useState(row?.firstName);
    const [lastName, setLastName] = useState(row?.lastName);
    const [addressId, setAddressId] = useState(row?.addressId);

    useEffect(() => {
        if (row) {
            setFirstName(row?.firstName);
            setLastName(row?.lastName);
            setAddressId(row.addressId)
        } else {
            setFirstName("");
            setLastName("");
            setAddressId(addresses[0]?.id);
        }
    }, [open, row, addresses]);
    const options = ['Option 1', 'Option 2', 'Option 3'];
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
                    label="First Name"
                    fullWidth
                    variant="standard"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    label="Last Name"
                    fullWidth
                    variant="standard"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={addressId}
                    label="Address"
                    onChange={(e) => setAddressId(e.target.value)}
                >
                    {console.log(addresses)}
                    {
                        addresses.map((address) => (
                            <MenuItem key={address.id} value={address.id}>
                                {address.street + ", " + address.city + ", " + address.state + " " + address.zip}
                            </MenuItem>
                        ))
                    }
                </Select>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleClose} autoFocus>OK</Button>
            </DialogActions>
        </Dialog>

    );
}
export default Customer;