import React from 'react';
import { Route, Switch, useHistory, Redirect, withRouter } from 'react-router-dom';
import { api } from '../utils/Api';
import { AddPlacePopup } from './AddPlacePopup';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { EditAvatarPopup } from './EditAvatarPopup';
import { EditProfilePopup } from './EditProfilePopup';
import { PopupWithForm } from './PopupWithForm';
import PopupWithImage from './PopupWithImage'; 
import Footer from './Footer';
import Header from './Header';
import InfoTooltip from './InfoTooltip';
import Login from './Login';
import Main from './Main';
import ProtectedRoute from './ProtectedRoute';
import Register from './Register';
import * as auth from '../utils/Auth';

function App(props) {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isDeletePlacePopupOpen, setIsDeletePlacePopupOpen] = React.useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = React.useState(false);
  const [isTooltipOpen, setIsTooltipOpen] = React.useState(false);
  const [tooltipFeedback, setTooltipFeedback] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [cards, setCards] = React.useState([]);
  const [currentUser, setCurrentUser] = React.useState(null);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [registered, setRegistered] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [token, setToken] = React.useState(localStorage.getItem('jwt'));

  const history = useHistory();

  function handleEditAvatarClick() {
      setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
      setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
      setIsAddPlacePopupOpen(true);
  }

  function handleDeletePlaceClick() {
    setIsDeletePlacePopupOpen(true);
  }

  function handleCardClick(card) {
      setSelectedCard(card);
  }

  function handleUpdateUserInfo({ name, about }) {
      api.updateUserInfo({ name, about }, token)
        .then((res) => {
          setCurrentUser(res)
        })
        .then((res) => {
          closeAllPopups()
        })
        .catch((err) => {
          console.log(err);
        });    
    }

  function handleUpdateAvatar({ avatar }) {
      api.setUserAvatar(avatar.current.value, token)
      .then((res) => {
          setCurrentUser(res);
        })
        .then((res) => {
          closeAllPopups()
        })
        .catch((err) => {
          console.log(err);
        });
  }

  function handleAddPlace({ caption, imageUrl }) {
      api.addCard({ caption, imageUrl }, token).then((newCard) => {
        setCards([...cards, newCard]);
      })
      .then((res) => {
        closeAllPopups()
      })
      .catch((err) => {
        console.log(err);
      });
    }

    function handleCardLike(card) {
        const isLiked = card.likes.some((i) => i._id === currentUser._id);
        api.toggleLike(card._id, isLiked, token).then((newCard) => {
          const newCards = cards.map((c) => (c._id === card._id ? newCard : c));
          setCards(newCards);
        });
    }

    function handleCardDelete(card) {    
        api.deleteCard(card._id, token).then(() => {
            setCards(cards.filter((c) => c._id !== card._id));
        })
        .then((res) => {
          closeAllPopups()
        })
        .catch((err) => {
          console.log(err);
        });
    }
  
    React.useEffect(() => {
      setCards(cards);
    }, [cards])
  

  function closeAllPopups() {
      setIsAddPlacePopupOpen(false);
      setIsEditProfilePopupOpen(false);
      setIsEditAvatarPopupOpen(false);
      setIsDeletePlacePopupOpen(false);
      setIsImagePopupOpen(false);
      setIsTooltipOpen(false);
      setSelectedCard(null);
  }

  function handleTooltip(feedback) {
      setTooltipFeedback(feedback);
      setIsTooltipOpen(true);
  }

  const onLogout = () => {
    localStorage.removeItem('jwt');
    setLoggedIn(false);
    history.push('/signin');
  }
  
  function handleLogin() {
    setLoggedIn(true);
    setUserEmail(email);
  }

  // const loggedInRef = handleLogin();

  React.useEffect(() => {

    if (loggedIn) {
      api.getUserInfo(token)
        .then((res) => {
          setCurrentUser(res);
      // setCurrentUser(res.owner._id);
      // setIsLoading(true);
        api.getCardList()
            .then((res) => {
              if (res) {
                setCards((cards) => [...cards, ...res]);
              }
            }).catch((err) => {
                console.log(err);
            });
        })
          .catch((err) => {
            console.log(err);
          });
        }
      }, [loggedIn, token]);

      const resetForm = (e) => {
        setEmail('')
        setPassword('')
        setMessage('')
    }

    React.useEffect(() => {
      // you call this token with set state above, if uncomment remove this so it uses that variable
      // const jwt = localStorage.getItem('jwt');
  
      if (token) {
        auth.getContent(token)
        .then((res) => {
          setLoggedIn(true);
          setUserEmail(res.data.email);
        })
        .catch((err) => {
          console.log(err);
        });
      } else {
        setLoggedIn(false);
      }
    }, [token] );

    const handleRegisterSubmit = (e) => {
        e.preventDefault();
        const [email, password] = [e.target.email.value, e.target.password.value];

        auth.register(email, password)
            .then((res) => {
            if (!res) {
                handleTooltip('failure');
                throw new Error(`${res.message ? res.message : res.error}`);
              }})
              .then((res) => {
                setRegistered(true);
                history.push('/signin');
              })
              .then((res) => {
                handleTooltip('success');
                return res;
              })
            // .then(resetForm)
            .catch(err => {
              console.log(err)
            });
        }

      const handleLoginSubmit = (e) => {
        e.preventDefault();
        const [email, password] = [e.target.email.value, e.target.password.value];

        auth.authorize(email, password)
        .then((data) => {
          if (data) {
            // if (data && data.token) {
            //     setToken(data.token);
            //     localStorage.setItem('jwt', data.token);
                handleLogin();
                history.push('/home')

            } else {
                resetForm();
                if (!email || !password){
                  throw new Error('400 - uh oh, something is off with those credentials!');
                }
                if (!data){
                    throw new Error('We cannot seem to find that user -- are you sure they exist?')
                }
          }
        })
        // .then(() => {
        //   // handleLogin();
        // })
        // .then(() => {
        //     resetForm();
        // })
        // .then(() => {
        //   history.push('/home')
        // })
        .catch(err => setMessage(err.message));
    }

  return (
    // <>
        <CurrentUserContext.Provider value={currentUser}>
            <div className="page">
              <div className="page__container">
                <Header loggedIn={loggedIn} userEmail={userEmail} handleLogout={onLogout} />
                <InfoTooltip isOpen={isTooltipOpen} onClose={closeAllPopups} feedback={tooltipFeedback} loggedIn={loggedIn} />
                    <Switch>
                      <Route exact path='/signin' >
                        <Login handleLogin={handleLogin} handleLoginSubmit={handleLoginSubmit} feedback={tooltipFeedback} handleLogout={onLogout} userEmail={userEmail} setUserEmail={setUserEmail} handleTooltip={handleTooltip} password={password}
              setPassword={setPassword} />
                      </Route>
                      <Route exact path='/signup'>
                        <Register handleRegisterSubmit={handleRegisterSubmit} registered={registered} handleLogin={handleLogin} userEmail={userEmail}
                          setUserEmail={setUserEmail} email={email} password={password}
                          setPassword={setPassword} handleTooltip={handleTooltip} feedback={tooltipFeedback} handleLogout={onLogout} />
                      </Route>
                      <Route exact path='/'>
                        {loggedIn ? <Redirect to="/home" /> : <Redirect to="/signin" />}
                      </Route>
                      <Route path='/home'>
                        <EditProfilePopup
                            isOpen={isEditProfilePopupOpen}
                            onClose={closeAllPopups}
                            onUpdateUser={handleUpdateUserInfo}
                        />
                        <EditAvatarPopup
                            isOpen={isEditAvatarPopupOpen}
                            onClose={closeAllPopups}
                            onUpdateAvatar={handleUpdateAvatar}
                        />
                        <AddPlacePopup
                            isOpen={isAddPlacePopupOpen}
                            onClose={closeAllPopups}
                            onAddNewCard={handleAddPlace}
                        />
                        <PopupWithForm name="delete" title="Are you sure?" isOpen={isDeletePlacePopupOpen} onClose={closeAllPopups} onDeletePlace={handleDeletePlaceClick} text="Yes" />
                        <PopupWithImage isOpen={isImagePopupOpen} onClose={closeAllPopups} card={selectedCard} />
                        <ProtectedRoute path='/home'
                            component={Main}
                            loggedIn={loggedIn}
                            onEditProfile={handleEditProfileClick}
                            onAddPlace={handleAddPlaceClick}
                            onEditAvatar={handleEditAvatarClick}
                            onCardClick={handleCardClick}
                            onCardDelete={handleDeletePlaceClick}
                            onClosePopups={closeAllPopups}
                            onCardLike={handleCardLike}
                            isEditProfilePopupOpen={isEditProfilePopupOpen}
                            isAddPlacePopupOpen={isAddPlacePopupOpen}
                            isDeletePlacePopupOpen={isDeletePlacePopupOpen}
                            isEditAvatarPopupOpen={isEditAvatarPopupOpen}
                            isImagePopupOpen={isImagePopupOpen}
                            selectedCard={selectedCard}
                            cards={cards}
                        />
                        <Footer />
                    </Route>
                    <Redirect from='*' to='/' />
                  </Switch>
              </div>
            </div>
        </CurrentUserContext.Provider>
    // </>
  );
}

// export default App;
export default withRouter(App);