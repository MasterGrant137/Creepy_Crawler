import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { readHistoryEntries } from '../../store/history_store';
import '../Main.css';
import './History_Page.css';

export const HistoryPage = () => {
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

    const entriesObj = useSelector(state => state.history);
    const entries = Object.values(entriesObj).map(entry => (
        <div key={entry.id} id={`entry-${entry.id}`}>
            <span>
                 {function () {
                     const time = entry['updated_at'].replace(dateRegex, '$3');
                     return time;
                    }()}
            </span>
            <span>
                {function () {
                    const abbrevTZ = entry.timezone.replace(dateRegex, '$1').replace(abbrevTZRegex, '$1');
                    const natoTZ = /[A-Z]TZ/;
                    return !natoTZ.test(abbrevTZ) ? abbrevTZ : abbrevTZ[0];
                }()}
            </span>
            <span>{entry.search || entry.visit}</span>
            <strong>
                {function () {
                    const dayOfWk = entry['updated_at'].replace(dateRegex, '$1');
                    // queueHandler(dayOfWk, entry.id);
                    if (!dayOfWkLink || dayOfWk !== dayOfWkLink) {
                        dayOfWkLink = dayOfWk;
                        return dayOfWkLink;
                    }
                }()}
            </strong>
        </div>
    ))

    return (
        <div id='history-page-container'>
             {entries}
        </div>
    )
}
