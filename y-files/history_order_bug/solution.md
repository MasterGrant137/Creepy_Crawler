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

In the end:
- made a cached reference object in history_store.js which finally gave a key reference for my UD operations, allowing for O(1) lookup
- it prevents me from having to refresh my entire DOM every time an entry is deleted
- as mentioned, my update operation can seamlessly change a clicked element's data but the order of all the elements on the DOM can only be changed on refresh since that information is coming from the thunk belonging to the read operation
    - In this instance, the O(1) lookup time is overshadowed by the fact that I refresh upon redirect, so by the time one goes back to history, everything is ordered properly