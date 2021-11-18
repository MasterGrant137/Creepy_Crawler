import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createHistoryEntry } from '../../store/history_store';
import { readUserSettings } from '../../store/settings_store';
import '../Main.css';
import './Search_Page.css';

const SearchPage = ({ style }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.session.user);
    const [search, setSearch] = useState('');
    const [updatedAt, setUpdatedAt] = useState('');

    let isUser;
    if (user && !user.errors) isUser = true;
    else isUser = false;

    const searchHandler = (e) => {
        e.preventDefault();
        if (/^\s*$/.test(search)) return;
        if (isUser) dispatch(createHistoryEntry({ search, updatedAt }));
    };

    useEffect(() => {
        if (isUser) dispatch(readUserSettings());
        return null;
    }, [dispatch]);

    return (
        <div className='search-page-container'>
            <h1 className='search-page-title'>Creepy Crawler</h1>
            <form onSubmit={searchHandler} className='search-page-search-form'>
                <input
                    type='search'
                    className='search-page-search-input'
                    maxLength='1000'
                    placeholder='Crawl the web.'
                    aria-label='Crawl the web.'
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setUpdatedAt((new Date()).toString());
                    }}
                    value={search}
                    style={{ borderColor: style.accent_1, fontFamily: style.font_family }}
                />
            </form>
        </div>
    );
};

export default SearchPage;
