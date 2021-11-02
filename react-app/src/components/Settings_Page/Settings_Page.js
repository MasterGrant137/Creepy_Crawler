import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../Main.css';
import './Settings_Page.css';
import dropdownData from './dropdown_data.json';
import { editProfileMedia, resetProfileTheme } from '../../store/session';
import { createUserSetting, readUserSettings, updateThemeMedia } from '../../store/settings_store';
import { EditorForm } from './Editor_Form';

export const SettingsPage = ({ style }) => {
    const fontSizesRaw = dropdownData['font-sizes'];
    const fontFamiliesRaw = dropdownData['fonts'];
    const [toggledState, toggleState] = useState(true)
    const [p_f_2_disabled, setPF2Disabled] = useState(true);
    const [p_f_2_btn, setPF2Btn] = useState('Edit');
    const [theme_name, setThemeName] = useState('');
    const [font_family, setFontFamily] = useState(style.font_family);
    const [font_size, setFontSize] = useState(style.font_size);
    const [background_color, setBackgroundColor] = useState(style.background_color);
    const [background_rotate, setBackgroundRotate] = useState(style.background_rotate);
    const [font_color, setFontColor] = useState(style.font_color);
    const [accent_1, setAccent1] = useState(style.accent_1);
    const [accent_2, setAccent2] = useState(style.accent_2);
    const [accent_3, setAccent3] = useState(style.accent_3);
    const [profile_media, setProfileMedia] = useState('');
    const [background_media, setBackgroundMedia] = useState(style.background_media);
    const [profile_media_loading, setProfileMediaLoading] = useState(false);
    const [background_media_loading, setBackgroundMediaLoading] = useState(false);

    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user);
    // const settingsObj = useSelector(state => state.settings); //* removed settingsObj
    
    const smpl = {
        b_c: `${background_color}`,
        f_c: `${font_color}`,
        f_f: `${font_family}`,
        f_s: `${font_size}`,
        a_1: `${accent_1}`,
        a_2: `${accent_2}`,
        a_3: `${accent_3}`
      }

     useEffect(() => {
        dispatch(readUserSettings());
     }, [dispatch])

     //* Removed editor reset
     // const isSubmit = e.target.dataset.submitBtnState;
     // if (isSubmit === 'false') return;
     
     // if (formType === 'editor') {
         //     const targID = e.target.dataset.settingId;
         //     const targForm = document.getElementById(`sett-pg-editor-form-${targID}`);
         //     const prev = settingsObj[targID];
         //     const targFormKids = Array.from(targForm.children);
         //     targFormKids.forEach(targKid => {
             //         if (targKid.type === 'text') targKid.readOnly = true;
             //         else if (targKid.tagName === 'SELECT') targKid.disabled = true;
             //         else if (targKid.tagName === 'BUTTON' && targKid.innerText === 'Submit') {
                 //             targKid.innerText = 'Edit';
                 //         }
                 //         switch (targKid.type) {
                     //             case 'color': targKid.disabled = true; break;
                     //             case 'file': targKid.disabled = true; break;
                     //             case 'checkbox': targKid.disabled = true; break;
                     //             default: break;
                     //         }
                     //         switch (targKid.dataset.inputName) {
                         //             case 'Theme Name': targKid.value = prev.theme_name; break;
                         //             case 'Background Color': targKid.value = prev.background_color; break;
                         //             case 'Background Media': targKid.value = ''; break;
                         //             case 'Background Rotate': targKid.checked = prev.background_rotate; break;
                         //             case 'Font Color': targKid.value = prev.font_color; break;
                         //             case 'Font Family':
                         //                 const targText = prev.font_family.replace(/,\s/, ' | ');
                         //                 const targFamily = Array.from(targKid.children).find(option => option.innerText === targText); 
                         //                 targFamily.selected = true;
                         //                 break;
                         //             case 'Font Size': targKid.value = prev.font_size;
                         //                 const targNum = prev.font_size.replace('px', '');
                         //                 const targSize = Array.from(targKid.children).find(option => option.innerText === targNum); 
                         //                 targSize.selected = true;
                         //                 break;
                         //             case 'Accent 1': targKid.value = prev.accent_1; break;
                         //             case 'Accent 2': targKid.value = prev.accent_2; break;
                         //             case 'Accent 3': targKid.value = prev.accent_3; break;
                         //             default: break;
                         //         }
                         //     })
                         // } 
    const resetHandler = (e) => { 
        const targID = e.target.dataset.settingId;
        const targForm = document.getElementById(`sett-pg-picker-form-${targID}`);
        const targFormKids = Array.from(targForm.children);

        if (!toggledState) {
            setPF2Disabled(true);
            setPF2Btn('Edit');
            toggleState(true);
        }

        targFormKids.forEach(targKid => {
            switch (targKid.dataset.inputName) {
                case 'Theme Name': setThemeName(style.theme_name || ''); break;
                case 'Background Color': setBackgroundColor(style.background_color); break;
                case 'Background Media': targKid.value = ''; break;
                case 'Background Rotate': setBackgroundRotate(style.background_rotate); break;
                case 'Font Color': setFontColor(style.font_color); break;
                case 'Font Family': setFontFamily(style.font_family); break;
                case 'Font Size': setFontSize(style.font_size); break;
                case 'Accent 1': setAccent1(style.accent_1); break;
                case 'Accent 2': setAccent2(style.accent_2); break;
                case 'Accent 3': setAccent3(style.accent_3); break;
                default: break;
            }
        })
    }

    const setProfileMediaHandler = (e) => {
        const file = e.target.files[0];
        if (file) setProfileMedia(file);
    }

    const setBackgroundMediaHandler = (e) => {
        const file = e.target.files[0];
        if(file) setBackgroundMedia(file);
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
            window.location.reload();
        }
    }

    const createSettingHandler = async (e) => {
        e.preventDefault();
        
        const targForm = e.target;
        const targFormKids = Array.from(targForm.children);
        const isSubmit = targFormKids.find(targKid => targKid.tagName === 'BUTTON' && targKid.innerText === 'Submit');
        const hasMedia = targFormKids.find(targKid => targKid.dataset.inputName === 'Background Media');
       
        toggleState(prevState => !prevState);

        if (!toggledState) {
            setPF2Disabled(true)
            setPF2Btn('Edit')
        } else {
            setPF2Disabled(false)
            setPF2Btn('Submit')
        }

        if (p_f_2_btn === 'Submit') {
            const user_id = user.id;
    
             await dispatch(createUserSetting({
                user_id,
                theme_name,
                background_color,
                background_rotate,
                font_color,
                font_family,
                font_size,
                accent_1,
                accent_2,
                accent_3,
            }));
            

            if (isSubmit && hasMedia.value) { 
                console.log('hit', e.target.dataset.settingId);

                const formData = new FormData();
                formData.append('media', background_media);
                setBackgroundMediaLoading(true);
                
                dispatch(updateThemeMedia(user.id, formData));
                setBackgroundMediaLoading(false);
                window.location.reload();
            }
            resetHandler(e);
        }
    }

    //* Removed Edit Form Handler
    // const editFormHandler = async (e) => {
    //     e.preventDefault();

    //     const targForm = e.target;
    //     const targFormKids = Array.from(targForm.children);
    //     const settingID = targForm.dataset.settingId;

    //     const updateObj = {
    //         setting_id: settingID,
    //         user_id: user.id,
    //         theme_name,
    //         background_color,
    //         background_rotate,
    //         font_color,
    //         font_family,
    //         font_size,
    //         accent_1,
    //         accent_2,
    //         accent_3,
    //     }

    //     const isSubmit = targFormKids.find(targKid => targKid.tagName === 'BUTTON' && targKid.innerText === 'Submit');
    //     const hasMedia = targFormKids.find(targKid => targKid.dataset.inputName === 'Background Media');

    //     if (isSubmit && hasMedia.value) { 
    //         const formData = new FormData();
    //         formData.append('media', background_media);
    //         setBackgroundMediaLoading(true);
    
    //         await dispatch(updateThemeMedia(settingID, formData));
    //         setBackgroundMediaLoading(false);
    //         window.location.reload();
    //     }

    //     targFormKids.forEach(targKid => {
    //         if (targKid.type === 'text') targKid.readOnly = false;
    //         else targKid.disabled = false;
    //         if (targKid.tagName === 'BUTTON' && targKid.innerText === 'Edit') {
    //             targKid.innerText = 'Submit';
    //         } else if (targKid.tagName === 'BUTTON' && targKid.innerText === 'Submit') {
    //             targKid.innerText = 'Edit';
    //             targFormKids.forEach(targKid => {
    //                 if (targKid.tagName !== 'BUTTON') {
    //                     switch (targKid.dataset.inputName) {
    //                         case 'Theme Name': updateObj.theme_name = targKid.value; break;
    //                         case 'Background Color': updateObj.background_color = targKid.value; break;
    //                         case 'Background Rotate': updateObj.background_rotate = targKid.checked; break;
    //                         case 'Font Color': updateObj.font_color = targKid.value; break;
    //                         case 'Font Family': updateObj.font_family = targKid.value.replace(/\s\|\s/, ', '); break;
    //                         case 'Font Size': updateObj.font_size = `${targKid.value}px`; break;
    //                         case 'Accent 1': updateObj.accent_1 = targKid.value; break;
    //                         case 'Accent 2': updateObj.accent_2 = targKid.value; break;
    //                         case 'Accent 3': updateObj.accent_3 = targKid.value; break;
    //                         default: break;
    //                     }
    //                     targKid.type === 'text' ? targKid.readOnly = true : targKid.disabled = true;
    //                 }
    //             })
    //             dispatch(updateUserSetting(updateObj))
    //         }
    //     })
    // }

    //* Removed Edit Profile Handler
    // const editProfileHandler = (e, eType) => {
    //     if (eType === 'theme_count') {
    //         dispatch(editProfile({
    //             id: e.target.dataset.settingId,
    //             column: eType,
    //             theme_count: user.theme_count + 1,
    //         }))
    //     } else if (eType === 'active_theme') {
    //         console.log('hit', e.target.dataset.settingId);
    //         dispatch(editProfile({
    //             id: e.target.dataset.settingId,
    //             column: eType,
    //         }))
    //         window.location.reload();
    //     } 
    //     // else if (eType === 'reset_theme') {
    //         // dispatch(resetProfileTheme());
    //         // console.log(e);
    //     // } 
    //     else {
    //         dispatch(editProfile({
    //             id: e.target.dataset.settingId,
    //             eType: e.target
    //         }))
    //     }
    // }

    //* Removed deleteThemeHandler
    // const deleteThemeHandler = (e) => {
    //     const settingID = e.target.dataset.settingId;
    //     dispatch(deleteUserSetting(settingID))
    // };

    //* SAVING THIS FOR LATER DEVELOPMENT
    // const resetProfileHandler = () => {
    //         dispatch(resetProfileTheme());
    //         console.log(e);
    // }

    const fontSizes = fontSizesRaw.map(fontSize => (
        <option key={fontSize} >
            {fontSize}
        </option>
    ))

    const fontFamilies = fontFamiliesRaw.map(fontFamily => (
        <option key={fontFamily} >
            {fontFamily}
        </option>
    ))

    //* Removed Settings Section
    // const settings = Object.values(settingsObj).map((setting, idx) => (
    //         <form 
    //             key={`key-${setting.id}`}
    //             id={`sett-pg-editor-form-${setting.id}`}
    //             data-setting-id={setting.id}
    //             className={`settings-form editor-form ${setting.background_rotate ? 'background-rotate' : ''}`}
    //             onSubmit={editFormHandler}
    //             style={{
    //                     backgroundImage: `url(${setting.background_media})`,
    //                     backgroundColor: setting.background_color,
    //                     border: `3px solid ${setting.accent_3}`,
    //                     color: setting.font_color,
    //             }}
    //         >
    //             <label htmlFor={`sett-pg-theme-name-editor-${idx}`}>Theme Name</label>
    //             <input id={`sett-pg-theme-name-editor-${idx}`} type='text' readOnly={true} data-input-name='Theme Name' defaultValue={setting.theme_name} />
    //             <label htmlFor={`font-sizes-${idx}`} style={{fontSize: setting.font_size}}>Font Size</label>
    //             <select 
    //                 name={`font-sizes-${idx}`}
    //                 id={`sett-pg-font-size-editor-${idx}`}
    //                 data-input-name='Font Size'
    //                 disabled={true}
    //                 defaultValue={setting.font_size?.replace('px', '')}
    //                 >
    //                 {fontSizes}
    //             </select>
    //             <label htmlFor={`font-families-${idx}`} style={{fontFamily: setting.font_family}}>Font Family</label>
    //             <select
    //                 name={`font-families-${idx}`}
    //                 id={`sett-pg-font-family-editor-${idx}`}
    //                 data-input-name='Font Family'
    //                 disabled={true}
    //                 defaultValue={setting.font_family?.replace(/,\s/, ' | ')}
    //             >
    //                {fontFamilies}
    //             </select>

    //             <label htmlFor={`sett-pg-font-color-editor-${idx}`}>Font Color</label>
    //             <input id={`sett-pg-font-color-editor-${idx}`} data-input-name='Font Color' type='color' disabled={true} defaultValue={setting.font_color} />

    //             <label htmlFor={`sett-pg-bg-color-editor-${idx}`}>Background Color</label>
    //             <input id={`sett-pg-bg-color-editor-${idx}`} data-input-name='Background Color' type='color' disabled={true} defaultValue={setting.background_color} />

    //             <label htmlFor='sett-pg-background-media-editor'>{background_media !== '' ? 'Background Media' : 'Added'}</label>
    //             <input id='sett-pg-background-media-editor' data-input-name='Background Media' type='file' disabled={true} onChange={setBackgroundMediaHandler} />
    //             {background_media_loading && (<span>Loading...</span>)}

    //             <label htmlFor={`sett-pg-bg-rotate-editor-${idx}`}>Background Rotate</label>
    //             <input id={`sett-pg-bg-rotate-editor-${idx}`} data-input-name='Background Rotate' type='checkbox' disabled={true} defaultChecked={setting.background_rotate} />

    //             <label htmlFor={`sett-pg-accent-1-color-editor-${idx}`} style={{color: setting.accent_1}}>Accent 1</label>
    //             <input id={`sett-pg-accent-1-color-editor-${idx}`} data-input-name='Accent 1' type='color' disabled={true} defaultValue={setting.accent_1} />
                
    //             <label htmlFor={`sett-pg-accent-2-color-editor-${idx}`} style={{color: setting.accent_2}}>Accent 2</label>
    //             <input id={`sett-pg-accent-2-color-editor-${idx}`} data-input-name='Accent 2' type='color' disabled={true} defaultValue={setting.accent_2} />
                
    //             <label htmlFor={`sett-pg-accent-3-color-editor-${idx}`} style={{color: setting.accent_3}}>Accent 3</label>
    //             <input id={`sett-pg-accent-2-color-editor-${idx}`} data-input-name='Accent 3' type='color' disabled={true} defaultValue={setting.accent_3} />
                
    //             <button 
    //                 data-setting-id={`${setting.id}`} 
    //                 type='button'
    //                 onClick={(e) => editProfileHandler(e, 'active_theme')} 
    //                 style={{ color: setting.font_color }}
    //             >
    //                 Use
    //             </button>
    //             <button style={{ color: setting.font_color }}>Edit</button>
    //             <button 
    //                 data-setting-id={`${setting.id}`}  
    //                 type='button'
    //                 onClick={(e) => resetHandler(e, 'editor')} 
    //                 style={{ color: setting.font_color }}
    //             >
    //                     Cancel
    //                 </button>
    //             <button
    //                 data-setting-id={`${setting.id}`}
    //                 type='button'
    //                 onClick={(e) => deleteThemeHandler(e)} 
    //                 style={{ color: setting.font_color }} 
    //             >
    //                 Delete
    //             </button>
    //         </form>
    // ))

    return (
        <div className='settings-page-container'>
            <h1 style={{ borderBottom: `2px solid ${style.accent_1}` }}>Settings</h1>
            <div className='create-and-test-container'>
                <div className='settings-actions-container' style={{ border: `3px solid ${style.accent_3}`, backgroundColor: style.background_color }}>
                    <form 
                        id='sett-pg-picker-form-1'
                        data-setting-id={1}
                        className='settings-form picker-form-1'
                        onSubmit={profileMediaHandler}
                    >
                        <label htmlFor='sett-pg-user-profile-media-uploader'>
                            <span style={{ color: style.accent_2, borderBottom: `2px solid ${style.accent_1}` }}>{!profile_media ? 'Upload Profile Media' : 'Added'}</span>
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
                    {/* <button data-setting-id='null' type='button' onClick={(e) => resetProfileHandler(e, 'reset_theme')}>Set Theme to Default</button> */}
                </div>
                <div 
                    className='create-theme-container' 
                    style={{ border: `3px solid ${style.accent_3}` }}
                >
                    <form 
                        id='sett-pg-picker-form-2'
                        data-setting-id={2}
                        className='settings-form picker-form-2' 
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
                        <label htmlFor='sett-page-theme-name-picker'>Theme Name</label>
                        <input
                            id='sett-page-theme-name-picker'
                            readOnly={p_f_2_disabled}
                            data-input-name='Theme Name'
                            type='text'
                            placeholder='Theme Name'
                            value={theme_name}
                            onChange={(e) => setThemeName(e.target.value)}
                        />
                        <label htmlFor='sett-pg-bg-color-picker'>Background Color</label>
                        <input
                            id='sett-pg-bg-color-picker'
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
                        <label htmlFor='sett-pg-bg-rotate-picker'>Background Rotate</label>
                        <input
                            id='sett-pg-bg-rotate-picker'
                            data-input-name='Background Rotate'
                            type='checkbox'
                            disabled={p_f_2_disabled}
                            checked={background_rotate}
                            onChange={(e) => setBackgroundRotate(e.target.checked)}
                        />
                        <label htmlFor='sett-pg-font-color-picker'>Font Color</label>
                        <input
                            id='sett-pg-font-color-picker'
                            data-input-name='Font Color'
                            type='color'
                            disabled={p_f_2_disabled}
                            value={font_color}
                            onChange={(e) => setFontColor(e.target.value)}
                        />
                        <label htmlFor='font-sizes'>Font Size</label>
                        <select name='font-sizes'
                                id='sett-pg-font-size-picker'
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
                            id='sett-pg-font-family-picker'
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
                        <label htmlFor='sett-pg-accent-1-color-picker'>Accent 1</label>
                        <input
                            id='sett-pg-accent-1-color-picker'
                            data-input-name='Accent 1'
                            type='color'
                            disabled={p_f_2_disabled}
                            value={accent_1}
                            onChange={(e) => setAccent1(e.target.value)}
                        />
                        <label htmlFor='sett-pg-accent-2-color-picker'>Accent 2</label>
                        <input
                            id='sett-pg-accent-2-color-picker'
                            data-input-name='Accent 2'
                            type='color'
                            disabled={p_f_2_disabled}
                            value={accent_2}
                            onChange={(e) => setAccent2(e.target.value)}
                        />
                        <label htmlFor='sett-pg-accent-3-color-picker'>Accent 3</label>
                        <input
                            id='sett-pg-accent-3-color-picker'
                            data-input-name='Accent 3'
                            type='color'
                            disabled={p_f_2_disabled}
                            value={accent_3}
                            onChange={(e) => setAccent3(e.target.value)}
                        />
                    </form>
                    </div>
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
            <div className='themes-container'>
                {/* {settings} */}
            <EditorForm style={style} />
            </div>
        </div>
    )
}