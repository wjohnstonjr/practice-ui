import toast from 'react-hot-toast';

export const update = async (id, street, city, state, zip) => {
    try {
        const response = await fetch('http://localhost:8080/address', {
            method: 'PUT',
            body: JSON.stringify({
                id: id,
                street: street,
                city: city,
                state: state,
                zip: zip,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
        const data = await response.json();
    } catch (err) {
        console.log(err.message);
    };
}

export const create = async (street, city, state, zip) => {
    try {
        const response = await fetch('http://localhost:8080/address', {
            method: 'POST',
            body: JSON.stringify({
                street: street,
                city: city,
                state: state,
                zip: zip,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
        const data = await response.json();
    } catch (err) {
        console.log(err.message);
    };
}

export const remove = async (id) => {
    try {
        const response = await fetch('http://localhost:8080/address/' + id, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
        const data = await response.json();
        if (data == 0) {
            toast.error("Failed to delete the address");
        } else {
            toast.success("Successfully deleted the address");
        }
    } catch (err) {
        console.log(err.message);
    };
}