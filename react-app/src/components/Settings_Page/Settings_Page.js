import React, { useState } from 'react';
import '../Main.css';
import './Settings_Page.css';
import dropdownData from './dropdown_data.json';

export const SettingsPage = () => {
    const [dropdown, setDropdown] = useState('invisible');

    const fontSizes = dropdownData['font-sizes'];
    const fonts = dropdownData['fonts'];


    const dropdownHandler = (eType, e) => {
        if (eType === 'onMouseOver') setDropdown('dropdown-1');
        else setDropdown('invisible');
    }

    const fontSizeChoices = fontSizes.map(fontSize => (
        <div key={fontSize} className={dropdown}>{fontSize}</div>
    ))
    const fontChoices = fonts.map(font => (
        <div key={font} className={dropdown}>{font}</div>
    ))

    return (
        <div>
            <h1>Settings</h1>
            <div>
                <h2>Customize Theme</h2>
                <form>
                    <label htmlFor='bg-color-picker'>Background Color</label>
                        <input
                            type='color'
                            name='bg-color-picker'
                        />
                    <label htmlFor='font-color-picker'>Font Color</label>
                        <input
                            type='color'
                            name='font-color-picker'
                        />
                    <div className='dropdown-1-container' onMouseOver={(e) => dropdownHandler('onMouseOver', e)} onMouseOut={(e) => dropdownHandler('onMouseOut', e)}>
                        <span>Font Size</span>
                        {fontSizeChoices}
                    </div>
                    <div className='dropdown-1-container' onMouseOver={(e) => dropdownHandler('onMouseOver', e)} onMouseOut={(e) => dropdownHandler('onMouseOut', e)}>
                        <span>Font</span>
                        {fontChoices}
                    </div>
                </form>
            </div>
        </div>
    )
}
