import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../context/Modal_Context';
import { editProfile } from '../../store/session';
import { readUserSettings } from '../../store/settings_store';
import defaultThemes from '../../default_themes.json';
import '../Main.css';
import '../Modal.css';

const ProfileModal = ({ style }) => {
    const dispatch = useDispatch();
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

    const resetTheme = async (eType) => {
        await dispatch(editProfile({
            column: eType,
        }));
        closeModal();
    };

    const defaultThemeKeys = Object.keys(defaultThemes);
    const defaultThemeOptions = defaultThemeKeys.map((themeName) => (
        <option key={themeName}>{themeName}</option>
    ));

    return (
        <div>
            <label htmlFor='default-theme-editor'>Default Themes</label>
            <select
                id='default-theme-editor'
                name='Default Theme'
                value={style.defaultTheme}
                onChange={(e) => {
                    const trgKids = e.target.children;
                    const targOpt = Array.from(trgKids).find((opt) => opt.selected);
                    defaultTheme('default_theme', targOpt.text);
                }}
                style={{
                    color: style.font_color,
                    fontFamily: style.font_family,
                    fontSize: style.font_size,
                }}
            >{defaultThemeOptions}</select>
            <button
                type='button'
                onClick={() => resetTheme('reset_theme')}
                style={{
                    color: style.font_color,
                    fontFamily: style.font_family,
                    fontSize: style.font_size,
                }}
            >
                Set Theme to Default
            </button>
        </div>
    );
};

export default ProfileModal;
