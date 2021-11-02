import React from 'react'

export const SetterForm2 = () => {
    return (
        <div 
            className='create-theme-container' 
            style={{ border: `3px solid ${style.accent_3}` }}
        >
            <form 
                id='sett-pg-setter-form-2'
                data-setting-id={2}
                className='settings-form setter-form-2' 
                onSubmit={createSettingHandler}
                style={{ backgroundColor: style.background_color }}
            >
                <h2 style={{ color: style.accent_2, borderBottom: `2px solid ${style.accent_1}` }}>Create Theme</h2>
                <button style={{ color: font_color, fontFamily: font_family }}>
                    {p_f_2_btn}
                </button>
                <button
                    type='button'
                    data-setting-id={2}
                    data-submit-btn-state={p_f_2_btn === 'Submit' ? true : false} 
                    onClick={resetHandler}
                    style={{ color: font_color, fontFamily: font_family }}
                >
                    Cancel
                </button>
                <label htmlFor='sett-page-theme-name-setter'>Theme Name</label>
                <input
                    id='sett-page-theme-name-setter'
                    readOnly={p_f_2_disabled}
                    data-input-name='Theme Name'
                    type='text'
                    placeholder='Theme Name'
                    value={theme_name}
                    onChange={(e) => setThemeName(e.target.value)}
                />
                <label htmlFor='sett-pg-bg-color-setter'>Background Color</label>
                <input
                    id='sett-pg-bg-color-setter'
                    data-input-name='Background Color'
                    type='color'
                    disabled={p_f_2_disabled}
                    value={background_color}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                />
                <label htmlFor='sett-pg-background-media-uploader'>
                    {background_media !== '' ? 'Background Media' : 'Added'}
                </label>
                <input
                    id='sett-pg-background-media-uploader'
                    data-input-name='Background Media'
                    type='file'
                    disabled={p_f_2_disabled}
                    onChange={setBackgroundMediaHandler}
                />
                    {background_media_loading && (<span>Loading...</span>)}
                <label htmlFor='sett-pg-bg-rotate-setter'>Background Rotate</label>
                <input
                    id='sett-pg-bg-rotate-setter'
                    data-input-name='Background Rotate'
                    type='checkbox'
                    disabled={p_f_2_disabled}
                    checked={background_rotate}
                    onChange={(e) => setBackgroundRotate(e.target.checked)}
                />
                <label htmlFor='sett-pg-font-color-setter'>Font Color</label>
                <input
                    id='sett-pg-font-color-setter'
                    data-input-name='Font Color'
                    type='color'
                    disabled={p_f_2_disabled}
                    value={font_color}
                    onChange={(e) => setFontColor(e.target.value)}
                />
                <label htmlFor='font-sizes'>Font Size</label>
                <select name='font-sizes'
                        id='sett-pg-font-size-setter'
                        data-input-name='Font Size'
                        disabled={p_f_2_disabled}
                        value={font_size?.replace('px', '')}
                        onChange={(e) => {
                            const targOption = Array.from(e.target.children).find(option => option.selected);
                            setFontSize(`${targOption.innerText}px`);
                        }}
                >
                    {fontSizes}
                </select>
                <label htmlFor='font-families'>Font Family</label>
                <select 
                    name='font-families'
                    id='sett-pg-font-family-setter'
                    data-input-name='Font Family'
                    disabled={p_f_2_disabled}
                    value={font_family?.replace(/,\s/, ' | ')}
                    onChange={(e) => {
                        const targOption = Array.from(e.target.children).find(option => option.selected);
                        setFontFamily(targOption.innerText.replace(/\s\|\s/, ', '));
                    }}
                >
                {fontFamilies}
                </select>
                <label htmlFor='sett-pg-accent-1-color-setter'>Accent 1</label>
                <input
                    id='sett-pg-accent-1-color-setter'
                    data-input-name='Accent 1'
                    type='color'
                    disabled={p_f_2_disabled}
                    value={accent_1}
                    onChange={(e) => setAccent1(e.target.value)}
                />
                <label htmlFor='sett-pg-accent-2-color-setter'>Accent 2</label>
                <input
                    id='sett-pg-accent-2-color-setter'
                    data-input-name='Accent 2'
                    type='color'
                    disabled={p_f_2_disabled}
                    value={accent_2}
                    onChange={(e) => setAccent2(e.target.value)}
                />
                <label htmlFor='sett-pg-accent-3-color-setter'>Accent 3</label>
                <input
                    id='sett-pg-accent-3-color-setter'
                    data-input-name='Accent 3'
                    type='color'
                    disabled={p_f_2_disabled}
                    value={accent_3}
                    onChange={(e) => setAccent3(e.target.value)}
                />
            </form>
            <div  
                className='theme-tester-container'
                style={{
                    border: `3px dashed ${smpl.a_3}`,
                    backgroundColor: smpl.b_c,
                    fontFamily: smpl.f_f,
                    fontSize: smpl.f_s,
                    color: smpl.f_c
                }}
                >
                    <h2 style={{ color: style.accent_2, borderBottom: `2px dashed ${smpl.a_1}` }}>{`${theme_name}` || 'Theme Name'}</h2>
                    <div 
                        style={{ backgroundColor: smpl.b_c }}
                        >
                        <h3>Test your theme.</h3>
                        <span>See your theme specs here.</span>
                    </div>
            </div>
        </div>
    )
}
