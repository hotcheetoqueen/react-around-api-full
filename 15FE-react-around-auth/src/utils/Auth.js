
const BASE_URL = 'http://localhost:3001';
// export const BASE_URL = 'https://api.hcq.students.nomoreparties.site';

export const register = (email, password) => {
    console.log(email, password);
    return fetch(`${BASE_URL}/signup`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
    .then((res) => res.json())
}

export const authorize = (email, password) => {
    return fetch(`${BASE_URL}/signin`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
    })
    .then((res) => res.ok ? res.json(): Promise.reject(res.status))
    .then((data) => {
        if (!data.message) {
            localStorage.setItem('token', data.token);
            return data;
        } 
        else {
            return;
        }
    })
    .catch(err => {
        return {errStatus: err}
    })
}

export const getContent = (token) => {
    return fetch(`${BASE_URL}/users/me`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    })
    .then(res => {
        return res.ok ? res.json() : Promise.reject(`Error: ${res.status}`) 
    })
    .catch((err) => console.log(err));
}