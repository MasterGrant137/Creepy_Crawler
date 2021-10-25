import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { readHistoryEntries, updateHistoryEntry } from '../../store/history_store';
import '../Main.css';
import './History_Page.css';

export const HistoryPage = () => {
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
        dispatch(readHistoryEntries())
    }, [dispatch])

    const clickHandler = async (e, entryID) => {
        e.preventDefault();
        dispatch(updateHistoryEntry({ entryID, updated_at }));
    }
   
    const entriesObj = useSelector(state => state.history);
   
    const entries = Object.values(entriesObj)
        .map(entry => (
        <div key={entry.id} id={`entry-${entry.id}`}>
            <span id='updated-at-ele'>
                 {function () {
                     const time = entry['updated_at'].replace(dateRegex, '$3');
                     return time;
                    }()}
            </span>
            <span id={`tz-ele-${entry.id}`}>
               {entry.tz_abbrev}
            </span>
            <span 
                id={`entry-ele${entry.id}`}
                onClick={(e) => {
                    const date = new Date();
                    setUpdatedAt(date.toString());
                    clickHandler(e, entry.id);
                }} 
            >
                {entry.search || entry.visit}
            </span>
            <span id={`day-of-week-ele${entry.id}`}>
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
