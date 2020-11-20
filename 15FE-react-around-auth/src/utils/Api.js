class Api {
    constructor({ server, headers }) {
        this.server = server;
        this.headers = headers;
    }

// owner._id = : "c64138ece4ac2d1c50e9ce31"

    getCardList() {
        return fetch(`${this.server}/cards`, { headers: this.headers })
            .then(res => {
                return res.ok ? res.json() : Promise.reject('Error: ' + res.status)
            })
            .catch(err => {
                console.log('console.log', console.log(err))
            })
    }

//  getCardList(token) {
        // return fetch(`${this.server}/cards`, {
        //     headers: {
            //     "Content-Type": "application/json",
            //     "Authorization": `Bearer ${token}`
    //     }).then(res => res.ok ? res.json() : Promise.reject('Error: ' + res.status))
    // }


    getUserInfo(token) {
        return fetch(`${this.server}/users/me/`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        }).then(res => res.ok ? res.json() : Promise.reject('Error: ' + res.status));
    }

    getAppInfo(token) {
        return Promise.all([this.getCardList(), this.getUserInfo()]);
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
        return fetch(`${this.server}/cards/likes/${cardId}/`, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        }).then((res) => {
            if (res.ok) {
                return res.json();
            }
        })
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

// export const api = new Api({
    // server: "https://around.nomoreparties.co/v1/group-2",
    // server: "https://api.hcq.students.nomoreparties.site",
//     server: "http://localhost:3001",
//     headers: {
//         // "Authorization": "7c532e9d-132b-43e0-b1d4-55c21c0fd902",
//         "Content-Type": "application/json",
//     }
// });