import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import LoginForm from './components/auth/LoginForm';
import SignUpForm from './components/auth/SignUpForm';
import NavBar from './components/Navigation/NavBar';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { HistoryPage } from './components/History_Page/History_Page';
import { SearchPage } from './components/Search_Page/Search_Page';
import { SettingsPage } from './components/Settings_Page/Settings_Page';
import { authenticate } from './store/session';

function App() {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();

  const siteTheme = {
    backgroundColor: `#EAE7DC`,
    backgroundImage: ``,
    color: `#E85A4F`,
    fontFamily: `Georgia, serif`,
    fontSize: ``
  }

  document.body.style.backgroundColor = siteTheme.backgroundColor;
  document.body.style.color = siteTheme.color;
  document.body.style.fontFamily = siteTheme.fontFamily;

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
