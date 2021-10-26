import React, { useState } from 'react';
import '../Main.css';
import './Settings_Page.css';
import dropdownData from './dropdown_data.json';

export const SettingsPage = () => {
    const [fSDropdown, setFSDropdown] = useState('invisible');
    const [fDropdown, setFDropdown] = useState('invisible');

    const fontSizes = dropdownData['font-sizes'];
    const fonts = dropdownData['fonts'];


    const dropdownHandler = (eType, eTarg, e) => {
        if (eType === 'onMouseOver') {
           eTarg === 'FS' ? setFSDropdown('dropdown-1') : setFDropdown('dropdown-1');
        }
        else {
            eTarg === 'FS' ? setFSDropdown('invisible') : setFDropdown('invisible');
        };
    }

    const fontSizeChoices = fontSizes.map(fontSize => (
        <div key={fontSize} className={fSDropdown}>{fontSize}</div>
    ))
    const fontChoices = fonts.map(font => (
        <div key={font} className={fDropdown}>{font}</div>
    ))

    return (
        <div>
            <h1>Settings</h1>
            <div>
                <h2>Customize Theme</h2>
                <form>
                    <div>
                        <label htmlFor='sett-pg-bg-color-picker'>Background Color</label>
                        <input
                            type='color'
                            id='sett-pg-bg-color-picker'
                        />
                    </div>
                    <div>
                        <label htmlFor='sett-pg-font-color-picker'>Font Color</label>
                        <input
                            type='color'
                            id='sett-pg-font-color-picker'
                        />
                    </div>
                    <div 
                        className='dropdown-1-container'
                        onMouseOver={(e) => dropdownHandler('onMouseOver', 'FS', e)}
                        onMouseOut={(e) => dropdownHandler('onMouseOut', 'FS', e)}
                    >
                        <span>Font Size</span>
                        {fontSizeChoices}
                    </div>
                    <div 
                        className='dropdown-1-container'
                        onMouseOver={(e) => dropdownHandler('onMouseOver', 'S', e)}
                        onMouseOut={(e) => dropdownHandler('onMouseOut', 'S', e)}
                    >
                        <span>Font</span>
                        {fontChoices}
                    </div>
                    <button>Submit</button>
                </form>
            </div>
        </div>
    )
}
