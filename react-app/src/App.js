import { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faBookOpen,
    faCheckCircle,
    faCircle,
    faCogs,
    faCopy,
    faHistory,
    faHome,
    faLock,
    faLockOpen,
    faPlusSquare,
    faSignOutAlt,
    faSync,
    faTrashAlt,
    faWindowClose,
} from '@fortawesome/free-solid-svg-icons';
import ScrollToTop from './components/Scroll_to_Top/Scroll_to_Top';
import HistoryPage from './components/History_Page/History_Page';
import SearchPage from './components/Search_Page/Search_Page';
import SettingsPage from './components/Settings_Page/Settings_Page';
import Modal from './components/Modals/Modal';
import { authenticateLogin, authenticateSignup } from './store/session';

import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignupForm';
import NavBar from './components/Navigation/Nav_Bar';
// import defaultThemes from './default_themes.json';

library.add(
    faBookOpen,
    faCheckCircle,
    faCircle,
    faCogs,
    faCopy,
    faHistory,
    faHome,
    faLock,
    faLockOpen,
    faPlusSquare,
    faSignOutAlt,
    faSync,
    faTrashAlt,
    faWindowClose,
);

function App() {
    const [loaded, setLoaded] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();

    const user = useSelector((state) => state.session.user);
    const settings = useSelector((state) => state.settings);
    const aT = settings[user?.active_theme];

    const siteTheme = {
        background_color: aT?.background_color || '#eae7dc',
        background_rotate: aT?.background_rotate || false,
        background_media: aT?.background_media ? `url('${aT?.background_media}')` : 'url()',
        font_color: aT?.font_color || '#e85a4f',
        font_family: aT?.font_family || 'Raleway, sans-serif',
        font_size: aT?.font_size || '16px',
        accent_1: aT?.accent_1 || '#d8c3a5',
        accent_2: aT?.accent_2 || '#8e8d8a',
        accent_3: aT?.accent_3 || '#e98074',
    };

    const { body } = document;
    document.body.style.backgroundColor = siteTheme.background_color;
    document.body.style.backgroundImage = siteTheme.background_media;
    document.body.style.color = siteTheme.font_color;
    document.body.style.fontFamily = siteTheme.font_family;
    document.body.style.fontSize = siteTheme.font_size;
    if (siteTheme.background_rotate) body.classList.add('background-rotate');
    else if (!siteTheme.background_rotate) body.classList.remove('background-rotate');

    useEffect(() => {
        (async () => {
            await dispatch(authenticateLogin());
            await dispatch(authenticateSignup());
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
                <Route path='/api/auth/login' exact={true}>
                    <LoginForm style={siteTheme} />
                </Route>
                <Route path='/api/auth/signup' exact={true}>
                    <SignupForm style={siteTheme} />
                </Route>
                <ProtectedRoute path='/api/settings/' exact={true}>
                    <SettingsPage style={siteTheme} />
                </ProtectedRoute>
                <ProtectedRoute path='/api/history/' exact={true}>
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
