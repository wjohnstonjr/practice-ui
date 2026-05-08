import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Select,
    TextField
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { create as createCustomer, update as updateCustomer } from './CustomerService';
import { setDialogOpen } from './CustomerSlice';

const Customer = ({ forceUpdate }) => {
    const addresses = useSelector((state) => state.addresses?.list);
    const selectedCustomer = useSelector((state) => state.customers?.selected);
    const dialogOpen = useSelector((state) => state.customers?.dialogOpen);
    const dispatch = useDispatch();
    const [firstName, setFirstName] = useState(selectedCustomer?.firstName);
    const [lastName, setLastName] = useState(selectedCustomer?.lastName);
    const [addressId, setAddressId] = useState(selectedCustomer?.addressId);
    const handleOk = () => {
        dispatch(setDialogOpen(false));
        if (selectedCustomer?.id) {
            updateCustomer(selectedCustomer.id, firstName, lastName, addressId)
            forceUpdate();
        } else {
            createCustomer(firstName, lastName, addressId)
            forceUpdate();
        }
    }
    const handleClose = () => {
        dispatch(setDialogOpen(false));
    }

    useEffect(() => {
        if (selectedCustomer) {
            setFirstName(selectedCustomer?.firstName);
            setLastName(selectedCustomer?.lastName);
            setAddressId(selectedCustomer.addressId)
        } else {
            setFirstName("");
            setLastName("");
            setAddressId(addresses[0]?.id);
        }
    }, [dialogOpen, selectedCustomer, addresses]);
    return (
        <Dialog
            open={dialogOpen}
            onClose={handleClose}
        >
            <DialogTitle id="customer-title">
                {selectedCustomer ? "Edit Customer" : "Create Customer"}
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
                <Button onClick={handleOk} autoFocus>OK</Button>
            </DialogActions>
        </Dialog>

    );
}
export default Customer;
