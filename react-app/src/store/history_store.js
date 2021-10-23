//$ types
const CREATE_HISTORY = 'history_store/CREATE_HISTORY';
const READ_HISTORY = 'history_store/READ_HISTORY';
const UPDATE_HISTORY = 'history_store/UPDATE_HISTORY';
const DELETE_HISTORY = 'history_store/DELETE_HISTORY';

//$ action creators
const createHistory = (entry) => ({
    type: CREATE_HISTORY,
    payload: entry
})

const readHistory = (entries) => ({
    type: READ_HISTORY,
    payload: entries
})

const updateHistory = (entry) => ({
    type: UPDATE_HISTORY,
    payload: entry
})

const deleteHistory = () => ({
    type: DELETE_HISTORY
})

//$ thunks
export const createHistoryEntry = (entry) => async dispatch => {
    const response = await fetch('/creepycrawler/history/', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(entry)
    })
    if (response.ok) {
        const newEntry = await response.json();
        dispatch(createHistory(newEntry));
        return newEntry;
    }
}

export const readHistoryEntries = () => async dispatch => {
    const response = await fetch('/creepycrawler/history/');
    if (response.ok) {
        const entries = await response.json();
        dispatch(readHistory(entries));
        return entries;
    }
}

//$ reducers
const initialState = {}
export const historyReducer = (state = initialState, action) => {
    let newState = { ...state };
    switch (action.type) {
        case CREATE_HISTORY:
            const history = action.payload.history;
            newState[history.id] = history;
            return newState;
        case READ_HISTORY:
            action.payload.history.forEach(entry => newState[entry.id] = entry);
            return newState;
        default:
            return state;
    }
}
