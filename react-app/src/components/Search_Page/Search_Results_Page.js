import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createVisitEntry, readSearchResults } from '../../store/search_store';
import { readUserSettings } from '../../store/settings_store';
import '../Main.css';
import './Search_Page.css';

const SearchResultsPage = ({ style }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.session.user);
    const resultsObj = useSelector((state) => state.searchResults);

    let isUser;
    if (user && !user.errors) isUser = true;
    else isUser = false;

    const visitHandler = async (e) => {
        await dispatch(createVisitEntry({
            visit: e.target.href,
            updatedAt: new Date().toString(),
            user,
        }));
    };

    useEffect(() => {
        dispatch(readSearchResults());
        if (isUser) dispatch(readUserSettings());
        return null;
    }, [dispatch]);

    const results = Object.values(resultsObj).map((result, idx) => (
        <div
            key={idx}
            className='search-result-div'
            style={{
                borderColor: style.accent_1,
                marginBottom: style.font_size,
            }}
        >
            <a
                href={result[0]}
                onClick={(e) => visitHandler(e)}
                style={{
                    color: style.accent_2,
                    textDecorationColor: style.accent_1,
                }}
            >
                {result[0]}
            </a>
            <p style={{ color: style.accent_3 }}>{result[1]}</p>
        </div>
    ));

    return (
        <div className='search-results-page-container' style={{ backgroundColor: style.background_color }}>
            {results}
        </div>
    );
};

export default SearchResultsPage;
