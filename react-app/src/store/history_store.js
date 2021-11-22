//$ types
const CRUD_HISTORY = 'history_store/CREATE_HISTORY';

//$ action creators
const crudHistory = (entries) => ({
    type: CRUD_HISTORY,
    payload: entries,
});

//$ thunks
export const createHistoryEntry = (entry) => async (dispatch) => {
    const response = await fetch('/api/search/history/', {
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(entry),
    });
    const data = await response.json();
    if (response.ok) {
        await dispatch(crudHistory(data));
        return data;
    }
    if (data.errors[0] === 'The CSRF token has expired.'
        || response.status === 500) {
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
        await dispatch(crudHistory(entries));
        return entries;
    }
    return null;
};

export const updateHistoryEntry = (entry) => async (dispatch) => {
    const response = await fetch(`/api/search/history/${entry.entryID}`, {
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'PATCH',
        body: JSON.stringify({
            updatedAt: entry.updatedAt,
        }),
    });
    const data = await response.json();
    if (response.ok) {
        await dispatch(crudHistory(data));
        return data;
    }
    if (data.errors[0] === 'The CSRF token has expired.'
        || response.status === 500) {
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
        await dispatch(crudHistory(data));
        return data;
    }
    if (data.errors[0] === 'The CSRF token has expired.'
        || response.status === 500) {
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
    case CRUD_HISTORY: {
        const entries = action.payload.history;
        return { ...entries };
    }
    default:
        return state;
    }
};
