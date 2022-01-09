import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../context/Modal_Context';
import { editProfile } from '../../store/session';
import { readUserSettings } from '../../store/settings_store';
import defaultThemes from '../../default_themes.json';
import '../Main.css';
import '../Modal.css';

const ProfileModal = ({ style }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.session.user);
    const { closeModal } = useModal();

    useEffect(() => {
        dispatch(readUserSettings());
    }, [dispatch]);

    const defaultTheme = async (eType, themeName) => {
        await dispatch(editProfile({
            column: eType,
            default_theme: themeName,
        }));
        closeModal();
    };

    const defaultThemeKeys = Object.keys(defaultThemes);
    const defaultThemeOptions = defaultThemeKeys.map((themeName) => (
        <option key={themeName}>{themeName}</option>
    ));

    return (
        <div className='profile-dropdown' style= {{ backgroundColor: style.accent_1 }}>
            <label htmlFor='default-theme-editor' style= {{ color: style.accent_2 }}>Default Themes</label>
            <select
                id='default-theme-editor'
                className='default-themes-dropdown'
                name='Default Theme'
                value={user?.default_theme || defaultThemeKeys[0]}
                onChange={(e) => {
                    const trgKids = e.target.children;
                    const targOpt = Array.from(trgKids).find((opt) => opt.selected);
                    defaultTheme('default_theme', targOpt.text);
                }}
                style={{
                    backgroundColor: style.background_color,
                    color: style.font_color,
                    fontFamily: style.font_family,
                    fontSize: style.font_size,
                }}
            >{defaultThemeOptions}</select>
        </div>
    );
};

export default ProfileModal;
