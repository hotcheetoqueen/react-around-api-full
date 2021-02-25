import React from 'react';
import { PopupWithForm } from './PopupWithForm';
import successIcon from '../images/successIcon.png';
import failIcon from '../images/failIcon.png';

function InfoTooltip(props) {
    return (
        <PopupWithForm className='modal__background modal__background_tooltip modal_tooltip' name='tooltip' isOpen={props.isOpen} onClose={props.onClose}>
            <img src={props.feedback === 'success' ? successIcon : failIcon} alt='success or failure feedback icon' />
            <h2 className='modal__title modal__title_tooltip'>{props.feedback ==='success' ? 'Success! You have now been registered.' : 'Oops, something went wrong! Please try again.'}</h2>
        </PopupWithForm>
    )
}

export default InfoTooltip;