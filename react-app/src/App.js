import { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ScrollToTop } from './components/Scroll_to_Top/Scroll_to_Top';
import { HistoryPage } from './components/History_Page/History_Page';
import { SearchPage } from './components/Search_Page/Search_Page';
import { SettingsPage } from './components/Settings_Page/Settings_Page';
import { authenticate } from './store/session';
import { Modal } from './components/Modals/Modal';

import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignupForm';
import NavBar from './components/Navigation/Nav_Bar';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faHome, faHistory, faUserCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
library.add(faHome, faHistory, faUserCog, faSignOutAlt);

function App() {
  const [loaded, setLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  const user = useSelector(state => state.session.user);
  const settings = useSelector(state => state.settings);
  const a_t = settings[user?.active_theme];

  const siteTheme = {
    background_color: a_t?.background_color || `#eae7dc`,
    background_rotate: a_t?.background_rotate || false,
    background_media: a_t?.background_media ? `url('${a_t?.background_media}')` : 'url()',
    font_color: a_t?.font_color || `#e85a4f`,
    font_family: a_t?.font_family || `Georgia, serif`,
    font_size: a_t?.font_size || `16px`,
    accent_1: a_t?.accent_1 || `#d8c3a5`,
    accent_2: a_t?.accent_2 || `#8e8d8a`,
    accent_3: a_t?.accent_3 || `#e98074`
  }

  const body = document.body;
  document.body.style.backgroundColor = siteTheme.background_color;
  document.body.style.backgroundImage = siteTheme.background_media;
  document.body.style.color = siteTheme.font_color;
  document.body.style.fontFamily = siteTheme.font_family;
  document.body.style.fontSize = siteTheme.font_size;
  if (siteTheme.background_rotate) body.classList.add('background-rotate');
  else if (!siteTheme.background_rotate) body.classList.remove('background-rotate');

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
      <NavBar style={siteTheme} />
      <Switch>
        <Route path='/creepycrawler/auth/' exact={true}>
          <LoginForm style={siteTheme} />
        </Route>
        <Route path='/signup' exact={true}>
          <SignupForm style={siteTheme} />
        </Route>
        <ProtectedRoute path='/creepycrawler/settings/' exact={true}>
          <SettingsPage style={siteTheme} />
        </ProtectedRoute>
        <ProtectedRoute path='/history/' exact={true}>
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
