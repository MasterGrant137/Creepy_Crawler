import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { editProfile } from '../../store/session';
import { updateUserSetting, deleteUserSetting } from '../../store/settings_store';
import dropdownData from './dropdown_data.json';

const EditThemeForm = ({ style }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const settingsObj = useSelector((state) => state.settings);

  const [render, rerender] = useState(false);
  const [unlockedThemes, setUnlockedThemes] = useState(new Set());
  const [backgroundMedia, setBackgroundMedia] = useState(style.background_media);
  const [backgroundMediaLoading, setBackgroundMediaLoading] = useState(false);

  useEffect(() => {}, [render]);

  const fontFamiliesRaw = dropdownData.fonts;
  const fontFamilies = fontFamiliesRaw.map((fontFamily) => (
      <option key={fontFamily}>{fontFamily}</option>
  ));

  const fontSizesRaw = dropdownData['font-sizes'];
  const fontSizes = fontSizesRaw.map((fontSize) => (
      <option key={fontSize}>{fontSize}</option>
  ));

  const resetHandler = (settingID) => {
    console.log('hit', settingID);
    unlockedThemes.delete(settingID);
    setUnlockedThemes(unlockedThemes);
    rerender((prv) => !prv);
  };

  const setBackgroundMediaHandler = (e) => {
    const file = e.target.files[0];
    if (file) setBackgroundMedia(file);
  };

  const editFormHandler = async (e) => {
    e.preventDefault();
    const targForm = e.target;
    const targFieldsetKids = Array.from(targForm.children[0].children);
    const settingID = +targForm.id;
    const formData = new FormData();
    if (!unlockedThemes.has(settingID)) {
      unlockedThemes.add(settingID);
      setUnlockedThemes(unlockedThemes);
      rerender((prv) => !prv);
    } else if (unlockedThemes.has(settingID)) {
      unlockedThemes.delete(settingID);
      setUnlockedThemes(unlockedThemes);
      rerender((prv) => !prv);
      targFieldsetKids.forEach((targKid) => {
        if (targKid.dataset.type === 'bg-media-editor-div') {
          const mediaInput = targKid.children[1];
          formData.append('backgroundMedia', backgroundMedia);
          setBackgroundMediaLoading(true);
          mediaInput.value = '';
        }

        formData.append('settingID', settingID);
        formData.append('userID', user.id);

        if (targKid.tagName !== 'BUTTON') {
          switch (targKid.name) {
            case 'Theme Name': formData.append('themeName', targKid.value); break;
            case 'Background Color': formData.append('backgroundColor', targKid.value); break;
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
      if (entry[0] === 'background_rotate') {
        const formattedEntry = `${'\t'}"${entry[0]}": ${entry[1]}`;
        entriesFormatted.push(formattedEntry);
      } else {
        const formattedEntry = `${'\t'}"${entry[0]}": "${entry[1]}"`;
        entriesFormatted.push(formattedEntry);
      }
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
        >
          <fieldset
              className='ef1-fieldset'
              disabled={!unlockedThemes.has(setting.id)}
              style={{
                backgroundImage: `url(${setting.background_media})`,
                backgroundColor: setting.background_color,
                borderColor: setting.accent_3,
                color: setting.font_color,
                fontFamily: setting.font_family,
              }}
            >
              <legend className='ef1-icons-legend'>
                  <FontAwesomeIcon
                      alt='Delete Theme'
                      title='Delete Theme'
                      icon='trash-alt'
                      onClick={(e) => deleteThemeHandler(e, setting.id)}
                      style={{
                        backgroundColor: setting.background_color,
                        color: setting.font_color,
                      }}
                    />
                  <button type='reset'>
                      <FontAwesomeIcon
                          id={`cancel-btn-${setting.id}`}
                          data-visibility={unlockedThemes.has(setting.id)}
                          alt='Cancel Changes'
                          type='Cancel Changes'
                          icon='window-close'
                          onClick={() => resetHandler(setting.id)}
                          style={{
                            backgroundColor: setting.background_color,
                            color: setting.font_color,
                          }}
                        />
                  </button>
                  <FontAwesomeIcon
                      alt='Copy Theme Data'
                      title='Copy Theme Data'
                      icon='copy'
                      onClick={() => copyThemeData(setting.id)}
                      style={{
                        backgroundColor: setting.background_color,
                        color: setting.font_color,
                      }}
                    />
                  {user.custom_theme !== setting.id
                        && <FontAwesomeIcon
                            alt='Select Theme'
                            title='Select Theme'
                            icon='circle'
                            onClick={() => updateActiveTheme(setting.id, 'custom_theme')}
                            style={{
                              backgroundColor: setting.background_color,
                              color: setting.font_color,
                            }}
                        />
                    }
                  {user.custom_theme === setting.id
                        && <FontAwesomeIcon
                            alt='Unselect Theme'
                            title='Unselect Theme'
                            icon='check-circle'
                            onClick={() => updateActiveTheme(setting.id, 'custom_theme')}
                            style={{
                              backgroundColor: setting.background_color,
                              color: setting.font_color,
                            }}
                        />
                    }
                  <button
                      id={`lock-btn-${setting.id}`}
                      data-locked={!unlockedThemes.has(setting.id)}
                    >
                      <FontAwesomeIcon
                          id={`lock-${setting.id}`}
                          data-visibility={!unlockedThemes.has(setting.id)}
                          alt='Unlock Theme'
                          title='Unlock Theme'
                          icon='lock'
                          style={{
                            backgroundColor: setting.background_color,
                            color: setting.font_color,
                          }}
                        />
                      <FontAwesomeIcon
                          id={`lock-open-${setting.id}`}
                          data-visibility={unlockedThemes.has(setting.id)}
                          alt='Lock Theme'
                          title='Lock Theme'
                          icon='lock-open'
                          style={{
                            backgroundColor: setting.background_color,
                            color: setting.font_color,
                          }}
                        />
                  </button>
              </legend>
              <label htmlFor={`theme-name-editor-${idx}`}>Theme Name</label>
              <input
                  id={`theme-name-editor-${idx}`}
                  type='text'
                  name='Theme Name'
                  maxLength='50'
                  placeholder='50 Characters Max'
                  aria-placeholder='50 Characters Max'
                  defaultValue={setting.theme_name}
                  style={{
                    backgroundColor: setting.background_color,
                    color: setting.font_color,
                    fontFamily: setting.font_family,
                  }}
                />
              <label htmlFor={`font-size-editor-${idx}`} style={{ fontSize: setting.font_size }}>Font Size</label>
              <select
                  id={`font-size-editor-${idx}`}
                  name='Font Size'
                  defaultValue={setting.font_size?.replace('px', '')}
                  style={{
                    backgroundColor: setting.background_color,
                    color: setting.font_color,
                    fontFamily: setting.font_family,
                  }}
                >
                  {fontSizes}
              </select>
              <label htmlFor={`font-family-editor-${idx}`}>Font Family</label>
              <select
                  id={`font-family-editor-${idx}`}
                  name='Font Family'
                  defaultValue={setting.font_family?.replace(/,\s/, ' | ')}
                  style={{
                    backgroundColor: setting.background_color,
                    color: setting.font_color,
                    fontFamily: setting.font_family,
                  }}
                >
                  {fontFamilies}
              </select>

              <label htmlFor={`font-color-editor-${idx}`}>Font Color</label>
              <input id={`font-color-editor-${idx}`} name='Font Color' type='color' defaultValue={setting.font_color} />

              <label htmlFor={`bg-color-editor-${idx}`}>Background Color</label>
              <input id={`bg-color-editor-${idx}`} name='Background Color' type='color' defaultValue={setting.background_color} />

              <div data-type='bg-media-editor-div'>
                  <label htmlFor={`bg-media-editor-${idx}`}>{backgroundMedia !== '' ? 'Background Media' : 'Added'}</label>
                  <input
                      id={`bg-media-editor-${idx}`}
                      name='Background Media'
                      type='file'
                      accept='image/png, image/jpg, image/jpeg, image/gif'
                      onChange={setBackgroundMediaHandler}
                    />
                  {backgroundMediaLoading && (<span>Loading...</span>)}
              </div>

              <label htmlFor={`bg-rotate-editor-${idx}`}>Background Rotate</label>
              <input id={`bg-rotate-editor-${idx}`} name='Background Rotate' type='checkbox' defaultChecked={setting.background_rotate} />

              <label htmlFor={`accent-1-color-editor-${idx}`} style={{ color: setting.accent_1 }}>Accent 1</label>
              <input id={`accent-1-color-editor-${idx}`} name='Accent 1' type='color' defaultValue={setting.accent_1} />

              <label htmlFor={`accent-2-color-editor-${idx}`} style={{ color: setting.accent_2 }}>Accent 2</label>
              <input id={`accent-2-color-editor-${idx}`} name='Accent 2' type='color' defaultValue={setting.accent_2} />

              <label htmlFor={`accent-3-color-editor-${idx}`} style={{ color: setting.accent_3 }}>Accent 3</label>
              <input id={`accent-3-color-editor-${idx}`} name='Accent 3' type='color' defaultValue={setting.accent_3} />
          </fieldset>
      </form>
  ));

  return (
      <>
          {editorThemes}
      </>
  );
};

export default EditThemeForm;
