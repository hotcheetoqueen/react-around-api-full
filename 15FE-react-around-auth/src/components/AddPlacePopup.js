import React from 'react';
import { PopupWithForm } from './PopupWithForm';

export function AddPlacePopup(props) {
    const [caption, setCaption] = React.useState('');
    const [imageUrl, setImageUrl] = React.useState('');

    function handleCaptionAdd(e) {
        setCaption(e.target.value);
    }

    function handleImageUrlAdd(e) {
        setImageUrl(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        props.onAddNewCard({ caption, imageUrl })
    }

    return(
        <PopupWithForm name="image" title="New place" isOpen={props.isOpen} onClose={props.onClose} onSubmit={handleSubmit} text="Create">
            <fieldset className="modal__fieldset">
                <label>
                    <input className="modal__input modal__input_caption" id="image-caption" name="card-caption"
                        type="text" placeholder="Title" defaultValue="" minLength="1" maxLength="100" onChange={handleCaptionAdd} required />
                    <span className="modal__input_error" id="image-caption-error"></span>
                </label>
                <label>
                    <input className="modal__input modal__input_image-link" id="image-link" name="card-link"
                        type="url" placeholder="Image link" defaultValue="" onChange={handleImageUrlAdd} required />
                    <span className="modal__input_error" id="image-link-error"></span>
                </label>
            </fieldset>
        </PopupWithForm>
    )
}

