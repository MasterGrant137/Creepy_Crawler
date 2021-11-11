import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { editProfile } from '../../store/session';
import { readHistoryEntries, updateHistoryEntry, deleteHistoryEntry } from '../../store/history_store';
import { readUserSettings } from '../../store/settings_store';
import '../Main.css';
import './History_Page.css';

const HistoryPage = ({ style }) => {
    const history = useHistory();
    const dispatch = useDispatch();

    const dateRegex = new RegExp([
        '([A-Z]{1}[a-z]{2}),\\s', //? day of the week
        '(\\d{2}\\s[A-Z]{1}[a-z]{2}\\s\\d{4})\\s', //? date
        '(\\d{2}:\\d{2}:\\d{2})\\s', //? time
        '(.*)', //? time zone
    ].join(''), 'g');

    const [updatedAt, setUpdatedAt] = useState(new Date().toString());
    const [toggledClock, toggleClock] = useState(true);
    const [clockTypeBtn, setClockTypeBtn] = useState('12-Hour Clock');

    let prevDayOfWk = null;
    // let prevDate = null;

    useEffect(() => {
        dispatch(readHistoryEntries());
        dispatch(readUserSettings());
    }, [dispatch]);

    const updateHandler = (e, entryID) => {
        e.preventDefault();
        dispatch(updateHistoryEntry({ entryID, updatedAt }));
        history.push('/');
        window.location.reload();
    };

    const editProfileHandler = async (e, eType) => {
        if (eType === 'clock_24') {
            await dispatch(editProfile({
                column: eType,
                clock_24: toggledClock,
            }));
            toggleClock((prevClock) => !prevClock);
            setClockTypeBtn(toggledClock ? '12-Hour Clock' : '24-Hour Clock');
        }
    };

    const deleteHandler = (e, entryID) => {
        e.preventDefault();
        dispatch(deleteHistoryEntry(entryID));
    };

    const entriesObj = useSelector((state) => state.history);

    const entries = Object.values(entriesObj)
        .map((entry) => (
            <div
                key={entry.id}
                id={`entry-${entry.id}`}
                className='history-entry-div'
                style={{ backgroundColor: style.background_color }}
            >
                <h2 id={`day-of-week-ele${entry.id}`} className='hist-day-of-week'>
                    {(() => {
                        const dayOfWk = entry.updated_at.replace(dateRegex, '$1');
                        // const date = en
                        if (!prevDayOfWk || dayOfWk !== prevDayOfWk) {
                            prevDayOfWk = dayOfWk;
                            return prevDayOfWk;
                        }
                        return null;
                    })()}
                </h2>
                <span
                    id='updated-at-ele'
                    className='hist-updated-at'
                    style={{ color: style.accent_2 }}
                >
                    {(() => {
                        const date = entry.updated_at.replace(dateRegex, '$2');
                        return date;
                    })()}
                </span>
                <span
                    id={`tz-ele-${entry.id}`}
                    className='hist-tz'
                    style={{ color: style.accent_2 }}
                >
                    {(() => {
                        const time = entry.updated_at.replace(dateRegex, '$3');
                        return time;
                    })()} {entry.tz_abbrev}
                </span>
                <FontAwesomeIcon
                    icon={faTrashAlt}
                    className='hist-delete'
                    onClick={(e) => deleteHandler(e, entry.id)}
                    style={{ color: style.accent_2 }}
                />
                <span
                    id={`entry-ele${entry.id}`}
                    className='hist-text'
                    onClick={(e) => {
                        const date = new Date();
                        setUpdatedAt(date.toString());
                        updateHandler(e, entry.id);
                    }}
                    style={{ color: style.accent_3 }}
                >
                    {entry.search || entry.visit}
                </span>
            </div>
        ));

    return (
        <div className='history-page-container'>
            <button
                onClick={(e) => editProfileHandler(e, 'clock_24')}
                style={{
                    backgroundColor: style.background_color,
                    color: style.font_color,
                }}
            >
                {clockTypeBtn}
            </button>
            {entries}
        </div>
    );
};

export default HistoryPage;
