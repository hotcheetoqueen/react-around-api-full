import React from 'react';
import Nav from './Nav';
import headerLogo from '../images/logoAroundUS.png';	


export default function Header({ loggedIn, userEmail, handleLogout }) {	
    return (	
    <header className="header">	
        <img className="header__logo" alt="Around the U.S. logo." src={headerLogo} />
        <Nav loggedIn={loggedIn} userEmail={userEmail} handleLogout={handleLogout}/>
    </header>
)};
