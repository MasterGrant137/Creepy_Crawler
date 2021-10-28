import { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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

  const user = useSelector(state => state.session.user);
  const theme = useSelector(state => state.session.theme);

  const siteTheme = {
    active_theme: ``,
    theme_count: ``,
    theme_name: ``,
    background_color: `#EAE7DC`,
    background_image: `url(https://images2.alphacoders.com/602/thumb-1920-602223.jpg)`,
    background_rotate: ``, 
    font_color: `#E85A4F`,
    font_family: `Georgia, serif`,
    font_size: `16px`,
    accent_1: `#D8C3A5`,
    accent_2: `#8E8D8A`,
    accent_3: `#E98074`
  }

  document.body.style.backgroundColor = siteTheme.background_color;
  document.body.style.backgroundImage = siteTheme.background_image;
  document.body.style.color = siteTheme.font_color;
  document.body.style.fontFamily = siteTheme.font_family;
  document.body.style.fontSize = siteTheme.font_size;

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
