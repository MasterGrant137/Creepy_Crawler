import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { editProfile } from '../../store/session';
import { updateUserSetting, deleteUserSetting } from '../../store/settings_store';
import dropdownData from './dropdown_data.json';

const EditThemeForm = ({ style }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.session.user);
    const settingsObj = useSelector((state) => state.settings);

    const [backgroundMedia, setBackgroundMedia] = useState(style.background_media);
    const [backgroundMediaLoading, setBackgroundMediaLoading] = useState(false);

    const fontFamiliesRaw = dropdownData.fonts;
    const fontFamilies = fontFamiliesRaw.map((fontFamily) => (
        <option key={fontFamily}>{fontFamily}</option>
    ));

    const fontSizesRaw = dropdownData['font-sizes'];
    const fontSizes = fontSizesRaw.map((fontSize) => (
        <option key={fontSize}>{fontSize}</option>
    ));

    const resetHandler = (targID) => {
        // const isSubmit = e.target.dataset.submitBtnState;
        // if (isSubmit === 'false') return;

        const targForm = document.getElementById(targID);
        const prev = settingsObj[targID];
        const targFormKids = Array.from(targForm.children);

        const lockOpenIcon = document.getElementById(`lock-open-${targID}`);
        const lockIcon = document.getElementById(`lock-${targID}`);
        const lockBtn = document.getElementById(`lock-btn-${targID}`);
        const cancelBtn = document.getElementById(`cancel-btn-${targID}`);

        lockOpenIcon.dataset.visibility = 'false';
        lockIcon.dataset.visibility = 'true';
        lockBtn.dataset.locked = 'true';
        cancelBtn.classList.add('invisible');

        targFormKids.forEach((targKid) => {
            if (targKid.type === 'text') targKid.readOnly = true;
            else if (targKid.tagName === 'SELECT') targKid.disabled = true;

            switch (targKid.type) {
            case 'color': targKid.disabled = true; break;
            case 'file': targKid.disabled = true; break;
            case 'checkbox': targKid.disabled = true; break;
            default: break;
            }

            switch (targKid.name) {
            case 'Theme Name': targKid.value = prev.theme_name; break;
            case 'Background Color': targKid.value = prev.background_color; break;
            case 'Background Media': targKid.value = ''; break;
            case 'Background Rotate': targKid.checked = prev.background_rotate; break;
            case 'Font Color': targKid.value = prev.font_color; break;
            case 'Font Family': {
                const targText = prev.font_family.replace(/,\s/, ' | ');
                const targKids = targKid.children;
                const targFamily = Array.from(targKids).find((opt) => opt.innerText === targText);
                targFamily.selected = true;
                break;
            }
            case 'Font Size': {
                targKid.value = prev.font_size;
                const targNum = prev.font_size.replace('px', '');
                const targKids = targKid.children;
                const targSize = Array.from(targKids).find((opt) => opt.innerText === targNum);
                targSize.selected = true;
                break;
            }
            case 'Accent 1': targKid.value = prev.accent_1; break;
            case 'Accent 2': targKid.value = prev.accent_2; break;
            case 'Accent 3': targKid.value = prev.accent_3; break;
            default: break;
            }
        });
    };

    const setBackgroundMediaHandler = (e) => {
        const file = e.target.files[0];
        if (file) setBackgroundMedia(file);
    };

    const editFormHandler = async (e) => {
        e.preventDefault();
        const targForm = e.target;
        const targFormKids = Array.from(targForm.children);
        const settingID = targForm.id;
        const lockBtn = document.getElementById(`lock-btn-${settingID}`);
        const formData = new FormData();

        if (lockBtn.dataset.locked === 'true') {
            targFormKids.forEach((targKid) => {
                const lockIcon = lockBtn.children[0];
                lockIcon.dataset.visibility = 'false';

                const lockOpenIcon = document.getElementById(`lock-open-${settingID}`);
                lockOpenIcon.dataset.visibility = 'true';
                lockBtn.dataset.locked = 'false';

                const cancelBtn = document.getElementById(`cancel-btn-${settingID}`);
                cancelBtn.classList.remove('invisible');

                if (targKid.type === 'text') {
                    targKid.readOnly = false;
                } else if (targKid.tagName === 'SELECT') {
                    targKid.disabled = false;
                }

                switch (targKid.type) {
                case 'color': targKid.disabled = false;
                    break;
                case 'file': targKid.disabled = false;
                    break;
                case 'checkbox': targKid.disabled = false;
                    break;
                default: break;
                }
            });
        } else if (lockBtn.dataset.locked === 'false') {
            targFormKids.forEach((targKid) => {
                const lockOpenIcon = lockBtn.children[1];
                lockOpenIcon.dataset.visibility = 'false';

                const lockIcon = document.getElementById(`lock-${settingID}`);
                lockIcon.dataset.visibility = 'true';
                lockBtn.dataset.locked = 'true';

                const cancelBtn = document.getElementById(`cancel-btn-${settingID}`);
                cancelBtn.classList.add('invisible');

                if (targKid.type === 'text') {
                    targKid.readOnly = true;
                } else if (targKid.tagName === 'SELECT') {
                    targKid.disabled = true;
                }

                switch (targKid.type) {
                case 'color': targKid.disabled = true;
                    break;
                case 'file': targKid.disabled = true;
                    break;
                case 'checkbox': targKid.disabled = true;
                    break;
                default: break;
                }

                formData.append('settingID', settingID);
                formData.append('userID', user.id);

                if (targKid.tagName !== 'BUTTON') {
                    switch (targKid.name) {
                    case 'Theme Name': formData.append('themeName', targKid.value); break;
                    case 'Background Color': formData.append('backgroundColor', targKid.value); break;
                    case 'Background Media':
                        formData.append('backgroundMedia', backgroundMedia);
                        setBackgroundMediaLoading(true);
                        targKid.value = '';
                        break;
                    case 'Background Rotate': formData.append('backgroundRotate', targKid.checked); break;
                    case 'Font Color': formData.append('fontColor', targKid.value); break;
                    case 'Font Family': formData.append('fontFamily', targKid.value.replace(/\s\|\s/, ', ')); break;
                    case 'Font Size': formData.append('fontSize', `${targKid.value}px`); break;
                    case 'Accent 1': formData.append('accent1', targKid.value); break;
                    case 'Accent 2': formData.append('accent2', targKid.value); break;
                    case 'Accent 3': formData.append('accent3', targKid.value); break;
                    default: break;
                    }
                }
            });
            dispatch(updateUserSetting(settingID, formData));
            setBackgroundMediaLoading(false);
        }
    };

    const copyThemeData = (settingID) => {
        const targSetting = { ...settingsObj[settingID] };
        const themeName = targSetting.theme_name;
        const themeKey = themeName.toLowerCase().replace(/\s/, '_');

        delete targSetting.id;
        delete targSetting.user_id;
        delete targSetting.theme_name;

        const entriesArr = Object.entries(targSetting);
        const entriesFormatted = [];
        entriesArr.forEach((entry) => {
            const formattedEntry = `${'\t'}"${entry[0]}": "${entry[1]}"`;
            entriesFormatted.push(formattedEntry);
        });
        const entries = entriesFormatted.join(',\n');
        navigator.clipboard.writeText(`"${themeKey}": {${'\n'}${entries}${'\n'}}`);
    };

    const decrementThemeCount = (eType, operation) => {
        dispatch(editProfile({
            column: eType,
            operation,
        }));
    };

    const deleteThemeHandler = async (e, settingID) => {
        if (user.theme_count > 0) {
            await dispatch(deleteUserSetting(settingID));
            decrementThemeCount('theme_count', 'decrement');
        } else {
            alert('You are not permitted to delete any more themes!');
        }
    };

    const updateActiveTheme = (settingID, eType) => {
        dispatch(editProfile({
            column: eType,
            id: settingID,
        }));
    };

    const editorThemes = Object.values(settingsObj).map((setting, idx) => (
        <form
            key={`key-${setting.id}`}
            id={setting.id}
            className='editor-form-1'
            onSubmit={editFormHandler}
            style={{
                backgroundImage: `url(${setting.background_media})`,
                backgroundColor: setting.background_color,
                borderColor: setting.accent_3,
                color: setting.font_color,
                fontFamily: setting.font_family,
            }}
        >
            <div className='ef1-icons-container'>
                <FontAwesomeIcon
                    alt='Delete Theme'
                    title='Delete Theme'
                    icon='trash-alt'
                    onClick={(e) => deleteThemeHandler(e, setting.id)}
                    style={{ color: setting.font_color }}
                />
                <FontAwesomeIcon
                    id={`cancel-btn-${setting.id}`}
                    data-setting-id={`${setting.id}`}
                    className='invisible'
                    alt='Cancel Changes'
                    type='Cancel Changes'
                    icon='window-close'
                    onClick={() => resetHandler(setting.id)}
                    style={{ color: setting.font_color }}
                />
                <FontAwesomeIcon
                    alt='Copy Theme Data'
                    title='Copy Theme Data'
                    icon='copy'
                    onClick={() => copyThemeData(setting.id)}
                    style={{ color: setting.font_color }}
                />
                {user.active_theme !== setting.id
                    && <FontAwesomeIcon
                        alt='Unselected Theme'
                        title='Unselected Theme'
                        icon='circle'
                        onClick={() => updateActiveTheme(setting.id, 'active_theme')}
                        style={{ color: setting.font_color }}
                    />
                }
                {user.active_theme === setting.id
                    && <FontAwesomeIcon
                        alt='Selected Theme'
                        title='Selected Theme'
                        icon='check-circle'
                        onClick={() => updateActiveTheme(setting.id, 'active_theme')}
                        style={{ color: setting.font_color }}
                    />
                }
                <button
                    id={`lock-btn-${setting.id}`}
                    data-setting-id={`${setting.id}`}
                    data-locked='true'
                >
                    <FontAwesomeIcon
                        id={`lock-${setting.id}`}
                        data-visibility='true'
                        alt='Unlock Theme'
                        title='Unlock Theme'
                        icon='lock'
                        style={{ color: setting.font_color }}
                    />
                    <FontAwesomeIcon
                        id={`lock-open-${setting.id}`}
                        data-visibility='false'
                        alt='Lock Theme'
                        title='Lock Theme'
                        icon='lock-open'
                        style={{ color: setting.font_color }}
                    />
                </button>
            </div>
            <label htmlFor={`theme-name-editor-${idx}`}>Theme Name</label>
            <input
                id={`theme-name-editor-${idx}`}
                type='text'
                name='Theme Name'
                maxLength='50'
                placeholder='50 Characters Max'
                aria-placeholder='50 Characters Max'
                defaultValue={setting.theme_name}
                readOnly
                style={{ fontFamily: setting.font_family }}
            />
            <label htmlFor={`font-size-editor-${idx}`} style={{ fontSize: setting.font_size }}>Font Size</label>
            <select
                id={`font-size-editor-${idx}`}
                name='Font Size'
                disabled
                defaultValue={setting.font_size?.replace('px', '')}
            >
                {fontSizes}
            </select>
            <label htmlFor={`font-family-editor-${idx}`}>Font Family</label>
            <select
                id={`font-family-editor-${idx}`}
                name='Font Family'
                disabled
                defaultValue={setting.font_family?.replace(/,\s/, ' | ')}
            >
                {fontFamilies}
            </select>

            <label htmlFor={`font-color-editor-${idx}`}>Font Color</label>
            <input id={`font-color-editor-${idx}`} name='Font Color' type='color' disabled defaultValue={setting.font_color} />

            <label htmlFor={`bg-color-editor-${idx}`}>Background Color</label>
            <input id={`bg-color-editor-${idx}`} name='Background Color' type='color' disabled defaultValue={setting.background_color} />

            <label htmlFor={`background-media-editor-${idx}`}>{backgroundMedia !== '' ? 'Background Media' : 'Added'}</label>
            <input
                id={`background-media-editor-${idx}`}
                name='Background Media'
                type='file'
                accept='image/png, image/jpg, image/jpeg, image/gif'
                disabled
                onChange={setBackgroundMediaHandler}
            />
            {backgroundMediaLoading && (<span>Loading...</span>)}

            <label htmlFor={`bg-rotate-editor-${idx}`}>Background Rotate</label>
            <input id={`bg-rotate-editor-${idx}`} name='Background Rotate' type='checkbox' disabled defaultChecked={setting.background_rotate} />

            <label htmlFor={`accent-1-color-editor-${idx}`} style={{ color: setting.accent_1 }}>Accent 1</label>
            <input id={`accent-1-color-editor-${idx}`} name='Accent 1' type='color' disabled defaultValue={setting.accent_1} />

            <label htmlFor={`accent-2-color-editor-${idx}`} style={{ color: setting.accent_2 }}>Accent 2</label>
            <input id={`accent-2-color-editor-${idx}`} name='Accent 2' type='color' disabled defaultValue={setting.accent_2} />

            <label htmlFor={`accent-3-color-editor-${idx}`} style={{ color: setting.accent_3 }}>Accent 3</label>
            <input id={`accent-3-color-editor-${idx}`} name='Accent 3' type='color' disabled defaultValue={setting.accent_3} />

        </form>
    ));

    return (
        <>
            {editorThemes}
        </>
    );
};

export default EditThemeForm;
