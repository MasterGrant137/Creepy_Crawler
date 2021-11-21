//$ types
const CRUD_HISTORY = 'history_store/CREATE_HISTORY';

//$ action creators
const crudHistory = (entries) => ({
    type: CRUD_HISTORY,
    payload: entries,
});

//$ thunks
export const createHistoryEntry = (entry) => async (dispatch) => {
    const response = await fetch('/api/history/', {
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
    if (data.errors === 'The CSRF token has expired.'
        || response.status === 500) {
        window.location.reload();
        return null;
    }
    alert(data.errors);
    return null;
};

export const readHistoryEntries = () => async (dispatch) => {
    const response = await fetch('/api/history/');
    if (response.ok) {
        const entries = await response.json();
        await dispatch(crudHistory(entries));
        return entries;
    }
    return null;
};

export const updateHistoryEntry = (entry) => async (dispatch) => {
    const response = await fetch(`/api/history/${entry.entryID}`, {
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'PATCH',
        body: JSON.stringify({
            updatedAt: entry.updatedAt,
        }),
    });
    if (response.ok) {
        const entries = await response.json();
        await dispatch(crudHistory(entries));
        return entries;
    } if (response.status === 500) {
        window.location.reload();
        return null;
    }
    const data = await response.json();
    if (data.errors === 'The CSRF token has expired.') window.location.reload();
    alert(data.errors);
    return null;
};

export const deleteHistoryEntry = (entryID) => async (dispatch) => {
    const response = await fetch(`/api/history/${entryID}`, {
        method: 'DELETE',
    });
    if (response.ok) {
        const entries = await response.json();
        await dispatch(crudHistory(entries));
        return entries;
    } if (response.status === 500) {
        window.location.reload();
        return null;
    }
    const data = await response.json();
    if (data.errors === 'The CSRF token has expired.') window.location.reload();
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
