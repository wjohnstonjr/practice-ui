
export const read = (setAddresses) => {
    fetch('http://localhost:8080/address')
        .then((response) => response.json())
        .then((data) => {
            setAddresses(data);
        })
        .catch((err) => {
            console.log(err.message);
        });
}

export const update = async (id, street, city, state, zip) => {
    await fetch('http://localhost:8080/address', {
        method: 'POST',
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
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
        })
        .catch((err) => {
            console.log(err.message);
        });
}

export const create = async (street, city, state, zip) => {
    await fetch('http://localhost:8080/address', {
        method: 'PUT',
        body: JSON.stringify({
            street: street,
            city: city,
            state: state,
            zip: zip,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
        })
        .catch((err) => {
            console.log(err.message);
        });
}

export const remove = async (id) => {
    await fetch('http://localhost:8080/address/' + id, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
        })
        .catch((err) => {
            console.log(err.message);
        });
}