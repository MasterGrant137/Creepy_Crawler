import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
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

        console.log(user_id, search, updated_at);
        console.log(typeof(updated_at));

        dispatch(createHistoryEntry({ user_id, search, updated_at }));
    }

    return (
        <div>
            <form onSubmit={searchHandler}>
                <input
                    type='text'
                    placeholder='Crawl the web.'
                    aria-label='Crawl the web.'
                    onChange={(e) => {
                        setUserID(user.id)
                        setSearch(e.target.value)
                        setUpdatedAt((new Date()).toString())
                    }}
                />
            </form>
        </div>
    )
}
