import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../Main.css';
import './Settings_Page.css';
import dropdownData from './dropdown_data.json';
import { editUserMedia } from '../../store/session';
import { useModal } from '../context/Modal_Context.js';

export const SettingsPage = ({ style }) => {
    const [fSDropdown, setFSDropdown] = useState('invisible');
    const [fDropdown, setFDropdown] = useState('invisible');
    const [media, setMedia] = useState(null);
    const [mediaLoading, setMediaLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const { closeModal } = useModal();
    const fontSizes = dropdownData['font-sizes'];
    const fonts = dropdownData['fonts'];
    const dispatch = useDispatch();

    const user = useSelector(state => state.session.user);

    const updateMedia = (e) => {
        const file = e.target.files[0];
        if (file) setMedia(file);
    }

    const userMediaHandler = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('media', media);
        // console.log(media);
        setMediaLoading(true);

        const data = await dispatch(editUserMedia(user.id, formData));
        setMediaLoading(false);
        if (data) {
            setErrors(data);
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
        <div key={fontSize} className={fSDropdown}>{fontSize}</div>
    ))

    const fontChoices = fonts.map(font => (
        <div key={font} className={fDropdown}>{font}</div>
    ))

    return (
        <div>
            <h1>Settings</h1>
            <div>
                <h2>Change Media</h2>
                <form onSubmit={userMediaHandler}>
                    <h3>Profile</h3>
                    <label
                        htmlFor='s-p-user-media-uploader'
                    >
                        {media === '' ? 'Upload Media' : 'Added'}
                    </label>
                    <input
                        id='s-p-user-media-uploader'
                        type='file'
                        onChange={updateMedia}
                    />
                    {mediaLoading && (<span>Loading...</span>)}
                    <button>Submit</button>
                </form>
                {/* <form onSubmit={userMediaHandler}>
                    <h3>Site Background</h3>
                    <label
                        htmlFor='s-p-user-media-uploader'
                    >
                        {media === '' ? 'Upload Media' : 'Added'}
                    </label>
                    <input
                        id='s-p-user-media-uploader'
                        type='file'
                        onChange={updateMedia}
                    />
                    {mediaLoading && (<span>Loading...</span>)}
                    <button>Submit</button>
                </form> */}
                <div>
                    {errors.map(error => (
                        <div key={error}>{error}</div>
                    ))}
                </div>
            </div>
            <div>
                <h2>Customize Theme</h2>
                <form>
                    <div>
                        <label htmlFor='sett-pg-bg-color-picker'>Background Color</label>
                        <input
                            id='sett-pg-bg-color-picker'
                            type='color'
                        />
                    </div>
                    <div>
                        <label htmlFor='sett-pg-font-color-picker'>Font Color</label>
                        <input
                            id='sett-pg-font-color-picker'
                            type='color'
                        />
                    </div>
                    <div 
                        className='dropdown-1-container'
                        onMouseOver={() => dropdownHandler('onMouseOver', 'FS')}
                        onMouseOut={() => dropdownHandler('onMouseOut', 'FS')}
                    >
                        <span>Font Size</span>
                        {fontSizeChoices}
                    </div>
                    <div 
                        className='dropdown-1-container'
                        onMouseOver={() => dropdownHandler('onMouseOver', 'S')}
                        onMouseOut={() => dropdownHandler('onMouseOut', 'S')}
                    >
                        <span>Font</span>
                        {fontChoices}
                    </div>
                    <div>
                        <label htmlFor='sett-pg-accent-1-color-picker'>Accent 1</label>
                        <input
                            id='sett-pg-accent-1-color-picker'
                            type='color'
                        />
                    </div>
                    <div>
                        <label htmlFor='sett-pg-accent-2-color-picker'>Accent 2</label>
                        <input
                            id='sett-pg-accent-2-color-picker'
                            type='color'
                        />
                    </div>
                    <div>
                        <label htmlFor='sett-pg-accent-3-color-picker'>Accent 3</label>
                        <input
                            id='sett-pg-accent-3-color-picker'
                            type='color'
                        />
                    </div>
                    <button type='button'>Submit</button>
                </form>
            </div>
        </div>
    )
}