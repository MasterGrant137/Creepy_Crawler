//$ types
const CREATE_HISTORY = 'history_store/CREATE_HISTORY';
const READ_HISTORY = 'history_store/READ_HISTORY';
const UPDATE_HISTORY = 'history_store/UPDATE_HISTORY';
const DELETE_HISTORY = 'history_store/DELETE_HISTORY';

//$ action creators
const createHistory = (entry) => ({
    type: CREATE_HISTORY,
    payload: entry,
});

const readHistory = (entries) => ({
    type: READ_HISTORY,
    payload: entries,
});

const updateHistory = (entry) => ({
    type: UPDATE_HISTORY,
    payload: entry,
});

const deleteHistory = (entryID, entries) => ({
    type: DELETE_HISTORY,
    payload: { entryID, entries },
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
    if (response.ok) {
        const newEntry = await response.json();
        await dispatch(createHistory(newEntry));
        return newEntry;
    } if (response.status === 500) {
        window.location.reload();
        return null;
    }
    const data = await response.json();
    alert(data.errors);
    return null;
};

export const readHistoryEntries = () => async (dispatch) => {
    const response = await fetch('/api/history/');
    if (response.ok) {
        const entries = await response.json();
        await dispatch(readHistory(entries));
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
        const data = await response.json();
        await dispatch(updateHistory(data));
        return data;
    } if (response.status === 500) {
        window.location.reload();
        return null;
    }
    const data = await response.json();
    alert(data.errors);
    return null;
};

export const deleteHistoryEntry = (entryID) => async (dispatch) => {
    const response = await fetch(`/api/history/${entryID}`, {
        method: 'DELETE',
    });
    if (response.ok) {
        // const message = await response.json();
        // await dispatch(deleteHistory(entryID));
        // return message;
        const entries = await response.json();
        await dispatch(deleteHistory(entryID, entries));
        return entries;
    } if (response.status === 500) {
        window.location.reload();
        return null;
    }
    const data = await response.json();
    alert(data.errors);
    return null;
};

//$ reducers
const initialState = {};
let newState;
const historyCache = {};

export const historyReducer = (state = initialState, action) => {
    newState = { ...state };
    switch (action.type) {
    case CREATE_HISTORY: {
        const entry = action.payload.history;
        newState[entry.id] = entry;
        return newState;
    }
    case READ_HISTORY: {
        const entries = action.payload.history;
        entries.forEach((entry, idx) => { historyCache[entry.id] = idx; });
        return { ...entries, ...newState };
    }
    case UPDATE_HISTORY: {
        const updateEntry = action.payload.history;
        newState[historyCache[updateEntry.id]].updated_at = updateEntry.updated_at;
        newState[historyCache[updateEntry.id]].tz = updateEntry.tz;
        newState[historyCache[updateEntry.id]].tz_abbrev = updateEntry.tz_abbrev;
        return newState;
    }
    case DELETE_HISTORY: {
        const { entryID } = action.payload.entries;
        const entries = action.payload.entries.history;

        delete newState[historyCache[entryID]];
        entries.forEach((entry, idx) => { historyCache[entry.id] = idx; });
        return { ...entries, ...newState };
    }
    default:
        return state;
    }
};
