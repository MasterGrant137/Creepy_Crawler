import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { createSearchEntry } from '../../store/search_store';
import { readUserSettings } from '../../store/settings_store';
import '../Main.css';
import './Search_Page.css';

const SearchPage = ({ style }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.session.user);

    let isUser;
    if (user && !user.errors) isUser = true;
    else isUser = false;

    const searchHandler = async (e) => {
        e.preventDefault();

        const search = e.target.children[0].value;
        if (/^\s*$/.test(search)) return;
        await dispatch(createSearchEntry({
            search,
            updatedAt: new Date().toString(),
            user,
        }));
        history.push('/api/search/results/');
    };

    useEffect(() => {
        if (isUser) dispatch(readUserSettings());
        return null;
    }, [dispatch]);

    return (
        <div className='search-page-container'>
            <h1 className='search-page-title'>Creepy Crawler</h1>
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
