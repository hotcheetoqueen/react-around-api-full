import React from 'react';
import { PopupWithForm } from './PopupWithForm';

export function EditAvatarPopup(props) {
    const avatarRef = React.useRef('');

    function handleSubmit(e) {
        e.preventDefault();
      
        props.onUpdateAvatar({
          avatar: avatarRef,
        });
      }

    return (
        <>
        <PopupWithForm name="avatar" title="Change profile picture" isOpen={props.isOpen} onClose={props.onClose} onSubmit={handleSubmit} text="Save">
            <fieldset className="modal__fieldset">
                <label>
                    {/* <Input placeholder={inputPlaceholder} onChange={inputChangeHandler}> */}
                    <input className="modal__input modal__input_avatar-link" id="avatar" name="avatar"
                        type="url" placeholder="Profile photo link"  ref={avatarRef} required />
                    <span className="modal__input_error" id="avatar-error"></span>
                </label>
            </fieldset>
        </PopupWithForm>
        </>
    )
}