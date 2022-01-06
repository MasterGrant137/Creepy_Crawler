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
    const [count, setCount] = useState(25);

    let isUser;
    if (user && !user.errors) isUser = true;
    else isUser = false;

    const searchHandler = async (e) => {
        e.preventDefault();

        const search = e.target.children[0].value;
        if (/^\s*$/.test(search)) return;
        setLoading(true);

        await dispatch(createSearchEntry({
            search,
            updatedAt: new Date().toString(),
            user,
        }));
        history.push('/search/results/');
        setLoading(false);
    };

    useEffect(() => {
        if (isUser) dispatch(readUserSettings());
        return null;
    }, [dispatch, user]);

    useEffect(() => {
        if (loading) {
            let countdown = count;
            const timer = setInterval(() => {
                countdown--;
                setCount(countdown);
                if (countdown === 0) {
                    clearInterval(timer);
                    window.location.reload();
                }
            }, 1000);
        }
    }, [loading]);

    if (loading) {
        return (
            <div className='search-page-waiting-container'>
                <div
                    id='search-time-countdown'
                    className='search-time-countdown'
                    value={count}
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
