
// const BASE_URL = 'http://localhost:3001';
export const BASE_URL = 'https://api.hcq.students.nomoreparties.site';


module.exports.register = (email, password) => {
    console.log(email, password);
    return fetch(`${BASE_URL}/signup`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
    .then((res) => {
        console.log(res);
        return res.json();
      });
    // .then((res)=> {
    //     return res;
    // })
}

module.exports.authorize = (email, password) => {
    return fetch(`${BASE_URL}/signin`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
    })
    .then((response => response.json()))
    .then((data) => {
        if (!data.message){
            localStorage.setItem('token', data.token);
            return data;
        } else {
            return;
        }
    })
}

module.exports.getContent = (token) => {
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
    .then(data => data)
}