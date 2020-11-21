import React from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

export default function Card(props) {
    const currentUser = React.useContext(CurrentUserContext);

    const isOwn = currentUser && (props.card.owner._id === currentUser._id);

    const cardDeleteButtonClassName = (
        `grid__photos-delete ${isOwn ? 'grid__photos-delete' : 'grid__photos-delete_hidden'}`
    );

    const isLiked = currentUser && props.card.likes.some(i => i._id == currentUser._id);

    const cardLikeButtonClassName = (
        `grid__photos-liker ${isLiked && 'grid__photos-liker_on'}`
    );


    return(        
    <>
        <li className="grid__photos-item">
            <div className="grid__photos-img-area">
                <button className={cardDeleteButtonClassName} onClick={() => {
                    props.onCardDelete(props.card);
                }}>
                </button>
                <div className="grid__photos-image grid__photos-image_sequoia"
                    style={{ backgroundImage: `url(${props.card.link})` }}
                    onClick={() => {
                        props.onCardClick(props.card);
                    }}>
                </div>
            </div>
            <div className="grid__photos-base">
                <h2 className="grid__photos-caption">{props.card.name}</h2>
                <div className="grid__photos-like-container">
                    <button className={cardLikeButtonClassName} onClick={() => {
                        props.onCardLike(props.card)
                    }}></button>
                    <p className="grid__photos-like-counter">{props.card.likes.length}</p>
                </div>
            </div>
        </li>
    </>
    );
}