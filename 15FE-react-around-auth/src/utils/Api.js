class Api {
    constructor({ server, headers }) {
        this.server = server;
        this.headers = headers;
    }

// owner._id = : "c64138ece4ac2d1c50e9ce31"

    getCardList(token) {
        return fetch(`${this.server}/cards`, {            
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }})
            .then(res => {
                return res.ok ? res.json() : Promise.reject('Error: ' + res.status)
            })
            .catch(err => {
                console.log('console.log', console.log(err))
            })
    }

    getUserInfo(token) {
        return fetch(`${this.server}/users/me/`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        }).then(res => res.ok ? res.json() : Promise.reject('Error: ' + res.status));
    }

    getAppInfo(token) {
        return Promise.all([this.getCardList(token), this.getUserInfo(token)]);
    }

    addCard({ caption, imageUrl }, token) {
        return fetch(`${this.server}/cards`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                name: caption,
                link: imageUrl,
            }),
        }).then(res => res.ok ? res.json() : Promise.reject('Error: ' + res.status))
    }

    toggleLike(cardId, isLiked, token) {
        const method = isLiked ? 'DELETE' : 'PUT';
        return fetch(`${this.server}/cards/${cardId}/likes/`, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        }).then((res) => {
            if (res.ok) {
                return res.json();
            }

            return Promise.reject(res.statusText);
        })
        .catch(err => { console.log(err) });
    }

    deleteCard(cardId, token) {
        return fetch(this.server + `/cards/${cardId}/`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        }).then(res => res.ok ? res.json() : Promise.reject('Error: ' + res.status))
    }

    updateUserInfo({ name, about }, token) {
        return fetch(`${this.server}/users/me/`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                name,
                about,
            }),
        }).then((res) => {
            if (res.ok) {
                return res.json();
            }
        });
    }

    setUserAvatar(res, token) {
        return fetch(`${this.server}/users/me/avatar/`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                avatar: res,
            }),
        }).then((res) => {
            if (res.ok) {
                return res.json();
            }
        });
    }
}

export default Api;