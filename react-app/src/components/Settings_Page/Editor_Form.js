import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editProfile } from '../../store/session';
//* removed updateThemeMedia
import { updateUserSetting, deleteUserSetting } from '../../store/settings_store';
import dropdownData from './dropdown_data.json';
import '../Main.css';
import './Settings_Page.css';

export const EditorForm = ({ style }) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user);
    const settingsObj = useSelector(state => state.settings);

    const [background_media, setBackgroundMedia] = useState(style.background_media);
    const [background_media_loading, setBackgroundMediaLoading] = useState(false);

    const fontFamiliesRaw = dropdownData['fonts'];
    const fontFamilies = fontFamiliesRaw.map(fontFamily => (
        <option key={fontFamily}>{fontFamily}</option>
        ))
        
    const fontSizesRaw = dropdownData['font-sizes'];
    const fontSizes = fontSizesRaw.map(fontSize => (
        <option key={fontSize}>{fontSize}</option>
        ))
    
    // const { background_color, background_rotate, font_color, font_family, font_size, accent_1, accent_2, accent_3 } = style;

    const resetHandler = (e) => { 
        const isSubmit = e.target.dataset.submitBtnState;
        if (isSubmit === 'false') return;

        const targID = e.target.dataset.settingId;
        const targForm = document.getElementById(`sett-pg-editor-form-${targID}`);
        const prev = settingsObj[targID];
        const targFormKids = Array.from(targForm.children);

        targFormKids.forEach(targKid => {
            if (targKid.type === 'text') targKid.readOnly = true;
            else if (targKid.tagName === 'SELECT') targKid.disabled = true;
            else if (targKid.tagName === 'BUTTON' && targKid.innerText === 'Submit') {
                targKid.innerText = 'Edit';
            }
            switch (targKid.type) {
                case 'color': targKid.disabled = true; break;
                case 'file': targKid.disabled = true; break;
                case 'checkbox': targKid.disabled = true; break;
                default: break;
            }
            switch (targKid.dataset.inputName) {
                case 'Theme Name': targKid.value = prev.theme_name; break;
                case 'Background Color': targKid.value = prev.background_color; break;
                case 'Background Media': targKid.value = ''; break;
                case 'Background Rotate': targKid.checked = prev.background_rotate; break;
                case 'Font Color': targKid.value = prev.font_color; break;
                case 'Font Family':
                    const targText = prev.font_family.replace(/,\s/, ' | ');
                    const targFamily = Array.from(targKid.children).find(option => option.innerText === targText); 
                    targFamily.selected = true;
                    break;
                case 'Font Size': targKid.value = prev.font_size;
                    const targNum = prev.font_size.replace('px', '');
                    const targSize = Array.from(targKid.children).find(option => option.innerText === targNum); 
                    targSize.selected = true;
                    break;
                case 'Accent 1': targKid.value = prev.accent_1; break;
                case 'Accent 2': targKid.value = prev.accent_2; break;
                case 'Accent 3': targKid.value = prev.accent_3; break;
                default: break;
            }
        })
    }
    
    const setBackgroundMediaHandler = (e) => {
        const file = e.target.files[0];
        if(file) setBackgroundMedia(file);
    }

    const editFormHandler = async (e) => {
        e.preventDefault();
        
        const targForm = e.target;
        const targFormKids = Array.from(targForm.children);
        const settingID = targForm.dataset.settingId;
        
        // const isSubmit = targFormKids.find(targKid => targKid.tagName === 'BUTTON' && targKid.innerText === 'Submit');
        // const isMedia = targFormKids.find(targKid => targKid.dataset.inputName === 'Background Media');
        
        targFormKids.forEach(targKid => {
            if (targKid.type === 'text') targKid.readOnly = false;
            else targKid.disabled = false;
            if (targKid.tagName === 'BUTTON' && targKid.innerText === 'Edit') {
                targKid.innerText = 'Submit';
            } else if (targKid.tagName === 'BUTTON' && targKid.innerText === 'Submit') {
                targKid.innerText = 'Edit';

                const formData = new FormData();
                formData.append('setting_id', settingID);
                formData.append('user_id', user.id);
                
                // if (isSubmit && isMedia.value) { 
                //     formData.append('media', background_media);
                //     setBackgroundMediaLoading(true);
                // }
                
                targFormKids.forEach(targKid => {
                    if (targKid.tagName !== 'BUTTON') {
                        switch (targKid.dataset.inputName) {
                            case 'Theme Name': formData.append('theme_name', targKid.value); console.log(targKid.value); break;
                            case 'Background Color': formData.append('background_color', targKid.value); console.log(targKid.value); break;
                            case 'Background Media': formData.append('background_media', background_media); setBackgroundMediaLoading(true); console.log(background_media); break;
                            case 'Background Rotate': formData.append('background_rotate', targKid.checked); console.log(targKid.checked, typeof(targKid.checked)); break;
                            case 'Font Color': formData.append('font_color', targKid.value); console.log(targKid.value); break;
                            case 'Font Family': formData.append('font_family', targKid.value.replace(/\s\|\s/, ', ')); console.log(targKid.value); break;
                            case 'Font Size': formData.append('font_size', `${targKid.value}px`); console.log(targKid.value); break;
                            case 'Accent 1': formData.append('accent_1', targKid.value); console.log(targKid.value); break;
                            case 'Accent 2': formData.append('accent_2', targKid.value); console.log(targKid.value); break;
                            case 'Accent 3': formData.append('accent_3', targKid.value); console.log(targKid.value); break;
                            default: break;
                        }
                        targKid.type === 'text' ? targKid.readOnly = true : targKid.disabled = true;
                    }
                })
                dispatch(updateUserSetting(settingID, formData));
                setBackgroundMediaLoading(false);
            }
        })
    }
    
    const deleteThemeHandler = (e) => {
        const settingID = e.target.dataset.settingId;
        dispatch(deleteUserSetting(settingID))
    };
    
    const editProfileHandler = (e, eType) => {
        if (eType === 'active_theme') {
            dispatch(editProfile({
                id: e.target.dataset.settingId,
                column: eType,
            }))
        }
    }

    const editorThemes = Object.values(settingsObj).map((setting, idx) => (
        <form 
            key={`key-${setting.id}`}
            id={`sett-pg-editor-form-${setting.id}`}
            data-setting-id={setting.id}
            className={`settings-form editor-form ${setting.background_rotate ? 'background-rotate' : ''}`}
            onSubmit={editFormHandler}
            style={{
                    backgroundImage: `url(${setting.background_media})`,
                    backgroundColor: setting.background_color,
                    border: `3px solid ${setting.accent_3}`,
                    color: setting.font_color,
            }}
        >
            <label htmlFor={`sett-pg-theme-name-editor-${idx}`}>Theme Name</label>
            <input id={`sett-pg-theme-name-editor-${idx}`} type='text' readOnly={true} data-input-name='Theme Name' defaultValue={setting.theme_name} />
            <label htmlFor={`font-sizes-${idx}`} style={{fontSize: setting.font_size}}>Font Size</label>
            <select 
                name={`font-sizes-${idx}`}
                id={`sett-pg-font-size-editor-${idx}`}
                data-input-name='Font Size'
                disabled={true}
                defaultValue={setting.font_size?.replace('px', '')}
                >
                {fontSizes}
            </select>
            <label htmlFor={`font-families-${idx}`} style={{fontFamily: setting.font_family}}>Font Family</label>
            <select
                name={`font-families-${idx}`}
                id={`sett-pg-font-family-editor-${idx}`}
                data-input-name='Font Family'
                disabled={true}
                defaultValue={setting.font_family?.replace(/,\s/, ' | ')}
            >
               {fontFamilies}
            </select>

            <label htmlFor={`sett-pg-font-color-editor-${idx}`}>Font Color</label>
            <input id={`sett-pg-font-color-editor-${idx}`} data-input-name='Font Color' type='color' disabled={true} defaultValue={setting.font_color} />

            <label htmlFor={`sett-pg-bg-color-editor-${idx}`}>Background Color</label>
            <input id={`sett-pg-bg-color-editor-${idx}`} data-input-name='Background Color' type='color' disabled={true} defaultValue={setting.background_color} />

            <label htmlFor='sett-pg-background-media-editor'>{background_media !== '' ? 'Background Media' : 'Added'}</label>
            <input id='sett-pg-background-media-editor' data-input-name='Background Media' type='file' disabled={true} onChange={setBackgroundMediaHandler} />
            {background_media_loading && (<span>Loading...</span>)}

            <label htmlFor={`sett-pg-bg-rotate-editor-${idx}`}>Background Rotate</label>
            <input id={`sett-pg-bg-rotate-editor-${idx}`} data-input-name='Background Rotate' type='checkbox' disabled={true} defaultChecked={setting.background_rotate} />

            <label htmlFor={`sett-pg-accent-1-color-editor-${idx}`} style={{color: setting.accent_1}}>Accent 1</label>
            <input id={`sett-pg-accent-1-color-editor-${idx}`} data-input-name='Accent 1' type='color' disabled={true} defaultValue={setting.accent_1} />
            
            <label htmlFor={`sett-pg-accent-2-color-editor-${idx}`} style={{color: setting.accent_2}}>Accent 2</label>
            <input id={`sett-pg-accent-2-color-editor-${idx}`} data-input-name='Accent 2' type='color' disabled={true} defaultValue={setting.accent_2} />
            
            <label htmlFor={`sett-pg-accent-3-color-editor-${idx}`} style={{color: setting.accent_3}}>Accent 3</label>
            <input id={`sett-pg-accent-2-color-editor-${idx}`} data-input-name='Accent 3' type='color' disabled={true} defaultValue={setting.accent_3} />
            
            <button 
                data-setting-id={`${setting.id}`} 
                type='button'
                onClick={(e) => editProfileHandler(e, 'active_theme')} 
                style={{ color: setting.font_color }}
            >
                Use
            </button>
            <button style={{ color: setting.font_color }}>Edit</button>
            <button 
                data-setting-id={`${setting.id}`}  
                type='button'
                onClick={resetHandler} 
                style={{ color: setting.font_color }}
            >
                    Cancel
                </button>
            <button
                data-setting-id={`${setting.id}`}
                type='button'
                onClick={(e) => deleteThemeHandler(e)} 
                style={{ color: setting.font_color }} 
            >
                Delete
            </button>
        </form>
    ))

    return (
        <>
            {editorThemes}
        </>
    )
}
