import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { readUserSettings } from '../../store/settings_store';
import { readSearchResults } from '../../store/search_store';
import '../Main.css';
import './Search_Page.css';

const SearchResultsPage = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.session.user);
    const resultsObj = useSelector((state) => state.searchResults);

    let isUser;
    if (user && !user.errors) isUser = true;
    else isUser = false;

    useEffect(() => {
        dispatch(readSearchResults());
        if (isUser) dispatch(readUserSettings());
        return null;
    }, [dispatch]);

    const results = Object.values(resultsObj).map((result, idx) => (
        <div key={idx}>
            <a>{result[0]}</a>
            <p>{result[1]}</p>
        </div>
    ));

    Object.values(resultsObj).map((result) => console.log(result[0]));

    return (
        <div>
            {results}
        </div>
    );
};

export default SearchResultsPage;
