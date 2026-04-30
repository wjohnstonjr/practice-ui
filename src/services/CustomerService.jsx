
export const read = async (setCustomers) => {
    await fetch('http://localhost:8080/customers')
        .then((response) => response.json())
        .then((data) => {
            setCustomers(data);
        })
        .catch((err) => {
            console.log(err.message);
        });
}

export const update = async (id, firstName, lastName, addressId) => {
    try {
        const response = await fetch('http://localhost:8080/customers', {
            method: 'POST',
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
        console.log(data);
    } catch (err) {
        console.log(err.message);
    };
}

export const create = async (firstName, lastName, addressId) => {
    try {
        const response = await fetch('http://localhost:8080/customers', {
            method: 'PUT',
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
        console.log(data);
    } catch (err) {
        console.log(err.message);
    };
}

export const remove = async (id) => {
    try {
        const response = await fetch('http://localhost:8080/customers/' + id, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
        const data = await response.json();
        console.log(data);
    } catch (err) {
        console.log(err.message);
    };
}