import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { editProfile } from '../../store/session';
import { readUserSettings } from '../../store/settings_store';
import EditThemeForm from './Edit_Theme_Form';
import ProfileMediaForm from './Profile_Media_Form';
import CreateThemeForm from './Create_Theme_Form';
import '../Main.css';
import './Settings_Page.css';

const SettingsPage = ({ style }) => {
    const history = useHistory();
    const dispatch = useDispatch();

    window.onbeforeunload = (e) => {
        e.returnValue = '';
        history.push('/');
        sessionStorage.setItem('refresh', 'true');
    };

    if (sessionStorage.refresh === 'true') {
        history.push('/');
        sessionStorage.refresh = 'false';
    }

    //$ window.onbeforeunload = (e) => {
    //     sessionStorage.setItem('refresh', 'true');
    //     e.returnValue = '';
    // };

    // if (sessionStorage.refresh === 'true') {
    //     history.push('/');
    //     sessionStorage.refresh = 'false';
    // }

    useEffect(() => {
        dispatch(readUserSettings());
    }, [dispatch]);

    const resetTheme = (eType) => {
        dispatch(editProfile({
            column: eType,
        }));
    };

    return (
        <div className='settings-page-container'>
            <h1 className='settings-page-header' style={{ borderColor: style.accent_1 }}>Settings</h1>
            <div className='create-and-test-container'>
                <div
                    className='settings-actions-container'
                    style={{ borderColor: style.accent_3, backgroundColor: style.background_color }}
                >
                    <h2 className='settings-actions-header' style={{ color: style.accent_2, borderColor: style.accent_1 }}>Profile</h2>
                    <ProfileMediaForm style={style} />
                    <button
                        type='button'
                        onClick={() => resetTheme('reset_theme')}
                        style={{
                            color: style.font_color,
                            fontFamily: style.font_family,
                            fontSize: style.font_size,
                        }}
                    >
                        Set Theme to Default
                    </button>
                </div>
                <div
                    className='create-theme-container'
                    style={{ backgroundColor: style.background_color }}
                >
                    <CreateThemeForm style={style} />
                </div>
            </div>
            <div className='themes-container'>
                <EditThemeForm style={style} />
            </div>
        </div>
    );
};

export default SettingsPage;
