History Page Optimization

*UD — update, delete*

What I wanted:
- O(1) lookup time for UD operations
- custom ordered backend data
- minimal dispatches 

Thought I could:
-  eliminate the delete and update cases from my switch (they won’t be altering the frontend directly)
- spread my entries into new state (to preserve the backend ordered data)
- trigger refresh upon after redirecting to target page 

Issue that arose:
- lost all seamless rendering, had to rely heavily on refresh to update state

First Fix:
- made a cached reference object in history_store.js which finally gave a key reference for my UD operations, allowing for O(1) lookup
- it prevents me from having to refresh my entire DOM every time an entry is deleted
- as mentioned, my update operation can seamlessly change a clicked element's data but the order of all the elements on the DOM can only be changed on refresh since that information is coming from the thunk belonging to the read operation
    - In this instance, the O(1) lookup time is overshadowed by the fact that I refresh upon redirect, so by the time one goes back to history, everything is ordered properly

Solution:
+ I optimized the history page greatly by pulling more from my backend. Instead of creating a reference object on the frontend to manipulate the DOM then refreshing anytime the history page was accessed to prevent from duplicate key errors in React, I just dispatched the newly ordered content upon each CRUD operation. The database is already being manipulated, all that was added was a more general query to grab all of the entries after the DELETE or UPDATE operation and return that type-casted into a dictionary as opposed to merely a success message (DELETE) or an individual entry (UPDATE). This eliminated the following:
    + all window refreshed when accessing history
    + reference object for CRUD operations
    + entry data updates but history does not reorganize

+ The previous way was giving the illusion of a dynamic page by manipulating the DOM directly and refreshing it right before it was re-accessed (e.g., by a search entry being added or by clicking to another page on the site and clicking back). In conclusion, the solution to my initial conundrum was to manipulate my backend (e.g., send delete request, have db delete) and return a more thorough response to my frontend (i.e., all entries instead of merely one entry or a success message) for dispatch as opposed to trying to manipulate my DOM on the frontend with O(1) lookup time and refresh at any sign of an error. All of my operations now return the full result of the thunk's request as opposed to a partial result that was being used to directly alter the DOM. One can see how substantial this development was for my application as it eliminated the last of page refreshes governing my site's core functionality (only present for 500 internal server errors now)—a true boon to my application's performance and the user experience.

For reference, my history reducer went from:
```js
const initialState = {}
let newState;
let historyCache = {};

export const historyReducer = (state = initialState, action) => {
    newState = {...state};
    switch (action.type) {
        case CREATE_HISTORY:
            const entry = action.payload.history;
            newState[entry.id] = entry;
            return newState;
        case READ_HISTORY:
            const entries = action.payload.history;
            entries.forEach((entry, idx) => historyCache[entry.id] = idx)
            return {...entries,...newState};
        case UPDATE_HISTORY:
            const updateEntry = action.payload.history;
            newState[historyCache[updateEntry.id]].updated_at = updateEntry['updated_at'];
            newState[historyCache[updateEntry.id]].tz = updateEntry.tz;
            newState[historyCache[updateEntry.id]].tz_abbrev = updateEntry['tz_abbrev']
            return newState;
        case DELETE_HISTORY:
            const entryID = action.payload;
            delete newState[historyCache[entryID]];
            return newState;
        default:
            return state;
    }
}
```
to the following:
```js
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
```