import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
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


    return (
        <div className='settings-page-container'>
            <h1 style={{ borderBottom: `2px solid ${style.accent_1}` }}>Settings</h1>
            <div className='create-and-test-container'>
                <SetterForm1 style={style} />
                <SetterForm2 style={style} />
            </div>
            <div className='themes-container'>
            <EditorForm style={style} />
            </div>
        </div>
    )
}