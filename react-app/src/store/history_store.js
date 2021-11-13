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

const deleteHistory = (entries) => ({
    type: DELETE_HISTORY,
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
        const entries = await response.json();
        await dispatch(deleteHistory(entries));
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
        return { ...entries, ...newState };
    }
    case UPDATE_HISTORY: {
        const entries = action.payload.history;
        return { ...entries };
    }
    case DELETE_HISTORY: {
        const entries = action.payload.history;
        return { ...entries };
    }
    default:
        return state;
    }
};
