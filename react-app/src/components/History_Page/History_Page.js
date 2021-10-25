import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { readHistoryEntries, updateHistoryEntry } from '../../store/history_store';
import '../Main.css';
import './History_Page.css';

export const HistoryPage = () => {
    const [updated_at, setUpdatedAt] = useState('');

    const dispatch = useDispatch();
    
    let dayOfWkLink = null;

    const dateRegex = new RegExp([
                                '([A-Z]{1}[a-z]{2}),\\s', //? day of the week
                                '(\\d{2}\\s[A-Z]{1}[a-z]{2}\\s\\d{4})\\s', //? day, month, and year
                                '(\\d{2}:\\d{2}:\\d{2})\\s', //? time
                                '(.*)' //? timezone
                                ].join(''), 'g');

    const abbrevTZRegex = /([A-Z]){1}[-]?[a-z]+\s?/g

    useEffect(() => {
        dispatch(readHistoryEntries())
    }, [dispatch])

    const clickHandler = async (e, entryID) => {
        e.preventDefault();
        await dispatch(updateHistoryEntry({ entryID, updated_at }));
    }

    const entriesObj = useSelector(state => state.history);
   
    const entries = Object.values(entriesObj).map(entry => (
        <div key={entry.id} id={`entry-${entry.id}`}>
            <span id='updated-at-ele'>
                 {function () {
                     const time = entry['updated_at'].replace(dateRegex, '$3');
                     return time;
                    }()}
            </span>
            <span id='timezone-ele'>
                {function () {
                    const abbrevTZ = entry.timezone.replace(dateRegex, '$1').replace(abbrevTZRegex, '$1');
                    const natoTZ = /[A-Z]TZ/;
                    return !natoTZ.test(abbrevTZ) ? abbrevTZ : abbrevTZ[0];
                }()}
            </span>
            <span 
                id='entry-ele'
                onClick={(e) => {
                    setUpdatedAt((new Date()).toString())
                    clickHandler(e, entry.id)
                    }} 
            >
                {entry.search || entry.visit}
            </span>
            <span id='day-of-week-ele'>
                {function () {
                    const dayOfWk = entry['updated_at'].replace(dateRegex, '$1');
                    if (!dayOfWkLink || dayOfWk !== dayOfWkLink) {
                        dayOfWkLink = dayOfWk;
                        return dayOfWkLink;
                    }
                }()}
            </span>
        </div>
    ))

    return (
        <div id='history-page-container'>
             {entries}
        </div>
    )
}
