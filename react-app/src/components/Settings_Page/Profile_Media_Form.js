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

        const formData = new FormData();
        formData.append('profileMedia', profileMedia);

        setProfileMediaLoading(true);
        await dispatch(editProfileMedia(user.id, formData));
        document.getElementById('user-profile-media').value = '';
        setProfileMediaLoading(false);
    };

    return (
        <>
            <form
                className='setter-form-1'
                onSubmit={profileMediaHandler}
            >
                <label
                    htmlFor='user-profile-media'
                    style={{ borderColor: style.accent_1 }}
                >
                    {!profileMedia ? 'Upload Profile Media' : 'Added'}
                </label>
                <input
                    id='user-profile-media'
                    name='Profile Media'
                    type='file'
                    accept='image/png, image/jpg, image/jpeg, image/gif'
                    required
                    onChange={setProfileMediaHandler}
                />
                {profileMediaLoading && (<span>Loading...</span>)}
                <button style={{ color: style.font_color }}>Submit</button>
            </form>
        </>
    );
};

export default ProfileMediaForm;
