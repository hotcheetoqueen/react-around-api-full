// // for user registration
import React, { useState } from 'react';
import { Link, useHistory} from 'react-router-dom';
import { PopupWithForm } from './PopupWithForm';

function Register({ handleLogin, handleTooltip, handleRegisterSubmit }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const history = useHistory();

    React.useEffect(() => {
        if(localStorage.getItem('token')) {
            history.push('/home');
        }
    }, [history])

    return (
        <>
            <PopupWithForm title='Sign up' name='credentials' text='Sign up' isOpen={true} onSubmit={handleRegisterSubmit}>
                <Link className='credentials-page__swap-btn' to='/signin'>
                    Log in
                </Link>
                <input className='modal__input modal__input_credentials' type='email' id='email' placeholder='Email' value={email} onChange={e => setEmail(e.target.value)} required />
                <input className='modal__input modal__input_credentials' type='password' id='password' placeholder='Password' value={password} onChange={e => setPassword(e.target.value)} required />
                <Link className='modal__background_credentials__swap-link' to='/signin'>
                    Already a member? Log in here!
                </Link>
            </PopupWithForm>
        </>
    )
}

export default Register;