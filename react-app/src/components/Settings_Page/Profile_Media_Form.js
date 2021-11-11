import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editProfileMedia } from '../../store/session';

const ProfileMediaForm = ({ style }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.session.user);

    const [profileMedia, setProfileMedia] = useState('');
    const [profileMediaLoading, setProfileMediaLoading] = useState(false);

    const setProfileMediaHandler = (e) => {
        const file = e.target.files[0];
        if (file) setProfileMedia(file);
    };

    const profileMediaHandler = async (e) => {
        e.preventDefault();

        const targForm = e.target;
        const targFormKids = Array.from(targForm.children);
        const isSubmit = targFormKids.find((targKid) => targKid.tagName === 'BUTTON' && targKid.innerText === 'Submit');
        const hasMedia = targFormKids.find((targKid) => targKid.dataset.inputName === 'Profile Media');

        if (isSubmit && hasMedia?.value) {
            const formData = new FormData();
            formData.append('media', profileMedia);
            setProfileMediaLoading(true);

            await dispatch(editProfileMedia(user.id, formData));
            setProfileMediaLoading(false);
        }
    };

    return (
        <>
            <form
                className='setter-form-1'
                onSubmit={profileMediaHandler}
            >
                <label
                    htmlFor='user-profile-media-uploader'
                    style={{ borderBottom: `2px solid ${style.accent_1}` }}
                >
                    {!profileMedia ? 'Upload Profile Media' : 'Added'}
                </label>
                <input
                    id='user-profile-media-uploader'
                    name='Background Media'
                    type='file'
                    onChange={setProfileMediaHandler}
                />
                {profileMediaLoading && (<span>Loading...</span>)}
                <button style={{ color: style.font_color }}>Submit</button>
            </form>
        </>
    );
};

export default ProfileMediaForm;
