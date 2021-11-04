import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { resetProfileTheme } from '../../store/session';
import { readUserSettings } from '../../store/settings_store';
import { EditorForm } from './Editor_Form';
import { SetterForm1 } from './Setter_Form_1';
import { SetterForm2 } from './Setter_Form_2';
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
                 <h1 style={{ borderBottom: `2px solid ${style.accent_1}` }}>Profile</h1>
                <SetterForm1 style={style} />
                <button data-setting-id='null' type='button' onClick={(e) => resetProfileHandler(e, 'reset_theme')}>Set Theme to Default</button>
            </div>
                <SetterForm2 style={style} />
            </div>
            <div className='themes-container'>
            <EditorForm style={style} />
            </div>
        </div>
    )
}