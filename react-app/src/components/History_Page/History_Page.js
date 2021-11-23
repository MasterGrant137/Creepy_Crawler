import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { editProfile } from '../../store/session';
import { readHistoryEntries, updateHistoryEntry, deleteHistoryEntry } from '../../store/search_store';
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

    window.onbeforeunload = (e) => {
        e.returnValue = '';
        history.push('/');
        sessionStorage.setItem('refresh', 'true');
    };

    if (sessionStorage.refresh === 'true') {
        history.push('/');
        sessionStorage.refresh = 'false';
    }

    useEffect(() => {
        dispatch(readHistoryEntries());
        dispatch(readUserSettings());
    }, [dispatch]);

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

    const updateHandler = async (e) => {
        e.preventDefault();
        await dispatch(updateHistoryEntry({
            entryID: e.target.dataset.entryId,
            updatedAt: new Date().toString(),
        }));
        // if (data) history.push('api/history/results/');
    };

    const editProfileHandler = (eType) => {
        if (eType === 'clock_24') {
            if (clock24 === true) toggledClock = false;
            else toggledClock = true;
            dispatch(editProfile({
                clock_24: toggledClock,
                column: eType,
            }));
        }
    };

    const deleteHandler = (entryID) => dispatch(deleteHistoryEntry(entryID));

    const entries = Object.values(entriesObj)
        .map((entry) => (
            <div
                key={`key-${entry.id}`}
                id={entry.id}
                className='history-entry-div'
                style={{ backgroundColor: style.background_color }}
            >
                <div className='hist-day-of-week-div'>
                    <h2 className='hist-day-of-week'>
                        {(() => {
                            const dayOfWk = entry.updated_at.replace(dateRegex, '$1');
                            const date = entry.updated_at.replace(dateRegex, '$2');
                            if ((!prevDayOfWk || prevDayOfWk !== dayOfWk) && (prevDate !== date)) {
                                prevDayOfWk = dayOfWk;
                                prevDate = date;
                                return prevDayOfWk;
                            } if ((!prevDayOfWk || prevDayOfWk === dayOfWk)
                                && (prevDate !== date)) {
                                prevDayOfWk = dayOfWk;
                                prevDate = date;
                                return prevDayOfWk;
                            }
                            return null;
                        })()}
                    </h2>
                </div>
                <div className='hist-date-div'>
                    <span
                        className='copy'
                        onClick={(e) => copyData(e.target.innerText)}
                        style={{ color: style.accent_2 }}
                    >
                        {(() => {
                            const date = entry.updated_at.replace(dateRegex, '$2');
                            return date;
                        })()}
                    </span>
                </div>
                <div className='hist-time-and-tz-div'>
                    <span
                        className='copy'
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
                </div>
                <div className='hist-delete-div'>
                    <FontAwesomeIcon
                        className='hist-delete'
                        alt='Delete Entry'
                        title='Delete Entry'
                        icon='trash-alt'
                        onClick={() => deleteHandler(entry.id)}
                        style={{ color: style.accent_2 }}
                    />
                </div>
                <div className='hist-text-div'>
                    <span
                        data-entry-id={entry.id}
                        className='hist-text'
                        onClick={updateHandler}
                        style={{ color: style.accent_3 }}
                    >
                        {entry.search || entry.visit}
                    </span>
                </div>
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
                style={{ backgroundColor: style.accent_2 }}
            />
            {entries}
        </div>
    );
};

export default HistoryPage;
