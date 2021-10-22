import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { readHistoryEntries } from '../../store/history_store';
import '../Main.css';
import './History_Page.css';

export const HistoryPage = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(readHistoryEntries())
    }, [dispatch])

    const entriesObj = useSelector(state => state.history);
    const entries = Object.values(entriesObj).map(entry => (
        <div>{entry.search}</div>
    ))

    return (
        <div>
             {entries}
        </div>
    )
}
