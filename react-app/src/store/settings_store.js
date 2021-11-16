//$ types
const CREATE_SETTING = 'settings_store/CREATE_SETTING';
const READ_SETTINGS = 'settings_store/READ_SETTINGS';
const UPDATE_SETTING = 'settings_store/UPDATE_SETTING';
const DELETE_SETTING = 'settings_store/DELETE_SETTING';

//$ action creators
const createSetting = (setting) => ({
    type: CREATE_SETTING,
    payload: setting,
});

const readSettings = (settings) => ({
    type: READ_SETTINGS,
    payload: settings,
});

const updateSetting = (setting) => ({
    type: UPDATE_SETTING,
    payload: setting,
});

const deleteSetting = (settingID) => ({
    type: DELETE_SETTING,
    payload: settingID,
});

//$ thunks
export const createUserSetting = (formData) => async (dispatch) => {
    const response = await fetch('/api/settings/', {
        method: 'POST',
        body: formData,
    });
    if (response.ok) {
        const setting = await response.json();
        await dispatch(createSetting(setting));
        return setting;
    } if (response.status === 500) {
        window.location.reload();
        return null;
    }
    const data = await response.json();
    alert(data.errors);
    return null;
};

export const readUserSettings = () => async (dispatch) => {
    const response = await fetch('/api/settings/');
    if (response.ok) {
        const settings = await response.json();
        await dispatch(readSettings(settings));
        return settings;
    } if (response.status === 500) {
        window.location.reload();
        return null;
    }
    console.log(response.json());
    return null;
};

export const updateUserSetting = (settingID, formData) => async (dispatch) => {
    const response = await fetch(`/api/settings/${settingID}`, {
        method: 'PUT',
        body: formData,
    });
    if (response.ok) {
        const setting = await response.json();
        dispatch(updateSetting(setting));
        return setting;
    }
    // if (response.status === 500) {
    //     window.location.reload();
    //     return null;
    // }
    const data = await response.json();
    alert(data.errors);
    return null;
};

export const deleteUserSetting = (settingID) => async (dispatch) => {
    const response = await fetch(`/api/settings/${settingID}`, {
        method: 'DELETE',
    });
    if (response.ok) {
        const message = await response.json();
        await dispatch(deleteSetting(settingID));
        return message;
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

export const settingsReducer = (state = initialState, action) => {
    newState = { ...state };
    switch (action.type) {
    case CREATE_SETTING: {
        const { setting } = action.payload;
        newState[setting.id] = setting;
        return newState;
    }
    case READ_SETTINGS: {
        const { settings } = action.payload;
        settings.forEach((setting) => { newState[setting.id] = setting; });
        return newState;
    }
    case UPDATE_SETTING: {
        const { setting } = action.payload;
        newState[setting.id] = setting;
        return newState;
    }
    case DELETE_SETTING: {
        const settingID = action.payload;
        delete newState[settingID];
        return newState;
    }
    default:
        return state;
    }
};
