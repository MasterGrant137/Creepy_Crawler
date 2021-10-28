import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../Main.css';
import './Settings_Page.css';
import dropdownData from './dropdown_data.json';
import { editUserMedia } from '../../store/session';
import { createUserSetting } from '../../store/settings_store';
import { useModal } from '../context/Modal_Context.js';

export const SettingsPage = ({ style }) => {
    const fontSizes = dropdownData['font-sizes'];
    const fonts = dropdownData['fonts'];
    const [fSDropdown, setFSDropdown] = useState('invisible');
    const [fDropdown, setFDropdown] = useState('invisible');
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

    const fontSizeHandler = (e) => setFontSize(e.target.innerText);

    const fontFamilyHandler = (e) => setFontFamily(e.target.innerText.replace(' | ', ', '));

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

    const dropdownHandler = (eType, eTarg, e) => {
        if (eType === 'onMouseOver') {
           eTarg === 'FS' ? setFSDropdown('dropdown-1') : setFDropdown('dropdown-1');
        }
        else {
            eTarg === 'FS' ? setFSDropdown('invisible') : setFDropdown('invisible');
        };
    }

    const fontSizeChoices = fontSizes.map(fontSize => (
        <div
            key={fontSize}
            className={fSDropdown}
            onClick={fontSizeHandler}
        >
            {fontSize}
        </div>
    ))

    const fontChoices = fonts.map(font => (
        <div 
            key={font}
            className={fDropdown}
            onClick={fontFamilyHandler}
        >
            {font}
        </div>
    ))

    return (
        <div>
            <h1>Settings</h1>
            <div>
                <h2>Update Media</h2>
                <form onSubmit={userMediaHandler}>
                    <h3>Profile</h3>
                    <label
                        htmlFor='s-p-user-profile-media-uploader'
                    >
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
                            value={background_rotate}
                            onChange={(e) => setBackgroundRotate(e.target.checked)}
                        />
                    </div>
                    <div>
                        <label htmlFor='sett-pg-font-color-picker'>Font Color</label>
                        <input
                            id='sett-pg-font-color-picker'
                            type='color'
                            value={font_color}
                            onChange={(e) => setFontColor(e.target.value)}
                        />
                    </div>
                    <div 
                        className='dropdown-1-container'
                        onMouseOver={() => dropdownHandler('onMouseOver', 'FS')}
                        onMouseOut={() => dropdownHandler('onMouseOut', 'FS')}
                    >
                        <span>Font Size</span>
                        {fontSizeChoices}
                        <span>{font_size}</span>
                    </div>
                    <div 
                        className='dropdown-1-container'
                        onMouseOver={() => dropdownHandler('onMouseOver', 'S')}
                        onMouseOut={() => dropdownHandler('onMouseOut', 'S')}
                    >
                        <span>Font Family</span>
                        {fontChoices}
                        <span>{font_family}</span>
                    </div>
                    <div>
                        <label htmlFor='sett-pg-accent-1-color-picker'>Accent 1</label>
                        <input
                            id='sett-pg-accent-1-color-picker'
                            type='color'
                            value={accent_1}
                            onChange={(e) => setAccent1(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor='sett-pg-accent-2-color-picker'>Accent 2</label>
                        <input
                            id='sett-pg-accent-2-color-picker'
                            type='color'
                            value={accent_2}
                            onChange={(e) => setAccent2(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor='sett-pg-accent-3-color-picker'>Accent 3</label>
                        <input
                            id='sett-pg-accent-3-color-picker'
                            type='color'
                            value={accent_3}
                            onChange={(e) => setAccent3(e.target.value)}
                        />
                    </div>
                    <button>Submit</button>
                </form>
            </div>
        </div>
    )
}