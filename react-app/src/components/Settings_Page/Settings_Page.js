import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { resetProfileTheme } from '../../store/session';
import { readUserSettings } from '../../store/settings_store';
import { EditThemeForm } from './Edit_Theme_Form';
import { ProfileMediaForm } from './Profile_Media_Form';
import { CreateThemeForm } from './Create_Theme_Form';
import '../Main.css';
import './Settings_Page.css';

export const SettingsPage = ({ style }) => {
    const dispatch = useDispatch();

     useEffect(() => {
        dispatch(readUserSettings());
     }, [dispatch])

     const resetProfileHandler = (e) => {
        dispatch(resetProfileTheme());
        console.log(e);
}

    return (
        <div className='settings-page-container'>
            <h1 style={{ borderBottom: `2px solid ${style.accent_1}` }}>Settings</h1>
            <div className='create-and-test-container'>
                <div 
                    className='settings-actions-container' 
                    style={{ border: `3px solid ${style.accent_3}`, backgroundColor: style.background_color }}
                >
                    <h2 style={{ color: style.accent_2, borderBottom: `2px solid ${style.accent_1}` }}>Profile</h2>
                    <ProfileMediaForm style={style} />
                    <button data-setting-id='null' type='button' onClick={(e) => resetProfileHandler(e, 'reset_theme')}>Set Theme to Default</button>
                </div>
                <div 
                    className='create-theme-container' 
                    style={{ border: `3px solid ${style.accent_3}`, backgroundColor: style.background_color }}
                >
                    <h2 className='create-theme-header' style={{ color: style.accent_2, borderBottom: `2px solid ${style.accent_1}` }}>Create Theme</h2>
                    <CreateThemeForm style={style} />
                </div>
            </div>
            <div className='themes-container'>
                <EditThemeForm style={style} />
            </div>
        </div>
    )
}