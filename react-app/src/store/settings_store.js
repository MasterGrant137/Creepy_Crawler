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

const deleteSetting = (settingID) => ({
    type: DELETE_SETTING,
    payload: settingID
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
    const response = await fetch(`/creepycrawler/settings/${setting.setting_id}`, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'PUT',
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

export const deleteUserSetting = (settingID) => async dispatch => {
    const response = await fetch(`/creepycrawler/settings/${settingID}`, {
        method: 'DELETE'
    })
    if (response.ok) {
        const message = await response.json();
        await dispatch(deleteSetting(settingID));
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
            settings.forEach(setting => newState[setting.id] = setting)
            return newState;
        case UPDATE_SETTING:
            const updateSetting = action.payload.setting;
            newState[updateSetting.id] = updateSetting;
            return newState;
        case DELETE_SETTING:
            const settingID = action.payload;
            delete newState[settingID];
            return newState;
        default:
            return state;
    }
}