import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../context/Modal_Context';
import { editProfile } from '../../store/session';
import { readUserSettings } from '../../store/settings_store';
import '../Main.css';
import '../Modal.css';

const ProfileModal = ({ style }) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    useEffect(() => {
        dispatch(readUserSettings());
    }, [dispatch]);

    const resetTheme = async (eType) => {
        await dispatch(editProfile({
            column: eType,
        }));
        closeModal();
    };

    return (
        <div>
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
