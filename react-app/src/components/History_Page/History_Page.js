import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { readHistoryEntries, updateHistoryEntry, deleteHistoryEntry } from '../../store/history_store';
import { readUserSettings } from '../../store/settings_store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import '../Main.css';
import './History_Page.css';

export const HistoryPage = ({ style }) => {
    const history = useHistory();
    const dispatch = useDispatch();

    const dateRegex = new RegExp([
                                '([A-Z]{1}[a-z]{2}),\\s', //? day of the week
                                '(\\d{2}\\s[A-Z]{1}[a-z]{2}\\s\\d{4})\\s', //? day, month, and year
                                '(\\d{2}:\\d{2}:\\d{2})\\s', //? time
                                '(.*)' //? time zone
                                ].join(''), 'g');

    const [updated_at, setUpdatedAt] = useState(new Date().toString());

    let dayOfWkLink = null;

    useEffect(() => {
        dispatch(readHistoryEntries());
        dispatch(readUserSettings());
    }, [dispatch])

    const updateHandler =  (e, entryID) => {
        e.preventDefault();
        dispatch(updateHistoryEntry({ entryID, updated_at }));
        history.push('/');
        window.location.reload();
    }
   
    const deleteHandler = (e, entryID) => {
        e.preventDefault();
        dispatch(deleteHistoryEntry(entryID))
    }

    const entriesObj = useSelector(state => state.history);
   
    const entries = Object.values(entriesObj)
        .map(entry => (
        <div key={entry.id} id={`entry-${entry.id}`} className='history-entry-container'>
            <span id='updated-at-ele' className='hist-updated-at'>
                 {function () {
                     const time = entry['updated_at'].replace(dateRegex, '$3');
                     return time;
                    }()}
            </span>
            <span id={`tz-ele-${entry.id}`} className='hist-tz'>
               {entry.tz_abbrev}
            </span>
            <span 
                id={`entry-ele${entry.id}`}
                className='hist-text'
                onClick={(e) => {
                    const date = new Date();
                    setUpdatedAt(date.toString());
                    updateHandler(e, entry.id);
                }} 
            >
                {entry.search || entry.visit}
            </span>
            <span id={`day-of-week-ele${entry.id}`} className='hist-day-of-week'>
                {function () {
                    const dayOfWk = entry['updated_at'].replace(dateRegex, '$1');
                    if (!dayOfWkLink || dayOfWk !== dayOfWkLink) {
                        dayOfWkLink = dayOfWk;
                        return dayOfWkLink;
                    }
                }()}
            </span>
            <FontAwesomeIcon icon={faTrashAlt} onClick={(e) => deleteHandler(e, entry.id)} />
        </div>
    ))

    return (
        <div className='history-page-container'>
             {entries}
        </div>
    )
}
