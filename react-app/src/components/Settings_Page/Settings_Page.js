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
    const [readOnly, setReadOnly] = useState(true)
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

    const fontSizes = fontSizesRaw.map(fontSize => (
            <option
                key={fontSize}
                value={fontSize}
                readOnly={readOnly}
                onChange={(e) => setFontSize(e.target.innerText)}
            >
                {fontSize}
            </option>
    ))

    const fontFamilies = fontFamiliesRaw.map(fontFamily => (
        <option 
            key={fontFamily}
            value={fontFamily}
            readOnly={readOnly}
            onChange={(e) => setFontFamily(e.target.innerText.replace(' | ', ', '))}
        >
            {fontFamily}
        </option>
    ))

    const settingsObj = useSelector(state => state.settings);

    const settings = Object.values(settingsObj).map((setting, idx) => (
        <div key={setting.id}>
            <form>
                <input type='text' readOnly={readOnly} value={setting.theme_name} />

                <label htmlFor={`font-sizes-${idx}`}>Font Size</label>
                <select name={`font-sizes-${idx}`} value={setting.font_size.replace('px', '')}>
                    {fontSizes}
                </select>

                <label htmlFor={`font-families-${idx}`}>Font Family</label>
                <select name={`font-families-${idx}`} value={setting.font_family.replace(/,\s/, ' | ')}>
                   {fontFamilies}
                </select>

                <input type='color'  disabled={readOnly} value={setting.font_color} />
                <input type='checkbox' disabled={readOnly} checked={setting.background_rotate} />
                <input type='color'  disabled={readOnly} value={setting.background_color} />
                <input type='color'  disabled={readOnly} value={setting.accent_1} />
                <input type='color'  disabled={readOnly} value={setting.accent_2} />
                <input type='color'  disabled={readOnly} value={setting.accent_3} />
                <button>Edit</button>
                <button>Use</button>
            </form>
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
                            type='text'
                            readOnly={readOnly}
                            placeholder='Theme Name'
                            value={theme_name}
                            onChange={(e) => setThemeName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor='sett-pg-bg-color-picker'>Background Color</label>
                        <input
                            id='sett-pg-bg-color-picker'
                            type='color'
                            readOnly={readOnly}
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
                            type='checkbox'
                            readOnly={readOnly}
                            value={background_rotate}
                            onChange={(e) => setBackgroundRotate(e.target.checked)}
                        />
                    </div>
                    <div>
                        <label htmlFor='sett-pg-font-color-picker'>Font Color</label>
                        <input
                            id='sett-pg-font-color-picker'
                            type='color'
                            readOnly={readOnly}
                            value={font_color}
                            onChange={(e) => setFontColor(e.target.value)}
                        />
                    </div>
                    <div
                        id='sett-pg-font-size-picker'
                        className='dropdown-1-container'
                    >
                        <label>Font Size</label>
                        <select name='font-sizes' id='sett-pg-font-sizes' readOnly={readOnly}>
                            {fontSizes}
                        </select>
                    </div>
                    <div 
                        id='sett-pg-font-family-picker'
                        className='dropdown-1-container'
                    >
                        <label>Font Family</label>
                        <select name='font-families' id='sett-pg-font-sizes' readOnly={readOnly}>
                            {fontFamilies}
                        </select>
                    </div>
                    <div>
                        <label htmlFor='sett-pg-accent-1-color-picker'>Accent 1</label>
                        <input
                            id='sett-pg-accent-1-color-picker'
                            type='color'
                            disabled={readOnly}
                            value={accent_1}
                            onChange={(e) => setAccent1(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor='sett-pg-accent-2-color-picker'>Accent 2</label>
                        <input
                            id='sett-pg-accent-2-color-picker'
                            type='color'
                            readOnly={readOnly}
                            disabled={accent_2}
                            value={accent_2}
                            onChange={(e) => setAccent2(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor='sett-pg-accent-3-color-picker'>Accent 3</label>
                        <input
                            id='sett-pg-accent-3-color-picker'
                            type='color'
                            readOnly={readOnly}
                            disabled={accent_3}
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