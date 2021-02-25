import React from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { PopupWithForm } from './PopupWithForm';

export function EditProfilePopup(props) {
    const currentUser = React.useContext(CurrentUserContext);
    const [name, setName] = React.useState('');
    const [description, setDescription] = React.useState('');

    React.useEffect(() => {
        setName(currentUser && currentUser.name);
        setDescription(currentUser && currentUser.about);
      }, [currentUser]);

      function handleNameUpdate(evt) {
        setName(evt.target.value)
      }
    
      function handleDescriptionUpdate(evt) {
        setDescription(evt.target.value);
      }

    function handleSubmit(evt) {
        evt.preventDefault();
        props.onUpdateUser({
          name,
          about: description,
        });
      }

    return (
        <PopupWithForm name="profile" title="Edit profile" isOpen={props.isOpen} onClose={props.onClose} onSubmit={handleSubmit} text="Save">
            <fieldset className="modal__fieldset">
                <label>
                    <input className="modal__input modal__input_name" name="name" type="text" placeholder="Name" minLength="2" maxLength="40" id="profile-name" value={name || ""} onChange={handleNameUpdate} />
                    <span className="modal__input_error" id="profile-name-error"></span>
                </label>
                <label>
                    <input className="modal__input modal__input_description" name="about" type="text" placeholder="About me" minLength="2" maxLength="200" id="profile-description" value={description || ""} onChange={handleDescriptionUpdate} />
                    <span className="modal__input_error" id="profile-description-error"></span>
                </label>
            </fieldset>
        </PopupWithForm>
    )
}