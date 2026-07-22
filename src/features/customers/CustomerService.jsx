import toast from 'react-hot-toast';

export const update = async (id, firstName, lastName, addressId, forceUpdate) => {
    try {
        const response = await fetch('http://localhost:8080/customers', {
            method: 'PUT',
            body: JSON.stringify({
                id: id,
                firstName: firstName,
                lastName: lastName,
                addressId: addressId,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
        const data = await response.json();
        toast.success("Successfully updated the customer");
        await forceUpdate();
    } catch (err) {
        console.log(err.message);
        toast.error("Failed to update the customer");
    };
}

export const create = async (firstName, lastName, addressId, forceUpdate) => {
    try {
        const response = await fetch('http://localhost:8080/customers', {
            method: 'POST',
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                addressId: addressId,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
        const data = await response.json();
        toast.success("Successfully created the customer");
        await forceUpdate();
    } catch (err) {
        console.log(err.message);
        toast.error("Failed to create the customer");
    };
}

export const remove = async (id, forceUpdate) => {
    try {
        const response = await fetch('http://localhost:8080/customers/' + id, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
        const data = await response.json();
        if (data == 0) {
            toast.error("Failed to delete the customer");
        } else {
            toast.success("Successfully deleted the customer");
        }
        await forceUpdate();
    } catch (err) {
        console.log(err.message);
        toast.error("Failed to delete the customer");
    };
}