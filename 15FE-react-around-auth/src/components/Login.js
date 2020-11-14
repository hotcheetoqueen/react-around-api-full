// for user authorization
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { PopupWithForm } from './PopupWithForm';

function Login({ loggedIn, handleLogin, userEmail, setUserEmail, handleLoginSubmit }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const history = useHistory();

    React.useEffect(() => {
        if (loggedIn) {
            history.push('/home');
            setUserEmail(email || userEmail);
        }
    }, [email, loggedIn, userEmail, setUserEmail]);

    

    return(
        <>
            <PopupWithForm name='credentials' title='Log in' isOpen={true} text="Log in" onSubmit={handleLoginSubmit} to='/home'>
                <Link className='credentials-page__swap-btn' to='/signup'>
                    Sign up
                </Link>
                <input className='modal__input modal__input_credentials' type='email' id='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input className='modal__input modal__input_credentials'  type='password' id='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                <Link className='modal__background_credentials__swap-link' to='/signup'>
                    Not a member yet? Sign up here!
                </Link>
            </PopupWithForm>
        </>
    )
}

export default Login;