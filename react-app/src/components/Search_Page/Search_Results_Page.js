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
  }, [dispatch, user]);

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
              target='_blank'
              rel='noopener noreferrer'
              onClick={visitHandler}
              style={{ color: style.accent_3, textDecorationColor: style.accent_2 }}
            > {result[0]}</a>
          <p style={{ color: style.accent_2 }}>{result[1]}</p>
      </div>
  ));

  const processFullResults = (resObj, action) => {
    if (action === 'save') {
      sessionStorage.searchResults = JSON.stringify(resultsObj);
      return results;
    }
    const res = (Object.values(resObj).map((result, idx) => (
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
                target='_blank'
                rel='noopener noreferrer'
                onClick={visitHandler}
                style={{ color: style.accent_3, textDecorationColor: style.accent_2 }}
                > {result[0]}</a>
            <p style={{ color: style.accent_2 }}>{result[1]}</p>
        </div>
    )));
    return res;
  };

  const processEmptyResults = () => {
    const storedRes = sessionStorage.searchResults;
    if (storedRes) return processFullResults(JSON.parse(storedRes), 'refill');
    return (<span className='fade-in-error'>No results.</span>);
  };

  return (
      <div className='search-results-page-container'>
          <div className='search-results-container' style={{ backgroundColor: style.background_color }}>
              {results.length ? processFullResults(results, 'save') : processEmptyResults()}
          </div>
      </div>
  );
};

export default SearchResultsPage;
