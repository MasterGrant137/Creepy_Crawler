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
    const [themeName, setThemeName] = useState('');
    const [font, setFont] = useState(style.font_family);
    const [fontSize, setFontSize] = useState(style.font_size);
    const [backgroundColor, setBackgroundColor] = useState(style.background_color);
    const [backgroundRotate, setBackgroundRotate] = useState(style.backgroundRotate);
    const [fontColor, setFontColor] = useState(style.font_color);
    const [accent1, setAccent1] = useState(style.accent_1);
    const [accent2, setAccent2] = useState(style.accent_2);
    const [accent3, setAccent3] = useState(style.accent_3);
    const [profileMedia, setProfileMedia] = useState(null);
    const [backgroundMedia, setBackgroundMedia] = useState(null);
    const [profileMediaLoading, setProfileMediaLoading] = useState(false);
    const [backgroundMediaLoading, setBackgroundMediaLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const { closeModal } = useModal();
    const dispatch = useDispatch();

    const user = useSelector(state => state.session.user);

    const updateProfileMedia = (e) => {
        const file = e.target.files[0];
        if (file) setProfileMedia(file);
    }

    const userMediaHandler = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('media', profileMedia);
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

    const fontHandler = (e) => setFont(e.target.innerText.replace(' | ', ', '));

    const createSettingHandler = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('profile-media', profileMedia);
        setBackgroundMediaLoading(true);
    
        const userID = user.id;

        const data = await dispatch(createUserSetting({
            userID,
            themeName,
            backgroundColor,
            backgroundMedia,
            backgroundRotate,
            formData
        }));
        setBackgroundMediaLoading(false);
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
            onClick={fontHandler}
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
                        {profileMedia === '' ? 'Upload Media' : 'Added'}
                    </label>
                    <input
                        id='s-p-user-profile-media-uploader'
                        type='file'
                        onChange={updateProfileMedia}
                    />
                    {profileMediaLoading && (<span>Loading...</span>)}
                    <button>Submit</button>
                </form>
                <form onSubmit={createSettingHandler}>
                    <h3>Site Background</h3>
                    <label
                        htmlFor='s-p-user-profile-media-uploader'
                    >
                        {profileMedia === '' ? 'Upload Media' : 'Added'}
                    </label>
                    <input
                        id='s-p-user-profile-media-uploader'
                        type='file'
                        onChange={updateProfileMedia}
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
                <form>
                    <div>
                        <label htmlFor='sett-page-create-theme-name'>Theme Name</label>
                        <input
                            id='sett-page-create-theme-name'
                            type='text'
                            placeholder='Theme Name'
                            value={themeName}
                            onChange={setThemeName}
                        />
                    </div>
                    <div>
                        <label htmlFor='sett-pg-bg-color-picker'>Background Color</label>
                        <input
                            id='sett-pg-bg-color-picker'
                            type='color'
                            value={backgroundColor}
                            onChange={setBackgroundColor}
                        />
                    </div>
                    <div>
                        <label htmlFor='sett-pg-bg-rotate-picker'>Background Rotate</label>
                        <input
                            id='sett-pg-bg-rotate-picker'
                            type='checkbox' 
                            value={backgroundRotate}
                            onChange={(e) => setBackgroundRotate(e.target.checked)}
                        />
                    </div>
                    <div>
                        <label htmlFor='sett-pg-font-color-picker'>Font Color</label>
                        <input
                            id='sett-pg-font-color-picker'
                            type='color'
                            value={fontColor}
                            onChange={setFontColor}
                        />
                    </div>
                    <div 
                        className='dropdown-1-container'
                        onMouseOver={() => dropdownHandler('onMouseOver', 'FS')}
                        onMouseOut={() => dropdownHandler('onMouseOut', 'FS')}
                    >
                        <span>Font Size</span>
                        {fontSizeChoices}
                        <span>{fontSize}</span>
                    </div>
                    <div 
                        className='dropdown-1-container'
                        onMouseOver={() => dropdownHandler('onMouseOver', 'S')}
                        onMouseOut={() => dropdownHandler('onMouseOut', 'S')}
                    >
                        <span>Font</span>
                        {fontChoices}
                        <span>{font}</span>
                    </div>
                    <div>
                        <label htmlFor='sett-pg-accent-1-color-picker'>Accent 1</label>
                        <input
                            id='sett-pg-accent-1-color-picker'
                            type='color'
                            value={accent1}
                            onChange={setAccent1}
                        />
                    </div>
                    <div>
                        <label htmlFor='sett-pg-accent-2-color-picker'>Accent 2</label>
                        <input
                            id='sett-pg-accent-2-color-picker'
                            type='color'
                            value={accent2}
                            onChange={setAccent2}
                        />
                    </div>
                    <div>
                        <label htmlFor='sett-pg-accent-3-color-picker'>Accent 3</label>
                        <input
                            id='sett-pg-accent-3-color-picker'
                            type='color'
                            value={accent3}
                            onChange={setAccent3}
                        />
                    </div>
                    <button type='button'>Submit</button>
                </form>
            </div>
        </div>
    )
}