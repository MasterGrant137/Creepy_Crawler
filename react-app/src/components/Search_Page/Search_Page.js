import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createHistoryEntry } from '../../store/history_store';
import '../Main.css';
import './Search_Page.css';

export const SearchPage = () => {
    const [user_id, setUserID] = useState();
    const [search, setSearch] = useState('');
    const [updated_at, setUpdatedAt] = useState('');

    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user);

    const searchHandler = (e) => {
        e.preventDefault();
        dispatch(createHistoryEntry({ user_id, search, updated_at }));
        window.location.reload();
    }

    return (
        <div>
            <h1>Creepy Crawler</h1>
            <form onSubmit={searchHandler}>
                <input
                    type='text'
                    placeholder='Crawl the web.'
                    aria-label='Crawl the web.'
                    onChange={(e) => {
                        if (user) setUserID(user.id)
                        setSearch(e.target.value)
                        setUpdatedAt((new Date()).toString())
                    }}
                />
            </form>
        </div>
    )
}
