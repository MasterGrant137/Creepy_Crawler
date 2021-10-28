import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../Main.css';
import './Settings_Page.css';
import dropdownData from './dropdown_data.json';
import { editUserMedia } from '../../store/session';
import { createUserSetting, readUserSettings } from '../../store/settings_store';
import { useModal } from '../context/Modal_Context.js';

export const SettingsPage = ({ style }) => {
    const fontSizesRaw = dropdownData['font-sizes'];
    const fontFamiliesRaw = dropdownData['fonts'];
    const [disabled, setDisabled] = useState(true)
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

    const userMediaHandler = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('media', profile_media);
        setProfileMediaLoading(true);

        const data = await dispatch(editUserMedia(user.id, formData));
        setProfileMediaLoading(false);
        if (data.errors) {
            setErrors(data.errors);
        } else {
            closeModal();
        }
    }

    const createSettingHandler = async (e) => {
        e.preventDefault();

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
        // setBackgroundMediaLoading(false);
        if (data.errors) {
            setErrors(data.errors);
        } else {
            closeModal();
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
        const targForm = document.getElementById(`sett-pg-edit-form-${formID}`);
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
                        targKid.type === 'text' ? targKid.readOnly = true : targKid.disabled = true;
                        console.log(user.id);
                        updateObj.user_id = user.id
                        if (targKid.dataset.inputName === 'Theme Name') updateObj.theme_name = targKid.value
                        if (targKid.dataset.inputName === 'Background Color') updateObj.background_color = targKid.value
                        if (targKid.dataset.inputName === 'Background Rotate') updateObj.background_rotate = targKid.value
                        if (targKid.dataset.inputName === 'Font Color') updateObj.font_color = targKid.value
                        if (targKid.dataset.inputName === 'Font Family') updateObj.font_family = targKid.value
                        if (targKid.dataset.inputName === 'Font Size') updateObj.font_size = targKid.value
                        if (targKid.dataset.inputName === 'Accent 1') updateObj.accent_1 = targKid.value
                        if (targKid.dataset.inputName === 'Accent 2') updateObj.accent_2 = targKid.value
                        if (targKid.dataset.inputName === 'Accent 3') updateObj.accent_3 = targKid.value

                        
                    
    
                       
                    }
                })
            }
        })
    }

    const fontSizes = fontSizesRaw.map(fontSize => (
            <option
                key={fontSize}
                value={fontSize}
                onChange={(e) => setFontSize(e.target.innerText + 'px')}
            >
                {fontSize}
            </option>
    ))

    const fontFamilies = fontFamiliesRaw.map(fontFamily => (
        <option 
            key={fontFamily}
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.innerText.replace(' | ', ', '))}
        >
            {fontFamily}
        </option>
    ))

    const settingsObj = useSelector(state => state.settings);

    const settings = Object.values(settingsObj).map((setting, idx) => (
        <div key={setting.id}>
            <form id={`sett-pg-edit-form-${idx}`} onSubmit={editFormHandler}>
                <input type='text' readOnly={true} data-input-name={'Theme Name'} defaultValue={setting.theme_name} />

                <label htmlFor={`font-sizes-${idx}`}>Font Size</label>
                <select name={`font-sizes-${idx}`} data-input-name={'Font Size'} disabled={true} defaultValue={setting.font_size.replace('px', '')}>
                    {fontSizes}
                </select>

                <label htmlFor={`font-families-${idx}`}>Font Family</label>
                <select name={`font-families-${idx}`} data-input-name={'Font Family'} disabled={true} defaultValue={setting.font_family.replace(/,\s/, ' | ')}>
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
                
                <button data-form-id={`${idx}`} type='button' onClick={editFormHandler}>Edit</button>
            </form>
            <button type='submit'>Use</button>
        </div>
    ))

    return (
        <div>
            <h1>Settings</h1>
            <div>
                <h2>Update Media</h2>
                <form onSubmit={userMediaHandler}>
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
                    <button>Submit</button>
                </form>
                <div>
                    {errors.map(error => (
                        <div key={error}>{error}</div>
                    ))}
                </div>
            </div>
            <div>
                <h2>Create Theme</h2>
                <form onSubmit={createSettingHandler}>
                    <div>
                        <label htmlFor='sett-page-create-theme-name'>Theme Name</label>
                        <input
                            id='sett-page-create-theme-name'
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
                            disabled={true}
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
                            disabled={true}
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
                            disabled={true}
                            value={font_color}
                            onChange={(e) => setFontColor(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Font Size</label>
                        <select name='font-sizes' id='sett-pg-font-size-picker' data-input-name={'Font Size'} disabled={true}>
                            {fontSizes}
                        </select>
                    </div>
                    <div>
                        <label>Font Family</label>
                        <select name='font-families' id='sett-pg-font-family-picker' data-input-name={'Font Family'} disabled={true}>
                            {fontFamilies}
                        </select>
                    </div>
                    <div>
                        <label htmlFor='sett-pg-accent-1-color-picker'>Accent 1</label>
                        <input
                            id='sett-pg-accent-1-color-picker'
                            data-input-name={'Accent 1'}
                            type='color'
                            disabled={true}
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
                            disabled={true}
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
                            disabled={true}
                            value={accent_3}
                            onChange={(e) => setAccent3(e.target.value)}
                        />
                    </div>
                    <button>Submit</button>
                </form>
            </div>
            <div>
                {settings}
            </div>
        </div>
    )
}