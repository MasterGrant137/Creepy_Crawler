import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../Main.css';
import './Settings_Page.css';
import dropdownData from './dropdown_data.json';
import { editProfileMedia } from '../../store/session';
import { createUserSetting, readUserSettings, updateUserSetting, deleteUserSetting } from '../../store/settings_store';
import { useModal } from '../context/Modal_Context.js';

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
    const [profile_media, setProfileMedia] = useState(null);
    // const [backgroundMedia, setBackgroundMedia] = useState(null);
    const [profileMediaLoading, setProfileMediaLoading] = useState(false);
    // const [backgroundMediaLoading, setBackgroundMediaLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const { closeModal } = useModal();
    const dispatch = useDispatch();

    const user = useSelector(state => state.session.user);

     useEffect(() => {
        dispatch(readUserSettings())
    }, [dispatch])

    const setProfileMediaHandler = (e) => {
        const file = e.target.files[0];
        if (file) setProfileMedia(file);
    }

    // const setBackgroundMediaHandler = (e) => {
    //     const file = e.target.files[0];
    //     if(file) setBackgroundMedia(file);
    // }

    const profileMediaHandler = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('media', profile_media);
        setProfileMediaLoading(true);

        const data = await dispatch(editProfileMedia(user.id, formData));
        setProfileMediaLoading(false);

        if (data.errors) {
            setErrors(data.errors);
        } else {
            closeModal();
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
            // const formData = new FormData();
            // formData.append('media', profile_media);
            // setBackgroundMediaLoading(true);
        
            const user_id = user.id;
    
            const data = await dispatch(createUserSetting({
                user_id,
                theme_name,
                background_color,
                // background_media,
                background_rotate,
                font_color,
                font_family,
                font_size,
                accent_1,
                accent_2,
                accent_3,
                // formData
            }));
            console.log(data);
            // setBackgroundMediaLoading(false);
    
            if (data.errors) {
                setErrors(data.errors);
            } else {
                closeModal();
            }
        }
    }

    const editFormHandler = (e) => {
        e.preventDefault();

        const updateObj = {
            user_id: user.id,
            theme_name,
            background_color,
            // background_media,
            background_rotate,
            font_color,
            font_family,
            font_size,
            accent_1,
            accent_2,
            accent_3,
            // formData
        }

        const formID = e.target.dataset.formId
        const targForm = document.getElementById(`sett-pg-editor-form-${formID}`);
        const targFormKids = Array.from(targForm.children);
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
                        if (targKid.dataset.inputName === 'Theme Name') updateObj.theme_name = targKid.value
                        else if (targKid.dataset.inputName === 'Background Color') updateObj.background_color = targKid.value
                        else if (targKid.dataset.inputName === 'Background Rotate') updateObj.background_rotate = targKid.value
                        else if (targKid.dataset.inputName === 'Font Color') updateObj.font_color = targKid.value
                        else if (targKid.dataset.inputName === 'Font Family') updateObj.font_family = targKid.value
                        else if (targKid.dataset.inputName === 'Font Size') updateObj.font_size = targKid.value
                        else if (targKid.dataset.inputName === 'Accent 1') updateObj.accent_1 = targKid.value
                        else if (targKid.dataset.inputName === 'Accent 2') updateObj.accent_2 = targKid.value
                        else if (targKid.dataset.inputName === 'Accent 3') updateObj.accent_3 = targKid.value
                        
                        targKid.type === 'text' ? targKid.readOnly = true : targKid.disabled = true;
                    }
                })
            }
        })
    }

    const deleteThemeHandler = (e) => {
        const stateID = e.target.dataset.formId;
        const dbID = e.target.dataset.dbId;
        dispatch(deleteUserSetting(stateID, dbID))
    };

    const fontSizes = fontSizesRaw.map(fontSize => (
        <option
                key={fontSize}
                value={font_size}
            >
                {fontSize}
            </option>
    ))

    const fontFamilies = fontFamiliesRaw.map(fontFamily => (
        <option 
            key={fontFamily}
            value={font_family}
        >
            {fontFamily}
        </option>
    ))

    const settingsObj = useSelector(state => state.settings);

    const settings = Object.values(settingsObj).map((setting, idx) => (
        <div key={setting.id}>
            <form id={`sett-pg-editor-form-${idx}`} onSubmit={editFormHandler}>
                <label htmlFor={`sett-pg-theme-name-editor-${idx}`}>Theme Name</label>
                <input id={`sett-pg-theme-name-editor-${idx}`} type='text' readOnly={true} data-input-name={'Theme Name'} defaultValue={setting.theme_name} />

                <label htmlFor={`font-sizes-${idx}`}>Font Size</label>
                <select name={`font-sizes-${idx}`} data-input-name={'Font Size'} disabled={true} defaultValue={setting.font_size.replace('px', '')} data-checker={console.log(font_size.replace('px', ''))}>
                    {fontSizes}
                </select>

                <label htmlFor={`font-families-${idx}`}>Font Family</label>
                <select name={`font-families-${idx}`} data-input-name={'Font Family'} disabled={true} defaultValue={setting.font_family.replace(/,\s/, ' | ')} data-checker={console.log(font_family.replace(/,\s/, ' | '))}>
                   {fontFamilies}
                </select>

                <label htmlFor={`sett-pg-font-color-editor-${idx}`}>Font Color</label>
                <input id={`sett-pg-font-color-editor-${idx}`} data-input-name={'Font Color'} type='color' disabled={true} defaultValue={setting.font_color} />

                <label htmlFor={`sett-pg-bg-rotate-editor-${idx}`}>Background Rotate</label>
                <input id={`sett-pg-bg-rotate-editor-${idx}`} data-input-name={'Background Rotate'} type='checkbox' disabled={true} defaultChecked={setting.background_rotate} />

                <label htmlFor={`sett-pg-bg-color-editor-${idx}`}>Background Color</label>
                <input id={`sett-pg-bg-color-editor-${idx}`} data-input-name={'Background Color'} type='color' disabled={true} defaultValue={setting.background_color} />
                
                <label htmlFor={`sett-pg-accent-1-color-editor-${idx}`}>Accent 1</label>
                <input id={`sett-pg-accent-1-color-picker-${idx}`} data-input-name={'Accent 1'} type='color' disabled={true} defaultValue={setting.accent_1} />
                
                <label htmlFor={`sett-pg-accent-2-color-editor-${idx}`}>Accent 2</label>
                <input id={`sett-pg-accent-2-color-picker-${idx}`} data-input-name={'Accent 2'} type='color' disabled={true} defaultValue={setting.accent_2} />
                
                <label htmlFor={`sett-pg-accent-3-color-editor-${idx}`}>Accent 3</label>
                <input id={`sett-pg-accent-2-color-picker-${idx}`} data-input-name={'Accent 3'} type='color' disabled={true} defaultValue={setting.accent_3} />
                
                <button data-form-id={`${idx}`}>Edit</button>
                <button data-form-id={`${idx}`} data-db-id={`${setting.id}`} onClick={(e) => deleteThemeHandler(e)} type='button'>Delete</button>
                <button data-form-id={`${idx}`} type='button'>Use</button>
            </form>
        </div>
    ))

    return (
        <div>
            <h1>Settings</h1>
            <div>
                <h2>Update Media</h2>
                <form id='sett-pg-picker-form-1' onSubmit={profileMediaHandler}>
                    <h3>Profile</h3>
                    <label htmlFor='s-p-user-profile-media-uploader'>
                        {profile_media === '' ? 'Upload Media' : 'Added'}
                    </label>
                    <input
                        id='s-p-user-profile-media-uploader'
                        type='file'
                        onChange={setProfileMediaHandler}
                    />
                    {profileMediaLoading && (<span>Loading...</span>)}
                    <button data-form-id='1' type='button'>Submit</button>
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
                    {/* <div>
                        <label
                            htmlFor='s-p-user-profile-media-uploader'
                        >
                            {profile_media === '' ? 'Upload Media' : 'Added'}
                        </label>
                        <input
                            id='s-p-user-profile-media-uploader'
                            type='file'
                            onChange={setBackgroundMediaHandler}
                        />
                        {backgroundMediaLoading && (<span>Loading...</span>)}
                    </div> */}
                    <div>
                        <label htmlFor='sett-pg-bg-rotate-picker'>Background Rotate</label>
                        <input
                            id='sett-pg-bg-rotate-picker'
                            data-input-name={'Background Rotate'}
                            type='checkbox'
                            disabled={p_f_2_disabled}
                            value={background_rotate}
                            onChange={(e) => setBackgroundRotate(e.target.checked)}
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
                            onChange={(e) => {
                                const targOption = Array.from(e.target.children).find(option => option.selected);
                                setFontFamily(targOption.innerText.replace(' | ', ', '));
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
                    <button data-form-id='2'>{p_f_2_btn}</button>
                </form>
            </div>
            <div>
                {settings}
            </div>
        </div>
    )
}