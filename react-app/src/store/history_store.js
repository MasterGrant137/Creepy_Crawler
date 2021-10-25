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

const deleteHistory = (entryID) => ({
    type: DELETE_HISTORY,
    payload: entryID
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
        await dispatch(createHistory(newEntry));
        return newEntry;
    }
}

export const readHistoryEntries = () => async dispatch => {
    const response = await fetch('/creepycrawler/history/');
    if (response.ok) {
        const entries = await response.json();
        console.log(entries);
        await dispatch(readHistory(entries));
        return entries;
    }
}

export const updateHistoryEntry = (entry) => async dispatch => {
    const response = await fetch(`/creepycrawler/history/${entry.entryID}`, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'PATCH',
        body: JSON.stringify({
            updated_at: entry.updated_at
        })
    })
    if (response.ok) {
        const entry = await response.json();
        dispatch(updateHistory(entry));
        return entry;
    }
}

export const deleteHistoryEntry = (entryID) => async dispatch => {
    const response = await fetch(`/creepycrawler/history/${entryID}`, {
        method: 'DELETE'
    })
    console.log(entryID);
    if (response.ok) {
        const message = await response.json();
        await dispatch(deleteHistory(entryID));
        return message;
    }
}

//$ reducers
const initialState = {}
let newState;
let historyCache = {};

export const historyReducer = (state = initialState, action) => {
    newState = {...state};
    // historyCache = {};
    switch (action.type) {
        case CREATE_HISTORY:
            const entry = action.payload.history;
            newState[entry.id] = entry;
            return newState;
        case READ_HISTORY:
            const entries = action.payload.history;
            
            // entries.forEach(entry => newState[entry.id] = entry)
            // console.log({...entries,...newState});
            // console.log(newState);
            // return newState;

            entries.forEach((entry, idx) => historyCache[entry.id] = idx)
            console.log('ohhhhhh', historyCache);
            // let i = 0;
            // for (let entry in entryCache) {
            //      entry = entries[i];
            //     i++;
            // }
            // console.log(entryCache);
            return {...entries,...newState};
        case UPDATE_HISTORY:
            const updateEntry = action.payload.history;
            // console.log('history store', Object.values(newState).find(entry => entry.id === updateEntry.id));
            // newState[updateEntry.id]['updated_at'] = updateEntry['updated_at'];
            // newState[updateEntry.id].tz = updateEntry.tz;
            // newState[updateEntry.id]['tz_abbrev'] = updateEntry['tz_abbrev']

            console.log('AYYYY',historyCache);
            newState[historyCache[updateEntry.id]]['updated_at'] = updateEntry['updated_at'];
            newState[historyCache[updateEntry.id]].tz = updateEntry.tz;
            newState[historyCache[updateEntry.id]]['tz_abbrev'] = updateEntry['tz_abbrev']
            return newState;
        case DELETE_HISTORY:
            const entryID = action.payload;
            console.log('mmmmmmm',historyCache);
            delete newState[entryID];
            return newState;
        default:
            return state;
    }
}