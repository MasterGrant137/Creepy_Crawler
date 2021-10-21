import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { createHistoryEntry } from '../../store/history_store';
import '../Main.css';
import './Search_Page.css';

export const SearchPage = () => {
    const dispatch = useDispatch();

    const searchHandler = (e) => {
        e.preventDefault();

        dispatch(createHistoryEntry())
    }

    return (
        <div>
            <form onSubmit={searchHandler}>
                <input type='text' placeholder='Crawl the web.' aria-label='Crawl the web.'/>
            </form>
        </div>
    )
}
