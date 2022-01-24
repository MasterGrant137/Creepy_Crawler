//$ types
const CRUD_SEARCH = 'search_store/CREATE_SEARCH';
const READ_SEARCH_RESULTS = 'search_store/READ_SEARCH_RESULTS';

//$ action creators
const crudSearch = (entries) => ({
  type: CRUD_SEARCH,
  payload: entries,
});

const readResults = (results) => ({
  type: READ_SEARCH_RESULTS,
  payload: results,
});

//$ thunks
export const createSearchEntry = (entry) => async (dispatch) => {
  const response = await fetch('/api/search/history/searches/', {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify(entry),
    user: entry.user,
  });
  const data = await response.json();
  if (response.ok) {
    await dispatch(crudSearch(data));
    return data;
  }
  if (data.errors[0] === 'The CSRF token has expired.'
        || response.status === 500 || response.status === 503) {
    window.location.reload();
    return null;
  }
  alert(data.errors);
  return null;
};

export const createVisitEntry = (entry) => async (dispatch) => {
  const response = await fetch('/api/search/history/visits/', {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify(entry),
    user: entry.user,
  });
  const data = await response.json();
  if (response.ok) {
    await dispatch(crudSearch(data));
    return data;
  }
  if (data.errors[0] === 'The CSRF token has expired.'
        || response.status === 500 || response.status === 503) {
    window.location.reload();
    return null;
  }
  alert(data.errors);
  return null;
};

export const readHistoryEntries = () => async (dispatch) => {
  const response = await fetch('/api/search/history/');
  if (response.ok) {
    const entries = await response.json();
    await dispatch(crudSearch(entries));
    return entries;
  }
  return null;
};

export const readSearchResults = () => async (dispatch) => {
  const response = await fetch('/api/search/results/');
  if (response.ok) {
    const results = await response.json();
    await dispatch(readResults(results));
    return results;
  }
  return null;
};

export const updateHistoryEntry = (entry) => async (dispatch) => {
  const response = await fetch(`/api/search/history/${entry.entryID}`, {
    headers: { 'Content-Type': 'application/json' },
    method: 'PATCH',
    body: JSON.stringify({
      updatedAt: entry.updatedAt,
    }),
  });
  const data = await response.json();
  if (response.ok) {
    await dispatch(crudSearch(data));
    return data;
  }
  if (data.errors[0] === 'The CSRF token has expired.'
        || response.status === 500 || response.status === 503) {
    window.location.reload();
    return null;
  }
  alert(data.errors);
  return null;
};

export const deleteHistoryEntry = (entryID) => async (dispatch) => {
  const response = await fetch(`/api/search/history/${entryID}`, {
    method: 'DELETE',
  });
  const data = await response.json();
  if (response.ok) {
    await dispatch(crudSearch(data));
    return data;
  }
  if (data.errors[0] === 'The CSRF token has expired.'
        || response.status === 500 || response.status === 503) {
    window.location.reload();
    return null;
  }
  alert(data.errors);
  return null;
};

//$ reducers
const initialState = {};

export const historyReducer = (state = initialState, action) => {
  switch (action.type) {
    case CRUD_SEARCH: {
      const entries = action.payload.history;
      return { ...entries };
    }
    default:
      return state;
  }
};

const initialState2 = {};

export const searchResultsReducer = (state = initialState2, action) => {
  switch (action.type) {
    case READ_SEARCH_RESULTS: {
      const { results } = action.payload;
      return { ...results };
    }
    default:
      return state;
  }
};
