import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { editProfile } from '../../store/session';
import {
  createSearchEntry,
  readHistoryEntries,
  updateHistoryEntry,
  deleteHistoryEntry,
} from '../../store/search_store';
import { readUserSettings } from '../../store/settings_store';
import '../Main.css';
import './History_Page.css';
import '../Search_Page/Search_Page.css';
import clock12Icon from './icons/12-hour-flaticon.png';
import clock24Icon from './icons/24-hour-flaticon.png';

const HistoryPage = ({ style }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const navigate = useNavigate();
  const entriesObj = useSelector((state) => state.history);
  const clock24 = useSelector((state) => state.session.user.clock_24);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(50);

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

  const searchHandler = async (e) => {
    e.preventDefault();

    const search = e.target.innerText;
    if (/^\s*$/.test(search)) return;
    sessionStorage.searchResults = '';

    setLoading(true);
    let countdown = count - 1;
    const timer = setInterval(() => {
      if (countdown === 0) {
        setCount(countdown);
        clearInterval(timer);
        window.location.reload();
      } else {
        setCount(countdown);
        countdown--;
      }
    }, 1000);

    await dispatch(createSearchEntry({
      origin: 'history_search',
      search,
      updatedAt: new Date().toString(),
      user,
    }));
    setLoading(false);
    navigate('/search/results/');
    clearInterval(timer);
  };

  const copyData = (data) => navigator.clipboard.writeText(data);

  const updateHandler = (e) => {
    dispatch(updateHistoryEntry({
      entryID: e.target.dataset.entryId,
      updatedAt: new Date().toString(),
    }));
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
                {(() => {
                  if (entry.search) {
                    return (
                        <form className='search-page-search-form'>
                            <span
                                data-entry-id={entry.id}
                                className='hist-text'
                                onClick={(e) => {
                                  updateHandler(e);
                                  searchHandler(e);
                                }}
                                style={{
                                  color: style.accent_3,
                                  textDecorationColor: style.accent_2,
                                }}
                                    >{entry.search}</span></form>);
                  }
                  return (
                      <a
                          data-entry-id={entry.id}
                          className='hist-text'
                          href={entry.visit}
                          target='_blank'
                          rel='noopener noreferrer'
                          onClick={updateHandler}
                          style={{
                            color: style.accent_3,
                            textDecorationColor: style.accent_2,
                          }}
                            >{entry.visit}</a>);
                })()}
            </div>
        </div>
    ));

  if (loading) {
    return (
        <div className='search-page-waiting-container'>
            <div
                id='search-time-countdown'
                className='search-time-countdown'
                style={{ color: style.accent_2 }}
                >
                {count}
            </div>
            <FontAwesomeIcon
                className='search-waiting-icon'
                alt='Spinning Loading Compass'
                title='Spinning Loading Compass'
                icon='compass'
                spin
                />
        </div>
    );
  }

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
