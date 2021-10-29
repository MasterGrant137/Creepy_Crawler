//$ types
const CREATE_SETTING = 'settings_store/CREATE_SETTING';
const READ_SETTINGS = 'settings_store/READ_SETTINGS';
const UPDATE_SETTING = 'settings_store/UPDATE_SETTING';
const DELETE_SETTING = 'settings_store/DELETE_SETTING';

//$ action creators
const createSetting = (setting) => ({
    type: CREATE_SETTING,
    payload: setting
})

const readSettings = (settings) => ({
    type: READ_SETTINGS,
    payload: settings
})

const updateSetting = (setting) => ({
    type: UPDATE_SETTING,
    payload: setting
})

const deleteSetting = (stateID) => ({
    type: DELETE_SETTING,
    payload: stateID
})

//$ thunks
export const createUserSetting = (setting) => async dispatch => {
    const response = await fetch('/creepycrawler/settings/', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(setting)
    })
    if (response.ok) {
        const newSetting = await response.json();
        await dispatch(createSetting(newSetting));
        return newSetting;
    } else {
        return response;
    }
}

export const readUserSettings = () => async dispatch => {
    const response = await fetch('/creepycrawler/settings/');
    if (response.ok) {
        const settings = await response.json();
        await dispatch(readSettings(settings));
        return settings;
    }
}

export const updateUserSetting = (setting) => async dispatch => {
    console.log(setting.setting_id);
    const response = await fetch(`/creepycrawler/settings/${setting.setting_id}`, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'PATCH',
        body: JSON.stringify({
            setting
        })
    })
    if (response.ok) {
        const setting = await response.json();
        dispatch(updateSetting(setting));
        return setting;
    }
}

export const deleteUserSetting = (dbID) => async dispatch => {
    console.log(dbID);
    const response = await fetch(`/creepycrawler/settings/${dbID}`, {
        method: 'DELETE'
    })
    if (response.ok) {
        const message = await response.json();
        await dispatch(deleteSetting());
        return message;
    } else {
        return response;
    }
}

//$ reducers
const initialState = {}
let newState;

export const settingsReducer = (state = initialState, action) => {
    newState = {...state};
    switch (action.type) {
        case CREATE_SETTING:
            const setting = action.payload.setting;
            newState[setting.id] = setting;
            return newState;
        case READ_SETTINGS:
            const settings = action.payload.settings;
            settings.forEach((setting) => newState[setting.id])
            return {...settings,...newState};
        case UPDATE_SETTING:
            const updateSetting = action.payload.setting;
            console.log('UPDATE SETT', updateSetting);
            console.log('UPDATE SETT', updateSetting.id);
            newState[updateSetting.id] = updateSetting;
            console.log('really new update', newState);
            return newState;
        case DELETE_SETTING:
            const stateID = action.payload;
            console.log('NEW STATE',newState);
            delete newState[stateID];
            console.log('NEW NEW STATE',newState);
            return newState;
        default:
            return state;
    }
}