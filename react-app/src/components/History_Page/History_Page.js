import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { editProfile } from '../../store/session';
import { readHistoryEntries, updateHistoryEntry, deleteHistoryEntry } from '../../store/history_store';
import { readUserSettings } from '../../store/settings_store';
import '../Main.css';
import './History_Page.css';
import clock12Icon from './icons/12-hour-flaticon.png';
import clock24Icon from './icons/24-hour-flaticon.png';

const HistoryPage = ({ style }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const entriesObj = useSelector((state) => state.history);
    const clock24 = useSelector((state) => state.session.user.clock_24);

    useEffect(() => {
        dispatch(readHistoryEntries());
        dispatch(readUserSettings());
    }, [dispatch]);

    const [updatedAt, setUpdatedAt] = useState(new Date().toString());
    // const [toggledClock, toggleClock] = useState(clock24);
    let toggledClock = clock24;

    const dateRegex = new RegExp([
        '([A-Z]{1}[a-z]{2}),\\s', //? day of the week
        '(\\d{2}\\s[A-Z]{1}[a-z]{2}\\s\\d{4})\\s', //? date
        '(\\d{2}:\\d{2}:\\d{2})\\s', //? time
        '(.*)', //? time zone
    ].join(''), 'g');

    let prevDayOfWk = null;
    let prevDate = null;

    const copyData = (data) => navigator.clipboard.writeText(data);

    const updateHandler = async (e, entryID) => {
        e.preventDefault();
        const data = await dispatch(updateHistoryEntry({ entryID, updatedAt }));
        if (data) history.push('/');
    };

    const editProfileHandler = (eType) => {
        if (eType === 'clock_24') {
            // toggleClock((prevClock) => !prevClock);
            // if (clock24 === true) {
            //     console.log('BEFORE IF', toggledClock);
            //     toggleClock(false);
            //     console.log('AFTER IF', toggledClock);
            // } else {
            //     console.log('BEFORE ELSE', toggledClock);
            //     toggleClock(true);
            //     console.log('AFTER ELSE', toggledClock);
            // }
            if (clock24 === true) {
                console.log('BEFORE IF', toggledClock);
                toggledClock = false;
                console.log('AFTER IF', toggledClock);
            } else {
                console.log('BEFORE ELSE', toggledClock);
                toggledClock = true;
                console.log('AFTER ELSE', toggledClock);
            }
            dispatch(editProfile({
                clock_24: toggledClock,
                column: eType,
            }));
        }
    };

    const deleteHandler = (e, entryID) => {
        e.preventDefault();
        dispatch(deleteHistoryEntry(entryID));
    };

    const entries = Object.values(entriesObj)
        .map((entry) => (
            <div
                key={entry.id}
                id={`entry-${entry.id}`}
                className='history-entry-div'
                style={{ backgroundColor: style.background_color }}
            >
                <h2 className='hist-day-of-week'>
                    {(() => {
                        const dayOfWk = entry.updated_at.replace(dateRegex, '$1');
                        const date = entry.updated_at.replace(dateRegex, '$2');
                        if ((!prevDayOfWk || prevDayOfWk !== dayOfWk) && (prevDate !== date)) {
                            prevDayOfWk = dayOfWk;
                            prevDate = date;
                            return prevDayOfWk;
                        } if ((!prevDayOfWk || prevDayOfWk === dayOfWk) && (prevDate !== date)) {
                            prevDayOfWk = dayOfWk;
                            prevDate = date;
                            return prevDayOfWk;
                        }
                        return null;
                    })()}
                </h2>
                <span
                    className='hist-date'
                    onClick={(e) => copyData(e.target.innerText)}
                    style={{ color: style.accent_2 }}
                >
                    {(() => {
                        const date = entry.updated_at.replace(dateRegex, '$2');
                        return date;
                    })()}
                </span>
                <span
                    className='hist-time-and-tz'
                    onClick={(e) => copyData(`${e.target.innerText} (${entry.tz})`)}
                    style={{ color: style.accent_2 }}
                >
                    {(() => {
                        const time = entry.updated_at.replace(dateRegex, '$3');
                        if (clock24) return time;

                        const hour = +`${time[0]}${time[1]}`;
                        const minutes = `${time[3]}${time[4]}`;
                        const seconds = `${time[6]}${time[7]}`;
                        if (hour > 12) return `${hour - 12}:${minutes}:${seconds} PM`;
                        if (hour === 0o00) return `${hour + 12}:${minutes}:${seconds} AM`;
                        return `${hour}:${minutes}:${seconds} AM`;
                    })()} {entry.tz_abbrev}
                </span>
                <FontAwesomeIcon
                    className='hist-delete'
                    alt='Delete Entry'
                    title='Delete Entry'
                    icon='trash-alt'
                    onClick={(e) => deleteHandler(e, entry.id)}
                    style={{ color: style.accent_2 }}
                />
                <span
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
            <img
                className='history-clock-image'
                alt={`Convert to ${clock24 ? '12-Hour' : '24-Hour'} Time`}
                title={`Convert to ${clock24 ? '12-Hour' : '24-Hour'} Time`}
                src={clock24 ? clock12Icon : clock24Icon}
                onClick={() => editProfileHandler('clock_24')}
                style={{ backgroundColor: 'white' }}
            />
            {entries}
        </div>
    );
};

export default HistoryPage;
