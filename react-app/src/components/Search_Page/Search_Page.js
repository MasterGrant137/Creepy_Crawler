import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createSearchEntry } from '../../store/search_store';
import { readUserSettings } from '../../store/settings_store';
import '../Main.css';
import './Search_Page.css';

const SearchPage = ({ style }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(15);

  let isUser;
  if (user && !user.errors) isUser = true;
  else isUser = false;

  const searchHandler = async (e) => {
    e.preventDefault();

    const search = e.target.children[0].value;
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
      origin: 'home_search',
      search,
      updatedAt: new Date().toString(),
      user,
    }));
    setLoading(false);
    history.push('/search/results/');
    clearInterval(timer);
  };

  useEffect(() => {
    if (isUser) dispatch(readUserSettings());
    return null;
  }, [dispatch, user]);

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
      <div className='search-page-container'>
          <span className='search-page-title'>Creepy Crawler</span>
          <form onSubmit={searchHandler} className='search-page-search-form'>
              <input
                  type='search'
                  className='search-page-search-input'
                  maxLength='1000'
                  placeholder='Crawl the web.'
                  aria-label='Crawl the web.'
                  style={{ borderColor: style.accent_1, fontFamily: style.font_family }}
                />
          </form>
      </div>
  );
};

export default SearchPage;
