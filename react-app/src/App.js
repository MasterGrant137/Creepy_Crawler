import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import LoginForm from './components/auth/LoginForm';
import SignUpForm from './components/auth/SignUpForm';
import NavBar from './components/Navigation/Nav_Bar';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { ScrollToTop } from './components/Scroll_to_Top/Scroll_to_Top';
import { HistoryPage } from './components/History_Page/History_Page';
import { SearchPage } from './components/Search_Page/Search_Page';
import { SettingsPage } from './components/Settings_Page/Settings_Page';
import { authenticate } from './store/session';
import { Modal } from './components/Modals/Modal';

function App() {
  const [loaded, setLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  const siteTheme = {
    backgroundColor: `#EAE7DC`,
    backgroundImage: ``,
    color: `#E85A4F`,
    fontFamily: `Georgia, serif`,
    fontSize: `16px`,
    accent_1: ``,
    accent_2: ``,
    accent_3: ``
  }

  document.body.style.backgroundColor = siteTheme.backgroundColor;
  document.body.style.color = siteTheme.color;
  document.body.style.fontFamily = siteTheme.fontFamily;
  document.body.style.fontSize = siteTheme.fontSize;

  useEffect(() => {
    (async() => {
      await dispatch(authenticate());
      setLoaded(true);
    })();
  }, [dispatch]);

  if (!loaded) {
    return null;
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Modal open={isOpen} onClose={() => setIsOpen(false)} />
      <NavBar />
      <Switch>
        <Route path='/login' exact={true}>
          <LoginForm style={siteTheme} />
        </Route>
        <Route path='/sign-up' exact={true}>
          <SignUpForm style={siteTheme} />
        </Route>
        <ProtectedRoute path='/settings' exact={true}>
          <SettingsPage style={siteTheme} />
        </ProtectedRoute>
        <ProtectedRoute path='/history' exact={true}>
          <HistoryPage style={siteTheme} />
        </ProtectedRoute>
        <Route path='/' exact={true} >
          <SearchPage style={siteTheme} />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
