import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editProfileMedia } from '../../store/session';

export const SetterForm1 = ({ style }) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user);

    const [profile_media, setProfileMedia] = useState('');
    const [profile_media_loading, setProfileMediaLoading] = useState(false);

    const setProfileMediaHandler = (e) => {
        const file = e.target.files[0];
        if (file) setProfileMedia(file);
    }

    const profileMediaHandler = async (e) => {
        e.preventDefault();

        const targForm = e.target;
        const targFormKids = Array.from(targForm.children);
        const isSubmit = targFormKids.find(targKid => targKid.tagName === 'BUTTON' && targKid.innerText === 'Submit');
        const hasMedia = targFormKids.find(targKid => targKid.dataset.inputName === 'Profile Media');

        if (isSubmit && hasMedia?.value) { 
            const formData = new FormData();
            formData.append('media', profile_media);
            setProfileMediaLoading(true);

            await dispatch(editProfileMedia(user.id, formData));
            setProfileMediaLoading(false);
        }
    }

    return (
        <>
            <form 
                id='sett-pg-setter-form-1'
                data-setting-id={1}
                className='settings-form setter-form-1'
                onSubmit={profileMediaHandler}
            >
                <label htmlFor='sett-pg-user-profile-media-uploader'>
                    <span 
                        style={{ 
                            color: style.accent_2,
                            borderBottom: `2px solid ${style.accent_1}`
                        }}
                    >
                        {!profile_media ? 'Upload Profile Media' : 'Added'}
                    </span>
                </label>
                <input
                    id='sett-pg-user-profile-media-uploader'
                    data-input-name='Profile Media'
                    type='file'
                    onChange={setProfileMediaHandler}
                />
                {profile_media_loading && (<span>Loading...</span>)}
                <button style={{ color: style.font_color }}>Submit</button>
            </form>
        </>
    )
}