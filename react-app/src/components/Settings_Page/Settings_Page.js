import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../Main.css';
import './Settings_Page.css';
import dropdownData from './dropdown_data.json';
import { editProfileMedia, resetProfileTheme } from '../../store/session';
import { createUserSetting, readUserSettings, updateThemeMedia } from '../../store/settings_store';
import { EditorForm } from './Editor_Form';

export const SettingsPage = ({ style }) => {
    const fontSizesRaw = dropdownData['font-sizes'];
    const fontFamiliesRaw = dropdownData['fonts'];
    const [toggledState, toggleState] = useState(true)
    const [p_f_2_disabled, setPF2Disabled] = useState(true);
    const [p_f_2_btn, setPF2Btn] = useState('Edit');
    const [theme_name, setThemeName] = useState('');
    const [font_family, setFontFamily] = useState(style.font_family);
    const [font_size, setFontSize] = useState(style.font_size);
    const [background_color, setBackgroundColor] = useState(style.background_color);
    const [background_rotate, setBackgroundRotate] = useState(style.background_rotate);
    const [font_color, setFontColor] = useState(style.font_color);
    const [accent_1, setAccent1] = useState(style.accent_1);
    const [accent_2, setAccent2] = useState(style.accent_2);
    const [accent_3, setAccent3] = useState(style.accent_3);
    const [profile_media, setProfileMedia] = useState('');
    const [background_media, setBackgroundMedia] = useState(style.background_media);
    const [profile_media_loading, setProfileMediaLoading] = useState(false);
    const [background_media_loading, setBackgroundMediaLoading] = useState(false);

    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user);
    
    const smpl = {
        b_c: `${background_color}`,
        f_c: `${font_color}`,
        f_f: `${font_family}`,
        f_s: `${font_size}`,
        a_1: `${accent_1}`,
        a_2: `${accent_2}`,
        a_3: `${accent_3}`
      }

     useEffect(() => {
        dispatch(readUserSettings());
     }, [dispatch])

    const resetHandler = (e) => { 
        const targID = e.target.dataset.settingId;
        const targForm = document.getElementById(`sett-pg-setter-form-${targID}`);
        const targFormKids = Array.from(targForm.children);

        if (!toggledState) {
            setPF2Disabled(true);
            setPF2Btn('Edit');
            toggleState(true);
        }

        targFormKids.forEach(targKid => {
            switch (targKid.dataset.inputName) {
                case 'Theme Name': setThemeName(style.theme_name || ''); break;
                case 'Background Color': setBackgroundColor(style.background_color); break;
                case 'Background Media': targKid.value = ''; break;
                case 'Background Rotate': setBackgroundRotate(style.background_rotate); break;
                case 'Font Color': setFontColor(style.font_color); break;
                case 'Font Family': setFontFamily(style.font_family); break;
                case 'Font Size': setFontSize(style.font_size); break;
                case 'Accent 1': setAccent1(style.accent_1); break;
                case 'Accent 2': setAccent2(style.accent_2); break;
                case 'Accent 3': setAccent3(style.accent_3); break;
                default: break;
            }
        })
    }

    const setProfileMediaHandler = (e) => {
        const file = e.target.files[0];
        if (file) setProfileMedia(file);
    }

    const setBackgroundMediaHandler = (e) => {
        const file = e.target.files[0];
        if(file) setBackgroundMedia(file);
    }

    const profileMediaHandler = async (e) => {
        e.preventDefault();

        const targForm = e.target;
        const targFormKids = Array.from(targForm.children);
        const isSubmit = targFormKids.find(targKid => targKid.tagName === 'BUTTON' && targKid.innerText === 'Submit');
        const hasMedia = targFormKids.find(targKid => targKid.dataset.inputName === 'Profile Media');

        if (isSubmit && hasMedia?.value) { 
            const formData = new FormData();
            formData.append('media', profile_media);
            setProfileMediaLoading(true);

            await dispatch(editProfileMedia(user.id, formData));
            setProfileMediaLoading(false);
            window.location.reload();
        }
    }

    const createSettingHandler = async (e) => {
        e.preventDefault();
        
        const targForm = e.target;
        const targFormKids = Array.from(targForm.children);
        const isSubmit = targFormKids.find(targKid => targKid.tagName === 'BUTTON' && targKid.innerText === 'Submit');
        const hasMedia = targFormKids.find(targKid => targKid.dataset.inputName === 'Background Media');
       
        toggleState(prevState => !prevState);

        if (!toggledState) {
            setPF2Disabled(true)
            setPF2Btn('Edit')
        } else {
            setPF2Disabled(false)
            setPF2Btn('Submit')
        }

        if (p_f_2_btn === 'Submit') {
            const user_id = user.id;
    
             await dispatch(createUserSetting({
                user_id,
                theme_name,
                background_color,
                background_rotate,
                font_color,
                font_family,
                font_size,
                accent_1,
                accent_2,
                accent_3,
            }));
            

            if (isSubmit && hasMedia.value) { 
                console.log('hit', e.target.dataset.settingId);

                const formData = new FormData();
                formData.append('media', background_media);
                setBackgroundMediaLoading(true);
                
                dispatch(updateThemeMedia(user.id, formData));
                setBackgroundMediaLoading(false);
                window.location.reload();
            }
            resetHandler(e);
        }
    }

    //* Removed Edit Profile Handler
    // const editProfileHandler = (e, eType) => {
    //     if (eType === 'theme_count') {
    //         dispatch(editProfile({
    //             id: e.target.dataset.settingId,
    //             column: eType,
    //             theme_count: user.theme_count + 1,
    //         }))
    //     }
    //     else {
    //         dispatch(editProfile({
    //             id: e.target.dataset.settingId,
    //             eType: e.target
    //         }))
    //     }
    // }

    //* SAVING THIS FOR LATER DEVELOPMENT
    // const resetProfileHandler = () => {
    //         dispatch(resetProfileTheme());
    //         console.log(e);
    // }

    const fontSizes = fontSizesRaw.map(fontSize => (
        <option key={fontSize} >
            {fontSize}
        </option>
    ))

    const fontFamilies = fontFamiliesRaw.map(fontFamily => (
        <option key={fontFamily} >
            {fontFamily}
        </option>
    ))

    return (
        <div className='settings-page-container'>
            <h1 style={{ borderBottom: `2px solid ${style.accent_1}` }}>Settings</h1>
            <div className='create-and-test-container'>
                <div className='settings-actions-container' style={{ border: `3px solid ${style.accent_3}`, backgroundColor: style.background_color }}>
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
                    {/* <button data-setting-id='null' type='button' onClick={(e) => resetProfileHandler(e, 'reset_theme')}>Set Theme to Default</button> */}
                </div>
                <div 
                    className='create-theme-container' 
                    style={{ border: `3px solid ${style.accent_3}` }}
                >
                    <form 
                        id='sett-pg-setter-form-2'
                        data-setting-id={2}
                        className='settings-form setter-form-2' 
                        onSubmit={createSettingHandler}
                        style={{ backgroundColor: style.background_color }}
                    >
                        <h2 style={{ color: style.accent_2, borderBottom: `2px solid ${style.accent_1}` }}>Create Theme</h2>
                            <button style={{ color: font_color, fontFamily: font_family }}>
                                {p_f_2_btn}
                            </button>
                            <button
                                type='button'
                                data-setting-id={2}
                                data-submit-btn-state={p_f_2_btn === 'Submit' ? true : false} 
                                onClick={resetHandler}
                                style={{ color: font_color, fontFamily: font_family }}
                            >
                                Cancel
                            </button>
                        <label htmlFor='sett-page-theme-name-setter'>Theme Name</label>
                        <input
                            id='sett-page-theme-name-setter'
                            readOnly={p_f_2_disabled}
                            data-input-name='Theme Name'
                            type='text'
                            placeholder='Theme Name'
                            value={theme_name}
                            onChange={(e) => setThemeName(e.target.value)}
                        />
                        <label htmlFor='sett-pg-bg-color-setter'>Background Color</label>
                        <input
                            id='sett-pg-bg-color-setter'
                            data-input-name='Background Color'
                            type='color'
                            disabled={p_f_2_disabled}
                            value={background_color}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                        />
                        <label htmlFor='sett-pg-background-media-uploader'>
                            {background_media !== '' ? 'Background Media' : 'Added'}
                        </label>
                        <input
                            id='sett-pg-background-media-uploader'
                            data-input-name='Background Media'
                            type='file'
                            disabled={p_f_2_disabled}
                            onChange={setBackgroundMediaHandler}
                        />
                        {background_media_loading && (<span>Loading...</span>)}
                        <label htmlFor='sett-pg-bg-rotate-setter'>Background Rotate</label>
                        <input
                            id='sett-pg-bg-rotate-setter'
                            data-input-name='Background Rotate'
                            type='checkbox'
                            disabled={p_f_2_disabled}
                            checked={background_rotate}
                            onChange={(e) => setBackgroundRotate(e.target.checked)}
                        />
                        <label htmlFor='sett-pg-font-color-setter'>Font Color</label>
                        <input
                            id='sett-pg-font-color-setter'
                            data-input-name='Font Color'
                            type='color'
                            disabled={p_f_2_disabled}
                            value={font_color}
                            onChange={(e) => setFontColor(e.target.value)}
                        />
                        <label htmlFor='font-sizes'>Font Size</label>
                        <select name='font-sizes'
                                id='sett-pg-font-size-setter'
                                data-input-name='Font Size'
                                disabled={p_f_2_disabled}
                                value={font_size?.replace('px', '')}
                                onChange={(e) => {
                                    const targOption = Array.from(e.target.children).find(option => option.selected);
                                    setFontSize(`${targOption.innerText}px`);
                                }}
                        >
                            {fontSizes}
                        </select>
                        <label htmlFor='font-families'>Font Family</label>
                        <select 
                            name='font-families'
                            id='sett-pg-font-family-setter'
                            data-input-name='Font Family'
                            disabled={p_f_2_disabled}
                            value={font_family?.replace(/,\s/, ' | ')}
                            onChange={(e) => {
                                const targOption = Array.from(e.target.children).find(option => option.selected);
                                setFontFamily(targOption.innerText.replace(/\s\|\s/, ', '));
                            }}
                        >
                            {fontFamilies}
                        </select>
                        <label htmlFor='sett-pg-accent-1-color-setter'>Accent 1</label>
                        <input
                            id='sett-pg-accent-1-color-setter'
                            data-input-name='Accent 1'
                            type='color'
                            disabled={p_f_2_disabled}
                            value={accent_1}
                            onChange={(e) => setAccent1(e.target.value)}
                        />
                        <label htmlFor='sett-pg-accent-2-color-setter'>Accent 2</label>
                        <input
                            id='sett-pg-accent-2-color-setter'
                            data-input-name='Accent 2'
                            type='color'
                            disabled={p_f_2_disabled}
                            value={accent_2}
                            onChange={(e) => setAccent2(e.target.value)}
                        />
                        <label htmlFor='sett-pg-accent-3-color-setter'>Accent 3</label>
                        <input
                            id='sett-pg-accent-3-color-setter'
                            data-input-name='Accent 3'
                            type='color'
                            disabled={p_f_2_disabled}
                            value={accent_3}
                            onChange={(e) => setAccent3(e.target.value)}
                        />
                    </form>
                    </div>
                    <div  
                        className='theme-tester-container'
                        style={{
                            border: `3px dashed ${smpl.a_3}`,
                            backgroundColor: smpl.b_c,
                            fontFamily: smpl.f_f,
                            fontSize: smpl.f_s,
                            color: smpl.f_c
                        }}
                    >
                        <h2 style={{ color: style.accent_2, borderBottom: `2px dashed ${smpl.a_1}` }}>{`${theme_name}` || 'Theme Name'}</h2>
                        <div 
                            style={{ backgroundColor: smpl.b_c }}
                        >
                            <h3>Test your theme.</h3>
                            <span>See your theme specs here.</span>
                        </div>
                </div>
            </div>
            <div className='themes-container'>
                {/* {settings} */}
            <EditorForm style={style} />
            </div>
        </div>
    )
}