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
      <option key={fontFamily}>
          {fontFamily}
      </option>
  ));

  const fontSizesRaw = dropdownData['font-sizes'];
  const fontSizes = fontSizesRaw.map((fontSize) => (
      <option key={fontSize}>
          {fontSize}
      </option>
  ));

  const [accent1, setAccent1] = useState(style.accent_1);
  const [accent2, setAccent2] = useState(style.accent_2);
  const [accent3, setAccent3] = useState(style.accent_3);
  const [backgroundColor, setBackgroundColor] = useState(style.background_color);
  // const [backgroundMedia, setBackgroundMedia] = useState(style.background_media);
  const [backgroundRotate, setBackgroundRotate] = useState(style.background_rotate);
  const [fontFamily, setFontFamily] = useState(style.font_family);
  const [fontSize, setFontSize] = useState(style.font_size);
  const [fontColor, setFontColor] = useState(style.font_color);
  const [themeLimitErr, setThmLmtErr] = useState(false);
  const [themeName, setThemeName] = useState('');

  const errorHandler = (e) => {
    const remove = e.type === 'mouseout';
    if (remove) setThmLmtErr(false);
    else if (!remove && user.theme_count >= 10) setThmLmtErr(true);
  };

  const resetHandler = () => {
    setThemeName('');
    setBackgroundColor(style.background_color);
    // setBackgroundMedia('');
    document.getElementById('sf2-background-media').value = '';
    setBackgroundRotate(style.background_rotate);
    setFontColor(style.font_color);
    setFontFamily(style.font_family);
    setFontSize(style.font_size);
    setAccent1(style.accent_1);
    setAccent2(style.accent_2);
    setAccent3(style.accent_3);
  };

  // const setBackgroundMediaHandler = (e) => {
  //   const file = e.target.files[0];
  //   if (file) setBackgroundMedia(file);
  // };

  const incrementThemeCount = (eType, operation) => {
    dispatch(editProfile({
      column: eType,
      operation,
    }));
  };

  const createSettingHandler = (e) => {
    e.preventDefault();

    if (user.theme_count < 10) {
      const formData = new FormData(e.target);

      const bgRotate = formData.get('backgroundRotate') === 'on';
      const fntFamily = formData.get('fontFamily').replace(/\s\|\s/, ', ');
      const fntSize = `${formData.get('fontSize')}px`;

      formData.set('backgroundRotate', bgRotate);
      formData.set('fontFamily', fntFamily);
      formData.set('fontSize', fntSize);
      formData.set('userID', user.id);

      dispatch(createUserSetting(formData));
      resetHandler(e);
      incrementThemeCount('theme_count', 'increment');
    } else {
      setThmLmtErr(true);
      setTimeout(() => setThmLmtErr(false), 3000);
    }
  };

  return (
      <>
          <form
              className='setter-form-2'
              onSubmit={createSettingHandler}
              style={{
                backgroundColor: style.background_color,
                borderColor: style.accent_3,
              }}
            >
              <fieldset className='sf2-fieldset'>
                  <legend>
                      <FontAwesomeIcon
                          alt='Refresh Form'
                          title='Refresh Form'
                          icon='sync'
                          onClick={(e) => resetHandler(e)}
                          style={{
                            color: style.font_color,
                            fontFamily: style.font_family,
                            fontSize: style.font_size,
                          }}
                        />
                      <strong
                          style={{
                            color: style.accent_2,
                            borderColor: style.accent_1,
                          }}
                        >
                          Create Theme
                      </strong>
                      <span className={`${themeLimitErr ? 'fade-in-out-error' : 'invisible'}`}>
                          Theme limit reached.
                      </span>
                      <button className={`${submitBtn ? '' : 'not-allowed'}`}>
                          <FontAwesomeIcon
                              className={`${submitBtn ? '' : 'not-allowed'}`}
                              alt='Add Theme'
                              title='Add Theme'
                              icon='plus-square'
                              style={{
                                color: style.font_color,
                                fontFamily: style.font_family,
                                fontSize: style.font_size,
                              }}
                            />
                      </button>
                  </legend>
                  <div className='sf2-row-a'>
                      <div className='theme-name-setter-div'>
                          <label htmlFor='theme-name-setter'>Theme Name</label>
                          <input
                              id='theme-name-setter'
                              name='themeName'
                              type='text'
                              maxLength='50'
                              placeholder='50 Characters Max'
                              aria-placeholder='50 Characters Max'
                              value={themeName}
                              onChange={(e) => setThemeName(e.target.value)}
                              onClick={errorHandler}
                              onMouseOut={errorHandler}
                              style={{
                                backgroundColor: style.background_color,
                                color: style.font_color,
                                fontFamily: style.font_family,
                              }}
                            />
                      </div>
                      <div className='font-size-setter-div'>
                          <label htmlFor='font-size-setter'>Font Size</label>
                          <select
                              id='font-size-setter'
                              name='fontSize'
                              value={fontSize?.replace('px', '')}
                              onChange={(e) => {
                                const trgKids = e.target.children;
                                const targOpt = Array.from(trgKids).find((opt) => opt.selected);
                                setFontSize(`${targOpt.value}px`);
                              }}
                              onClick={errorHandler}
                              onMouseOut={errorHandler}
                              style={{
                                backgroundColor: style.background_color,
                                color: style.font_color,
                                fontFamily: style.font_family,
                              }}
                            >
                              {fontSizes}
                          </select>
                      </div>
                      <div className='font-family-setter-div'>
                          <label htmlFor='font-family-setter'>Font Family</label>
                          <select
                              id='font-family-setter'
                              name='fontFamily'
                              value={fontFamily?.replace(/,\s/, ' | ')}
                              onChange={(e) => {
                                const trgKids = e.target.children;
                                const targOpt = Array.from(trgKids).find((opt) => opt.selected);
                                setFontFamily(targOpt.value.replace(/\s\|\s/, ', '));
                              }}
                              onClick={errorHandler}
                              onMouseOut={errorHandler}
                              style={{
                                backgroundColor: style.background_color,
                                color: style.font_color,
                                fontFamily: style.font_family,
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
                              name='fontColor'
                              type='color'
                              value={fontColor}
                              onChange={(e) => setFontColor(e.target.value)}
                              onClick={errorHandler}
                              onMouseOut={errorHandler}
                            />
                      </div>
                      <div className='accent-1-setter-div'>
                          <label htmlFor='sf2-accent-1-color'>Accent 1</label>
                          <input
                              id='sf2-accent-1-color'
                              name='accent1'
                              type='color'
                              value={accent1}
                              onChange={(e) => setAccent1(e.target.value)}
                              onClick={errorHandler}
                              onMouseOut={errorHandler}
                            />
                      </div>
                      <div className='accent-2-setter-div'>
                          <label htmlFor='sf2-accent-2-color'>Accent 2</label>
                          <input
                              id='sf2-accent-2-color'
                              name='accent2'
                              type='color'
                              value={accent2}
                              onChange={(e) => setAccent2(e.target.value)}
                              onClick={errorHandler}
                              onMouseOut={errorHandler}
                            />
                      </div>
                      <div className='accent-3-setter-div'>
                          <label htmlFor='sf2-accent-3-color'>Accent 3</label>
                          <input
                              id='sf2-accent-3-color'
                              name='accent3'
                              type='color'
                              value={accent3}
                              onChange={(e) => setAccent3(e.target.value)}
                              onClick={errorHandler}
                              onMouseOut={errorHandler}
                            />
                      </div>
                      <div className='background-color-setter-div'>
                          <label htmlFor='sf2-bg-color'>Background Color</label>
                          <input
                              id='sf2-bg-color'
                              name='backgroundColor'
                              type='color'
                              value={backgroundColor}
                              onChange={(e) => { setBackgroundColor(e.target.value); }}
                              onClick={errorHandler}
                              onMouseOut={errorHandler}
                            />
                      </div>
                  </div>
                  <div className='sf2-row-c'>
                      <div>
                          <label htmlFor='sf2-background-media'>
                              {!fileInput.current?.value ? 'Background Media' : 'Added'}
                          </label>
                          <input
                              id='sf2-background-media'
                              ref={fileInput}
                              name='backgroundMedia'
                              type='file'
                              accept='image/png, image/jpg, image/jpeg, image/gif'
                              // onChange={setBackgroundMediaHandler}
                              onClick={errorHandler}
                              onMouseOut={errorHandler}
                            />
                      </div>
                      <div className='background-rotate-setter-div'>
                          <label htmlFor='sf2-bg-rotate'>Background Rotate</label>
                          <input
                              id='sf2-bg-rotate'
                              name='backgroundRotate'
                              type='checkbox'
                              checked={backgroundRotate}
                              onChange={(e) => setBackgroundRotate(e.target.checked)}
                              onClick={errorHandler}
                              onMouseOut={errorHandler}
                            />
                      </div>
                  </div>
              </fieldset>
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
              <h2 className='theme-tester-header' style={{ color: accent2, borderColor: accent1 }}>
                  {themeName || 'Demo Theme'}
              </h2>
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
