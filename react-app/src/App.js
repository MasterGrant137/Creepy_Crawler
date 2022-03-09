import { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faCheckCircle,
  faCircle,
  faCogs,
  faCompass,
  faCopy,
  faHistory,
  faLock,
  faLockOpen,
  faPlusSquare,
  faSignInAlt,
  faSignOutAlt,
  faSpider,
  faSync,
  faTrashAlt,
  faUserPlus,
  faWindowClose,
} from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';

import ScrollToTop from './components/Scroll_to_Top/Scroll_to_Top';
import HistoryPage from './components/History_Page/History_Page';
import SearchPage from './components/Search_Page/Search_Page';
import SearchResultsPage from './components/Search_Page/Search_Results_Page';
import SettingsPage from './components/Settings_Page/Settings_Page';
import Modal from './components/Modals/Modal';
import { authenticateLogin, authenticateSignup } from './store/session';

import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignupForm';
import NavBar from './components/Navigation/Nav_Bar';
import defaultThemes from './default_themes.json';

library.add(
  faCheckCircle,
  faCircle,
  faCogs,
  faCompass,
  faCopy,
  faGithub,
  faHistory,
  faLinkedin,
  faLock,
  faLockOpen,
  faPlusSquare,
  faSignInAlt,
  faSignOutAlt,
  faSpider,
  faSync,
  faTrashAlt,
  faUserPlus,
  faWindowClose,
);

function App() {
  const [loaded, setLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  const user = useSelector((state) => state.session.user);
  const settings = useSelector((state) => state.settings);
  const cT = settings[user?.custom_theme];
  const dT = defaultThemes['Parchment Handlee'];

  useEffect(() => {
    (async () => {
      await dispatch(authenticateLogin());
      await dispatch(authenticateSignup());
      setLoaded(true);
    })();
  }, [dispatch]);

  const customTheme = {
    accent_1: cT?.accent_1 || dT.accent_1,
    accent_2: cT?.accent_2 || dT.accent_2,
    accent_3: cT?.accent_3 || dT.accent_3,
    background_color: cT?.background_color || dT.background_color,
    background_rotate: cT?.background_rotate || dT.background_rotate,
    background_media: `url('${cT?.background_media}')` || `url('${dT.background_media}')`,
    font_color: cT?.font_color || dT.font_color,
    font_family: cT?.font_family || dT.font_family,
    font_size: cT?.font_size || dT.font_size,
  };

  const siteTheme = defaultThemes[user?.default_theme] || customTheme;

  const { body } = document;
  body.style.backgroundColor = siteTheme.background_color;
  body.style.backgroundImage = siteTheme.background_media;
  body.style.color = siteTheme.font_color;
  body.style.fontFamily = siteTheme.font_family;
  body.style.fontSize = siteTheme.font_size;
  if (siteTheme.background_rotate) body.classList.add('background-rotate');
  else if (!siteTheme.background_rotate) body.classList.remove('background-rotate');

  if (!loaded) return null;
  return (
      <BrowserRouter>
          <ScrollToTop />
          <Modal open={isOpen} onClose={() => setIsOpen(false)} />
          <NavBar style={siteTheme} />
          <Routes>
              <Route path='/auth/login' element={<LoginForm style={siteTheme} />} exact />
              <Route path='/auth/signup' element={<SignupForm style={siteTheme} />} exact />
              <Route path='/settings/' element={<ProtectedRoute><SettingsPage style={siteTheme} /></ProtectedRoute>} exact />
              <Route path='/search/history/' element={<ProtectedRoute><HistoryPage style={siteTheme} /></ProtectedRoute>} exact />
              <Route path='/search/results/' element={<ProtectedRoute><SearchResultsPage style={siteTheme} /></ProtectedRoute>} exact />
              <Route path='/' element={<SearchPage style={siteTheme} />} exact />
          </Routes>
      </BrowserRouter>
  );
}

export default App;
