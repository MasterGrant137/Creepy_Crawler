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
  const [clicked, setClicked] = useState(false);

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
    unlockedThemes.delete(settingID);
    setUnlockedThemes(unlockedThemes);
    rerender((prv) => !prv);
  };

  const editFormHandler = (e) => {
    e.preventDefault();
    const targForm = e.target;
    const settingID = +targForm.id;
    const formData = new FormData(e.target);

    if (unlockedThemes.has(settingID)) {
      unlockedThemes.delete(settingID);
      setUnlockedThemes(unlockedThemes);

      const backgroundRotate = formData.get('backgroundRotate') === 'on';
      const fontFamily = formData.get('fontFamily').replace(/\s\|\s/, ', ');
      const fontSize = `${formData.get('fontSize')}px`;

      formData.set('backgroundRotate', backgroundRotate);
      formData.set('fontFamily', fontFamily);
      formData.set('fontSize', fontSize);
      formData.set('settingID', settingID);
      formData.set('userID', user.id);

      dispatch(updateUserSetting(settingID, formData));
    } else {
      unlockedThemes.add(settingID);
      setUnlockedThemes(unlockedThemes);
    }
    rerender((prv) => !prv);
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
                  <button
                      type='reset' data-visibility={unlockedThemes.has(setting.id)}
                      onClick={() => resetHandler(setting.id)}
                      style={{ fontSize: style.font_size }}
                    >
                      <FontAwesomeIcon
                          id={`cancel-btn-${setting.id}`}
                          alt='Cancel Changes'
                          type='Cancel Changes'
                          icon='window-close'
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
                  <FontAwesomeIcon
                      alt={user.custom_theme === setting.id ? 'Unselect Theme' : 'Select Theme'}
                      title={user.custom_theme === setting.id ? 'Unselect Theme' : 'Select Theme'}
                      icon={user.custom_theme === setting.id ? 'check-circle' : 'circle'}
                      onClick={() => updateActiveTheme(setting.id, 'custom_theme')}
                      style={{
                        backgroundColor: setting.background_color,
                        color: setting.font_color,
                      }}
                    />
                  <button
                      id={`lock-btn-${setting.id}`}
                      data-locked={!unlockedThemes.has(setting.id)}
                      style={{ fontSize: style.font_size }}
                    >
                      <FontAwesomeIcon
                          id={unlockedThemes.has(setting.id) ? `lock-open-${setting.id}` : `lock-${setting.id}`}
                          alt={unlockedThemes.has(setting.id) ? 'Lock Theme' : 'Unlock Theme'}
                          title={unlockedThemes.has(setting.id) ? 'Lock Theme' : 'Unlock Theme'}
                          icon={unlockedThemes.has(setting.id) ? 'lock-open' : 'lock'}
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
                  name='themeName'
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
                  name='fontSize'
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
                  name='fontFamily'
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
              <input id={`font-color-editor-${idx}`} name='fontColor' type='color' defaultValue={setting.font_color} />

              <label htmlFor={`bg-color-editor-${idx}`}>Background Color</label>
              <input id={`bg-color-editor-${idx}`} name='backgroundColor' type='color' defaultValue={setting.background_color} />
              <div className='background-media-div'>
                  <label htmlFor={`bg-media-editor-${idx}`}>{setting.background_media ? 'Added' : 'Background Media'}</label>
                  <input
                      id={`bg-media-editor-${idx}`}
                      name='backgroundMedia'
                      type='file'
                      accept='image/png, image/jpg, image/jpeg, image/gif'
                    />
              </div>
              <label htmlFor={`bg-rotate-editor-${idx}`}>Background Rotate</label>
              <input
                  id={`bg-rotate-editor-${idx}`}
                  name='backgroundRotate'
                  type='checkbox'
                  defaultChecked={setting.background_rotate}
                  onPointerDown={() => setClicked(setting.id)}
                  onPointerUp={() => setClicked(false)}
                  style={{ cursor: setting.id === clicked ? 'not-allowed' : '' }}
              />
              <label htmlFor={`accent-1-color-editor-${idx}`} style={{ color: setting.accent_1 }}>Accent 1</label>
              <input id={`accent-1-color-editor-${idx}`} name='accent1' type='color' defaultValue={setting.accent_1} />

              <label htmlFor={`accent-2-color-editor-${idx}`} style={{ color: setting.accent_2 }}>Accent 2</label>
              <input id={`accent-2-color-editor-${idx}`} name='accent2' type='color' defaultValue={setting.accent_2} />

              <label htmlFor={`accent-3-color-editor-${idx}`} style={{ color: setting.accent_3 }}>Accent 3</label>
              <input id={`accent-3-color-editor-${idx}`} name='accent3' type='color' defaultValue={setting.accent_3} />
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
