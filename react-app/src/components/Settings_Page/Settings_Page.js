import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../Main.css';
import './Settings_Page.css';
// import dropdownData from './dropdown_data.json';
// import { editProfileMedia, resetProfileTheme } from '../../store/session';
import { readUserSettings } from '../../store/settings_store';
import { EditorForm } from './Editor_Form';
import { SetterForm1 } from './Setter_Form_1';
import { SetterForm2 } from './Setter_Form_2';

export const SettingsPage = ({ style }) => {
    // const [profile_media, setProfileMedia] = useState('');
    // const [profile_media_loading, setProfileMediaLoading] = useState(false);

    const dispatch = useDispatch();
    // const user = useSelector(state => state.session.user);

     useEffect(() => {
        dispatch(readUserSettings());
     }, [dispatch])

    // const setProfileMediaHandler = (e) => {
    //     const file = e.target.files[0];
    //     if (file) setProfileMedia(file);
    // }

    // const profileMediaHandler = async (e) => {
    //     e.preventDefault();

    //     const targForm = e.target;
    //     const targFormKids = Array.from(targForm.children);
    //     const isSubmit = targFormKids.find(targKid => targKid.tagName === 'BUTTON' && targKid.innerText === 'Submit');
    //     const hasMedia = targFormKids.find(targKid => targKid.dataset.inputName === 'Profile Media');

    //     if (isSubmit && hasMedia?.value) { 
    //         const formData = new FormData();
    //         formData.append('media', profile_media);
    //         setProfileMediaLoading(true);

    //         await dispatch(editProfileMedia(user.id, formData));
    //         setProfileMediaLoading(false);
    //         window.location.reload();
    //     }
    // }

    // const resetProfileHandler = () => {
    //         dispatch(resetProfileTheme());
    //         console.log(e);
    // }

    return (
        <div className='settings-page-container'>
            <h1 style={{ borderBottom: `2px solid ${style.accent_1}` }}>Settings</h1>
            <div className='create-and-test-container'>
                {/* <div className='settings-actions-container' style={{ border: `3px solid ${style.accent_3}`, backgroundColor: style.background_color }}>
                    <form 
                        id='sett-pg-setter-form-1'
                        data-setting-id={1}
                        className='settings-form setter-form-1'
                        onSubmit={profileMediaHandler}
                    >
                        <label htmlFor='sett-pg-user-profile-media-uploader'>
                            <span style={{ color: style.accent_2, borderBottom: `2px solid ${style.accent_1}` }}>{!profile_media ? 'Upload Profile Media' : 'Added'}</span>
                        </label>
                        <input
                            id='sett-pg-user-profile-media-uploader'
                            data-input-name='Profile Media'
                            type='file'
                            onChange={setProfileMediaHandler}
                        />
                        {profile_media_loading && (<span>Loading...</span>)}
                        <button style={{ color: style.font_color }}>Submit</button>
                    </form>
                </div> */}
                <SetterForm1 style={style} />
                <SetterForm2 style={style} />
            </div>
            <div className='themes-container'>
            <EditorForm style={style} />
            </div>
        </div>
    )
}