class Api {
    constructor({ server, headers }) {
        this.server = server;
        this.headers = headers;
    }

// owner._id = : "c64138ece4ac2d1c50e9ce31"

    getCardList() {
        return fetch(`${this.server}/cards`, {
            headers: this.headers,
        }).then(res => res.ok ? res.json() : Promise.reject('Error: ' + res.status))
    }

    getUserInfo() {
        return fetch(`${this.server}/users/me/`, {
            headers: this.headers,
        }).then(res => res.ok ? res.json() : Promise.reject('Error: ' + res.status));
    }

    getAppInfo() {
        return Promise.all([this.getCardList(), this.getUserInfo()]);
    }

    addCard({ caption, imageUrl }) {
        return fetch(`${this.server}/cards`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({
                name: caption,
                link: imageUrl,
            }),
        }).then(res => res.ok ? res.json() : Promise.reject('Error: ' + res.status))
    }

    toggleLike(cardId, isLiked) {
        const method = isLiked ? 'DELETE' : 'PUT';
        return fetch(`${this.server}/cards/likes/${cardId}/`, {
            method: method,
            headers: this.headers,
        }).then((res) => {
            if (res.ok) {
                return res.json();
            }
        })
    }

    deleteCard(cardId) {
        return fetch(this.server + `/cards/${cardId}/`, {
            method: 'DELETE',
            headers: this.headers,
        }).then(res => res.ok ? res.json() : Promise.reject('Error: ' + res.status))
    }

    updateUserInfo({ name, about }) {
        return fetch(`${this.server}/users/me/`, {
            method: 'PATCH',
            headers: this.headers,
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

    setUserAvatar(res) {
        return fetch(`${this.server}/users/me/avatar/`, {
            method: 'PATCH',
            headers: this.headers,
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

export const api = new Api({
    // server: "https://around.nomoreparties.co/v1/group-2",
    server: "https://api.hcq.students.nomoreparties.site/react-around-api-full/"
    headers: {
        authorization: "7c532e9d-132b-43e0-b1d4-55c21c0fd902",
        "Content-Type": "application/json",
    }
});