import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { editProfile } from '../../store/session';
import { createUserSetting } from '../../store/settings_store';
import dropdownData from './dropdown_data.json';

const CreateThemeForm = ({ style }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.session.user);
    const fileInput = useRef(null);
    const submitBtn = user.theme_count < 10;

    const fontFamiliesRaw = dropdownData.fonts;
    const fontFamilies = fontFamiliesRaw.map((fontFamily) => (
        <option key={fontFamily} >
            {fontFamily}
        </option>
    ));

    const fontSizesRaw = dropdownData['font-sizes'];
    const fontSizes = fontSizesRaw.map((fontSize) => (
        <option key={fontSize} >
            {fontSize}
        </option>
    ));

    const [accent1, setAccent1] = useState(style.accent_1);
    const [accent2, setAccent2] = useState(style.accent_2);
    const [accent3, setAccent3] = useState(style.accent_3);
    const [backgroundColor, setBackgroundColor] = useState(style.background_color);
    const [backgroundMediaLoading, setBackgroundMediaLoading] = useState(false);
    const [backgroundMedia, setBackgroundMedia] = useState(style.background_media);
    const [backgroundRotate, setBackgroundRotate] = useState(style.background_rotate);
    const [fontFamily, setFontFamily] = useState(style.font_family);
    const [fontSize, setFontSize] = useState(style.font_size);
    const [fontColor, setFontColor] = useState(style.font_color);
    const [themeLimitErr, setThemeLimitErr] = useState(false);
    const [themeName, setThemeName] = useState('');

    const resetHandler = (e) => {
        e.preventDefault();

        setThemeName('');
        setBackgroundColor(style.background_color);
        setBackgroundMedia('');
        document.getElementById('sf2-background-media').value = '';
        setBackgroundRotate(style.background_rotate);
        setFontColor(style.font_color);
        setFontFamily(style.font_family);
        setFontSize(style.font_size);
        setAccent1(style.accent_1);
        setAccent2(style.accent_2);
        setAccent3(style.accent_3);
    };

    const setBackgroundMediaHandler = (e) => {
        const file = e.target.files[0];
        if (file) setBackgroundMedia(file);
    };

    const incrementThemeCount = (eType, operation) => {
        dispatch(editProfile({
            column: eType,
            operation,
        }));
    };

    const createSettingHandler = async (e) => {
        e.preventDefault();

        if (user.theme_count < 10) {
            const userID = user.id;
            const formData = new FormData();

            formData.append('userID', userID);
            formData.append('themeName', themeName);
            formData.append('backgroundMedia', backgroundMedia);
            setBackgroundMediaLoading(true);
            formData.append('backgroundColor', backgroundColor);
            formData.append('backgroundRotate', backgroundRotate);
            formData.append('fontColor', fontColor);
            formData.append('fontFamily', fontFamily);
            formData.append('fontSize', fontSize);
            formData.append('accent1', accent1);
            formData.append('accent2', accent2);
            formData.append('accent3', accent3);

            await dispatch(createUserSetting(formData));
            setBackgroundMediaLoading(false);

            resetHandler(e);
            incrementThemeCount('theme_count', 'increment');
        } else {
            alert('You are not permitted to add any more themes!');
        }
    };

    return (
        <>
            <form className='setter-form-2' onSubmit={createSettingHandler} style={{ borderColor: style.accent_3 }}>
                <h2 className='create-theme-header' style={{ color: style.accent_2, borderColor: style.accent_1 }}>Create Theme</h2>
                <button
                    className={`sf2-submit-btn ${submitBtn ? '' : 'not-allowed'}`}
                    type={user.theme_count < 10 ? 'submit' : 'button'}
                    onMouseOut={() => { setThemeLimitErr(false); }}
                    style={{
                        color: style.font_color,
                        fontFamily: style.font_family,
                        fontSize: style.font_size,
                    }}
                >
                    <FontAwesomeIcon
                        alt='add theme'
                        title='add theme'
                        icon='plus-square'
                        onClick={() => { if (user.theme_count >= 10) setThemeLimitErr(true); }}
                    />
                </button>
                <span className={`${themeLimitErr ? 'inline-error' : 'invisible'}`}>Theme limit reached.</span>
                <button
                    type='button'
                    className='sf2-reset-btn'
                    onClick={resetHandler}
                    style={{
                        color: style.font_color,
                        fontFamily: style.font_family,
                        fontSize: style.font_size,
                    }}
                >
                    Refresh
                </button>
                <div className='sf2-row-a'>
                    <div className='theme-name-setter-div'>
                        <label htmlFor='theme-name-setter'>Theme Name</label>
                        <input
                            id='theme-name-setter'
                            name='Theme Name'
                            type='text'
                            maxLength='50'
                            placeholder='50 Characters Max'
                            aria-placeholder='50 Characters Max'
                            value={themeName}
                            onChange={(e) => setThemeName(e.target.value)}
                            onClick={() => { if (user.theme_count >= 10) setThemeLimitErr(true); }}
                            onMouseOut={() => { setThemeLimitErr(false); }}
                            style={{ fontFamily: style.font_family }}
                        />
                    </div>
                    <div className='font-size-setter-div'>
                        <label htmlFor='font-size-setter'>Font Size</label>
                        <select
                            id='font-size-setter'
                            name='Font Size'
                            value={fontSize?.replace('px', '')}
                            onChange={(e) => {
                                const targKids = e.target.children;
                                const targOption = Array.from(targKids).find((opt) => opt.selected);
                                setFontSize(`${targOption.innerText}px`);
                            }}
                            onClick={() => { if (user.theme_count >= 10) setThemeLimitErr(true); }}
                            onMouseOut={() => { setThemeLimitErr(false); }}
                        >
                            {fontSizes}
                        </select>
                    </div>
                    <div className='font-family-setter-div'>
                        <label htmlFor='font-family-setter'>Font Family</label>
                        <select
                            id='font-family-setter'
                            name='Font Family'
                            value={fontFamily?.replace(/,\s/, ' | ')}
                            onChange={(e) => {
                                const targKids = e.target.children;
                                const targOption = Array.from(targKids).find((opt) => opt.selected);
                                setFontFamily(targOption.innerText.replace(/\s\|\s/, ', '));
                            }}
                            onClick={() => { if (user.theme_count >= 10) setThemeLimitErr(true); }}
                            onMouseOut={() => { setThemeLimitErr(false); }}
                        >
                            {fontFamilies}
                        </select>
                    </div>
                </div>
                <div className='sf2-row-b'>
                    <div className='font-color-setter-div'>
                        <label htmlFor='sf2-font-color'>Font Color</label>
                        <input
                            id='sf2-font-color'
                            name='Font Color'
                            type='color'
                            value={fontColor}
                            onChange={(e) => setFontColor(e.target.value)}
                            onClick={() => { if (user.theme_count >= 10) setThemeLimitErr(true); }}
                            onMouseOut={() => { setThemeLimitErr(false); }}
                        />
                    </div>
                    <div className='accent-1-setter-div'>
                        <label htmlFor='sf2-accent-1-color'>Accent 1</label>
                        <input
                            id='sf2-accent-1-color'
                            name='Accent 1'
                            type='color'
                            value={accent1}
                            onChange={(e) => setAccent1(e.target.value)}
                            onClick={() => { if (user.theme_count >= 10) setThemeLimitErr(true); }}
                            onMouseOut={() => { setThemeLimitErr(false); }}
                        />
                    </div>
                    <div className='accent-2-setter-div'>
                        <label htmlFor='sf2-accent-2-color'>Accent 2</label>
                        <input
                            id='sf2-accent-2-color'
                            name='Accent 2'
                            type='color'
                            value={accent2}
                            onChange={(e) => setAccent2(e.target.value)}
                            onClick={() => { if (user.theme_count >= 10) setThemeLimitErr(true); }}
                            onMouseOut={() => { setThemeLimitErr(false); }}
                        />
                    </div>
                    <div className='accent-3-setter-div'>
                        <label htmlFor='sf2-accent-3-color'>Accent 3</label>
                        <input
                            id='sf2-accent-3-color'
                            name='Accent 3'
                            type='color'
                            value={accent3}
                            onChange={(e) => setAccent3(e.target.value)}
                            onClick={() => { if (user.theme_count >= 10) setThemeLimitErr(true); }}
                            onMouseOut={() => { setThemeLimitErr(false); }}
                        />
                    </div>
                    <div className='background-color-setter-div'>
                        <label htmlFor='sf2-bg-color'>Background Color</label>
                        <input
                            id='sf2-bg-color'
                            name='Background Color'
                            type='color'
                            value={backgroundColor}
                            onChange={(e) => { setBackgroundColor(e.target.value); }}
                            onClick={() => { if (user.theme_count >= 10) setThemeLimitErr(true); }}
                            onMouseOut={() => { setThemeLimitErr(false); }}
                        />
                    </div>
                </div>
                <div className='sf2-row-c'>
                    <div className='background-media-setter-div'>
                        <label htmlFor='sf2-background-media'>
                            {backgroundMedia === '' || !fileInput.current?.value ? 'Background Media' : 'Added'}
                        </label>
                        <input
                            id='sf2-background-media'
                            ref={fileInput}
                            name='Background Media'
                            type='file'
                            accept='image/png, image/jpg, image/jpeg, image/gif'
                            onChange={setBackgroundMediaHandler}
                            onClick={() => { if (user.theme_count >= 10) setThemeLimitErr(true); }}
                            onMouseOut={() => { setThemeLimitErr(false); }}
                        />
                        {backgroundMediaLoading && (<span>Loading...</span>)}
                    </div>
                    <div className='background-rotate-setter-div'>
                        <label htmlFor='sf2-bg-rotate'>Background Rotate</label>
                        <input
                            id='sf2-bg-rotate'
                            name='Background Rotate'
                            type='checkbox'
                            checked={backgroundRotate}
                            onChange={(e) => setBackgroundRotate(e.target.checked)}
                            onClick={() => { if (user.theme_count >= 10) setThemeLimitErr(true); }}
                            onMouseOut={() => { setThemeLimitErr(false); }}
                        />
                    </div>
                </div>
            </form>
            <div
                className='theme-tester-container'
                style={{
                    borderColor: accent3,
                    backgroundColor,
                    fontFamily,
                    color: fontColor,
                }}
            >
                <h2 className='theme-tester-header' style={{ color: accent2, borderColor: accent1 }}>{themeName || 'Demo Theme'}</h2>
                <div>
                    <h3>Test your theme.</h3>
                    <p style={{ color: accent2 }}>See your theme specs here.</p>
                    <span style={{ color: accent3, fontSize }}>Font Size</span>
                </div>
            </div>
        </>
    );
};

export default CreateThemeForm;
