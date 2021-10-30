import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../Main.css';
import './Settings_Page.css';
import dropdownData from './dropdown_data.json';
import { editProfileMedia, editProfile } from '../../store/session';
import { createUserSetting, readUserSettings, updateUserSetting, updateThemeMedia, deleteUserSetting } from '../../store/settings_store';

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
    const [errors, setErrors] = useState([]);
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
        dispatch(readUserSettings())
    }, [dispatch, user])

    const resetHandler = (e) => {

        // const targForm = e.target;
        // const targFormKids = Array.from(targForm.children);
        // const settingID = targForm.dataset.settingId;



        window.location.reload();
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

        const formData = new FormData();
        formData.append('media', profile_media);
        setProfileMediaLoading(true);

        const data = await dispatch(editProfileMedia(user.id, formData));
        setProfileMediaLoading(false);

        if (data.errors) {
            setErrors(data.errors);
        }
    }

    const createSettingHandler = async (e) => {
        e.preventDefault();
        
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
    
            const data = await dispatch(createUserSetting({
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

            if (data.errors) {
                setErrors(data.errors);
            }

            const formData = new FormData();
            formData.append('media', background_media);
            setBackgroundMediaLoading(true);
            
            const updateData = dispatch(updateThemeMedia(user.id, formData));
            setBackgroundMediaLoading(false);

            if (updateData.errors) {
                setErrors(updateData.errors);
            }
        }
    }

    const editFormHandler = (e) => {
        e.preventDefault();
        const targForm = e.target;
        const targFormKids = Array.from(targForm.children);
        const settingID = targForm.dataset.settingId;

        const updateObj = {
            setting_id: settingID,
            user_id: user.id,
            theme_name,
            background_color,
            background_rotate,
            font_color,
            font_family,
            font_size,
            accent_1,
            accent_2,
            accent_3,
        }

        if (targFormKids.find(targKid => targKid.tagName === 'BUTTON' && targKid.innerText === 'Submit')) { 
            console.log('HIT');
            const formData = new FormData();
            formData.append('media', background_media);
            setBackgroundMediaLoading(true);
    
            const data = dispatch(updateThemeMedia(settingID, formData));
            setBackgroundMediaLoading(false);
    
            if (data.errors) {
                setErrors(data.errors);
            }
        }

        targFormKids.forEach(targKid => {
            if (targKid.type === 'text') targKid.readOnly = false;
            else targKid.disabled = false;
            if (targKid.tagName === 'BUTTON' && targKid.innerText === 'Edit') {
                targKid.innerText = 'Submit';
                targKid.type = 'submit';
            } else if (targKid.tagName === 'BUTTON' && targKid.innerText === 'Submit') {
                targKid.innerText = 'Edit';
                targKid.type = 'button';
                targFormKids.forEach(targKid => {
                    if (targKid.tagName !== 'BUTTON') {
                        switch (targKid.dataset.inputName) {
                            case 'Theme Name': updateObj.theme_name = targKid.value; break;
                            case 'Background Color': updateObj.background_color = targKid.value; break;
                            case 'Background Rotate': updateObj.background_rotate = targKid.checked; break;
                            case 'Font Color': updateObj.font_color = targKid.value; break;
                            case 'Font Family': updateObj.font_family = targKid.value; break;
                            case 'Font Size': updateObj.font_size = targKid.value; break;
                            case 'Accent 1': updateObj.accent_1 = targKid.value; break;
                            case 'Accent 2': updateObj.accent_2 = targKid.value; break;
                            case 'Accent 3': updateObj.accent_3 = targKid.value; break;
                            default: break;
                        }
                        targKid.type === 'text' ? targKid.readOnly = true : targKid.disabled = true;
                    }
                })
                dispatch(updateUserSetting(updateObj))
            }
        })
    }

    const editProfileHandler = (e, eType) => {
        console.log(eType);
        if (eType === 'theme_count') {
            dispatch(editProfile({
                id: e.target.dataset.settingId,
                column: eType,
                theme_count: user.theme_count + 1,
            }))
        } else if (eType === 'active_theme') {
            dispatch(editProfile({
                id: e.target.dataset.settingId,
                column: eType,
            }))
            window.location.reload();
        } else {
            dispatch(editProfile({
                id: e.target.dataset.settingId,
                eType: e.target
            }))
        }
    }

    const deleteThemeHandler = (e) => {
        const settingID = e.target.dataset.settingId;
        dispatch(deleteUserSetting(settingID))
    };

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

    const settingsObj = useSelector(state => state.settings);

    const settings = Object.values(settingsObj).map((setting, idx) => (
            <form 
                key={`key-${setting.id}`}
                id={`sett-pg-editor-form-${idx}`}
                onSubmit={editFormHandler}
                data-setting-id={setting.id}
                style={{backgroundImage: `url(${setting.background_media})`}}
            >
                <label htmlFor={`sett-pg-theme-name-editor-${idx}`}>Theme Name</label>
                <input id={`sett-pg-theme-name-editor-${idx}`} type='text' readOnly={true} data-input-name={'Theme Name'} defaultValue={setting.theme_name} />
                <label htmlFor={`font-sizes-${idx}`}>Font Size</label>
                <select 
                    name={`font-sizes-${idx}`}
                    id={`sett-pg-font-size-editor-${idx}`}
                    data-input-name={'Font Size'}
                    disabled={true}
                    defaultValue={setting.font_size?.replace('px', '')}
                    >
                    {fontSizes}
                </select>
                <label htmlFor={`font-families-${idx}`}>Font Family</label>
                <select
                    name={`font-families-${idx}`}
                    id={`sett-pg-font-family-editor-${idx}`}
                    data-input-name={'Font Family'} 
                    disabled={true}
                    defaultValue={setting.font_family?.replace(/,\s/, ' | ')}
                >
                   {fontFamilies}
                </select>

                <label htmlFor={`sett-pg-font-color-editor-${idx}`}>Font Color</label>
                <input id={`sett-pg-font-color-editor-${idx}`} data-input-name={'Font Color'} type='color' disabled={true} defaultValue={setting.font_color} />

                <label htmlFor={`sett-pg-bg-color-editor-${idx}`}>Background Color</label>
                <input id={`sett-pg-bg-color-editor-${idx}`} data-input-name={'Background Color'} type='color' disabled={true} defaultValue={setting.background_color} />

                <div>
                    <label htmlFor='s-p-background-media-editor'>
                        {background_media !== '' ? 'Background Media' : 'Added'}
                    </label>
                    <input
                        id='s-p-background-media-editor'
                        type='file'
                        disabled={true}
                        onChange={setBackgroundMediaHandler}
                    />
                    {background_media_loading && (<span>Loading...</span>)}
                </div>

                <label htmlFor={`sett-pg-bg-rotate-editor-${idx}`}>Background Rotate</label>
                <input id={`sett-pg-bg-rotate-editor-${idx}`} data-input-name={'Background Rotate'} type='checkbox' disabled={true} defaultChecked={setting.background_rotate} />

                <label htmlFor={`sett-pg-accent-1-color-editor-${idx}`}>Accent 1</label>
                <input id={`sett-pg-accent-1-color-editor-${idx}`} data-input-name={'Accent 1'} type='color' disabled={true} defaultValue={setting.accent_1} />
                
                <label htmlFor={`sett-pg-accent-2-color-editor-${idx}`}>Accent 2</label>
                <input id={`sett-pg-accent-2-color-editor-${idx}`} data-input-name={'Accent 2'} type='color' disabled={true} defaultValue={setting.accent_2} />
                
                <label htmlFor={`sett-pg-accent-3-color-editor-${idx}`}>Accent 3</label>
                <input id={`sett-pg-accent-2-color-editor-${idx}`} data-input-name={'Accent 3'} type='color' disabled={true} defaultValue={setting.accent_3} />
                
                <button>Edit</button>
                <button type='button' onClick={resetHandler}>Cancel</button>
                <button data-setting-id={`${setting.id}`} onClick={(e) => deleteThemeHandler(e)} type='button'>Delete</button>
                <button data-setting-id={`${setting.id}`} type='button' onClick={(e) => editProfileHandler(e, 'active_theme')}>Use</button>
            </form>
    ))

    return (
        <div>
            <h1>Settings</h1>
            <div>
                <h2>Update Media</h2>
                <form id='sett-pg-picker-form-1' onSubmit={profileMediaHandler}>
                    <h3>Profile</h3>
                    <label htmlFor='s-p-user-profile-media-uploader'>
                        {!profile_media ? 'Upload Media' : 'Added'}
                    </label>
                    <input
                        id='s-p-user-profile-media-uploader'
                        type='file'
                        onChange={setProfileMediaHandler}
                    />
                    {profile_media_loading && (<span>Loading...</span>)}
                    <button type='button'>Submit</button>
                </form>
                <div>
                    {errors.map(error => (
                        <div key={error}>{error}</div>
                    ))}
                </div>
            </div>
            <div>
                <h2>Create Theme</h2>
                <form id='sett-pg-picker-form-2' onSubmit={createSettingHandler}>
                    <div>
                        <label htmlFor='sett-page-theme-name-picker'>Theme Name</label>
                        <input
                            id='sett-page-theme-name-picker'
                            readOnly={p_f_2_disabled}
                            data-input-name={'Theme Name'}
                            type='text'
                            placeholder='Theme Name'
                            value={theme_name}
                            onChange={(e) => setThemeName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor='sett-pg-bg-color-picker'>Background Color</label>
                        <input
                            id='sett-pg-bg-color-picker'
                            data-input-name={'Background Color'}
                            type='color'
                            disabled={p_f_2_disabled}
                            value={background_color}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor='s-p-background-media-uploader'>
                            {background_media !== '' ? 'Background Media' : 'Added'}
                        </label>
                        <input
                            id='s-p-background-media-uploader'
                            type='file'
                            disabled={p_f_2_disabled}
                            onChange={setBackgroundMediaHandler}
                        />
                        {background_media_loading && (<span>Loading...</span>)}
                    </div>
                    <div>
                        <label htmlFor='sett-pg-bg-rotate-picker'>Background Rotate</label>
                        <input
                            id='sett-pg-bg-rotate-picker'
                            data-input-name={'Background Rotate'}
                            type='checkbox'
                            disabled={p_f_2_disabled}
                            checked={background_rotate}
                            onChange={(e) => {
                                setBackgroundRotate(e.target.checked)
                                console.log(typeof(e.target.checked), e.target.checked);
                                console.log(typeof(background_rotate), e.target.checked);
                            }}
                        />
                    </div>
                    <div>
                        <label htmlFor='sett-pg-font-color-picker'>Font Color</label>
                        <input
                            id='sett-pg-font-color-picker'
                            data-input-name={'Font Color'}
                            type='color'
                            disabled={p_f_2_disabled}
                            value={font_color}
                            onChange={(e) => setFontColor(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor='font-sizes'>Font Size</label>
                        <select name='font-sizes'
                                id='sett-pg-font-size-picker'
                                data-input-name={'Font Size'}
                                disabled={p_f_2_disabled}
                                value={font_size?.replace('px', '')}
                                onChange={(e) => {
                                    const targOption = Array.from(e.target.children).find(option => option.selected);
                                    setFontSize(`${targOption.innerText}px`);
                                }}
                        >
                            {fontSizes}
                        </select>
                    </div>
                    <div>
                        <label htmlFor='font-families'>Font Family</label>
                        <select 
                            name='font-families'
                            id='sett-pg-font-family-picker'
                            data-input-name={'Font Family'}
                            disabled={p_f_2_disabled}
                            value={font_family?.replace(/,\s/, ' | ')}
                            onChange={(e) => {
                                const targOption = Array.from(e.target.children).find(option => option.selected);
                                setFontFamily(targOption.innerText.replace(/\s\|\s/, ', '));
                            }}
                        >
                            {fontFamilies}
                        </select>
                    </div>
                    <div>
                        <label htmlFor='sett-pg-accent-1-color-picker'>Accent 1</label>
                        <input
                            id='sett-pg-accent-1-color-picker'
                            data-input-name={'Accent 1'}
                            type='color'
                            disabled={p_f_2_disabled}
                            value={accent_1}
                            onChange={(e) => setAccent1(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor='sett-pg-accent-2-color-picker'>Accent 2</label>
                        <input
                            id='sett-pg-accent-2-color-picker'
                            data-input-name={'Accent 2'}
                            type='color'
                            disabled={p_f_2_disabled}
                            value={accent_2}
                            onChange={(e) => setAccent2(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor='sett-pg-accent-3-color-picker'>Accent 3</label>
                        <input
                            id='sett-pg-accent-3-color-picker'
                            data-input-name={'Accent 3'}
                            type='color'
                            disabled={p_f_2_disabled}
                            value={accent_3}
                            onChange={(e) => setAccent3(e.target.value)}
                        />
                    </div>
                    <button>{p_f_2_btn}</button>
                    <button type='button' onClick={resetHandler}>Cancel</button>
                </form>
                <div style={{
                    border: `5px solid ${smpl.a_3}`,
                    backgroundColor: smpl.b_c,
                    fontFamily: smpl.f_f,
                    fontSize: smpl.f_s
                }}>
                    <h2 style={{color: smpl.f_c}}>{`${theme_name}` || 'Theme Name'}</h2>
                    <div style={{
                        borderTop: `5px solid ${smpl.a_1}`,
                        backgroundColor: smpl.b_c
                    }}>
                        <h3 style={{color: smpl.a_2}}>Test your theme.</h3>
                        <span>See your theme specs here.</span>
                    </div>
                </div>
            </div>
            <div>
                {settings}
            </div>
        </div>
    )
}