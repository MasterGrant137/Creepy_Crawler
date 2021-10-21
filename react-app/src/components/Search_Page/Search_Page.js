import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { createHistoryEntry } from '../../store/history_store';
import '../Main.css';
import './Search_Page.css';

export const SearchPage = () => {
    const [userID, setUserID] = useState();
    const [search, setSearch] = useState('');
    const [updatedAt, setUpdateAt] = useState('');

    const dispatch = useDispatch();

    const user = useSelector(state => state.session.user);

    const searchHandler = (e) => {
        e.preventDefault();
        // dispatch(createHistoryEntry())
        // console.log(e.target);

        // dispatch(createHistoryEntry())
    }

    return (
        <div>
            <form onSubmit={searchHandler}>
                <input
                    type='text'
                    placeholder='Crawl the web.'
                    aria-label='Crawl the web.'
                    onChange={(e) => {
                        // setUserID(user.id)
                        // setSearch(e.target.value)
                        console.log(new Date());
                    }}
                />
            </form>
        </div>
    )
}
