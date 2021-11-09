import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dropdownData from './dropdown_data.json';
import { createUserSetting } from '../../store/settings_store';

export const CreateThemeForm = ({ style }) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user);
    const fileInput = useRef(null);

    const fontFamiliesRaw = dropdownData['fonts'];
    const fontFamilies = fontFamiliesRaw.map(fontFamily => (
        <option key={fontFamily} >
            {fontFamily}
        </option>
    ))

    const fontSizesRaw = dropdownData['font-sizes'];
    const fontSizes = fontSizesRaw.map(fontSize => (
        <option key={fontSize} >
            {fontSize}
        </option>
    ))

    const [accent_1, setAccent1] = useState(style.accent_1);
    const [accent_2, setAccent2] = useState(style.accent_2);
    const [accent_3, setAccent3] = useState(style.accent_3);
    const [background_color, setBackgroundColor] = useState(style.background_color);
    const [background_media_loading, setBackgroundMediaLoading] = useState(false);
    const [background_media, setBackgroundMedia] = useState(style.background_media);
    const [background_rotate, setBackgroundRotate] = useState(style.background_rotate);
    const [font_family, setFontFamily] = useState(style.font_family);
    const [font_size, setFontSize] = useState(style.font_size);
    const [font_color, setFontColor] = useState(style.font_color);
    const [theme_name, setThemeName] = useState('');

    const resetHandler = (e) => {
        e.preventDefault();

        setThemeName('');
        setBackgroundColor(style.background_color);
        setBackgroundMedia('');
        document.getElementById('sf2-background-media').value=''
        setBackgroundRotate(style.background_rotate);
        setFontColor(style.font_color);
        setFontFamily(style.font_family);
        setFontSize(style.font_size);
        setAccent1(style.accent_1);
        setAccent2(style.accent_2);
        setAccent3(style.accent_3);
    }
    
    const setBackgroundMediaHandler = (e) => {
        const file = e.target.files[0];
        if(file) setBackgroundMedia(file);
    }
    
    const createSettingHandler = async (e) => {
        e.preventDefault();
            
        const user_id = user.id;
        const formData = new FormData();
        
        formData.append('user_id', user_id)
        formData.append('theme_name', theme_name)
        formData.append('background_media', background_media);
        setBackgroundMediaLoading(true);
        formData.append('background_color', background_color)
        formData.append('background_rotate', background_rotate)
        formData.append('font_color', font_color)
        formData.append('font_family', font_family)
        formData.append('font_size', font_size)
        formData.append('accent_1', accent_1)
        formData.append('accent_2', accent_2)
        formData.append('accent_3', accent_3)
        
        await dispatch(createUserSetting(formData));
        setBackgroundMediaLoading(false);

        resetHandler(e);
    }

    return (
        <>
            <form className='setter-form-2' onSubmit={createSettingHandler} style={{ borderColor: style.accent_3 }}>
                <h2 className='create-theme-header' style={{ color: style.accent_2, borderColor: style.accent_1 }}>Create Theme</h2>
                <button 
                    className='sf2-submit-btn' 
                    style={{ 
                        color: style.font_color,
                        fontFamily: style.font_family,
                        fontSize: style.font_size
                    }}
                >
                    Submit
                </button>
                <button
                    type='button'
                    className='sf2-reset-btn'
                    onClick={resetHandler}
                    style={{ 
                        color: style.font_color, 
                        fontFamily: style.font_family,
                        fontSize: style.font_size
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
                            placeholder='Theme Name'
                            value={theme_name}
                            onChange={(e) => setThemeName(e.target.value)}
                            style={{ fontFamily: style.font_family }}
                        />
                    </div>
                    <div className='font-size-setter-div'>
                        <label htmlFor='font-size-setter'>Font Size</label>
                        <select 
                            id='font-size-setter'
                            name='Font Size'
                            value={font_size?.replace('px', '')}
                            onChange={(e) => {
                                const targOption = Array.from(e.target.children).find(option => option.selected);
                                setFontSize(`${targOption.innerText}px`);
                            }}
                        >
                            {fontSizes}
                        </select>
                    </div>
                    <div className='font-family-setter-div'>
                        <label htmlFor='font-family-setter'>Font Family</label>
                        <select 
                            id='font-family-setter'
                            name='Font Family'
                            value={font_family?.replace(/,\s/, ' | ')}
                            onChange={(e) => {
                                const targOption = Array.from(e.target.children).find(option => option.selected);
                                setFontFamily(targOption.innerText.replace(/\s\|\s/, ', '));
                            }}
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
                            value={font_color}
                            onChange={(e) => setFontColor(e.target.value)}
                        />
                    </div>
                    <div className='accent-1-setter-div'>
                        <label htmlFor='sf2-accent-1-color'>Accent 1</label>
                        <input
                            id='sf2-accent-1-color'
                            name='Accent 1'
                            type='color'
                            value={accent_1}
                            onChange={(e) => setAccent1(e.target.value)}
                        />
                    </div>
                    <div className='accent-2-setter-div'>
                        <label htmlFor='sf2-accent-2-color'>Accent 2</label>
                        <input
                            id='sf2-accent-2-color'
                            name='Accent 2'
                            type='color'
                            value={accent_2}
                            onChange={(e) => setAccent2(e.target.value)}
                        />
                    </div>
                    <div className='accent-3-setter-div'>
                        <label htmlFor='sf2-accent-3-color'>Accent 3</label>
                        <input
                            id='sf2-accent-3-color'
                            name='Accent 3'
                            type='color'
                            value={accent_3}
                            onChange={(e) => setAccent3(e.target.value)}
                        />
                    </div>
                    <div className='background-color-setter-div'>
                        <label htmlFor='sf2-bg-color'>Background Color</label>
                        <input
                            id='sf2-bg-color'
                            name='Background Color'
                            type='color'
                            value={background_color}
                            onChange={(e) => { setBackgroundColor(e.target.value) }}
                        />
                    </div>
                </div>
                <div className='sf2-row-c'>
                    <div className='background-media-setter-div'>
                        <label htmlFor='sf2-background-media'>
                            {background_media === '' || !fileInput.current?.value ? 'Background Media' : 'Added'}
                        </label>
                        <input
                            id='sf2-background-media'
                            ref={fileInput}
                            name='Background Media'
                            type='file'
                            accept='image/png, image/jpg, image/jpeg, image/gif'
                            onChange={setBackgroundMediaHandler}
                        />
                        {background_media_loading && (<span>Loading...</span>)}
                    </div>
                    <div className='background-rotate-setter-div'>
                        <label htmlFor='sf2-bg-rotate'>Background Rotate</label>
                        <input
                            id='sf2-bg-rotate'
                            name='Background Rotate'
                            type='checkbox'
                            checked={background_rotate}
                            onChange={(e) => setBackgroundRotate(e.target.checked)}
                        />
                    </div>
                </div>
            </form>
            <div  
                className='theme-tester-container'
                style={{
                    borderColor: accent_3,
                    backgroundColor: background_color,
                    fontFamily: font_family,
                    color: font_color
                }}
            >
                <h2 className='theme-tester-header' style={{ color: accent_2, borderColor: accent_1 }}>{theme_name || 'Demo Theme'}</h2>
                <div>
                    <h3>Test your theme.</h3>
                    <p>See your theme specs here.</p>
                    <p style={{ fontSize: font_size }}>Font Size</p>
                </div>
            </div>
        </>
    )
}
