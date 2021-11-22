//$ types
const CU_SETTING = 'settings_store/CREATE_SETTING';
const READ_SETTINGS = 'settings_store/READ_SETTINGS';
const DELETE_SETTING = 'settings_store/DELETE_SETTING';

//$ action creators
const cuSetting = (setting) => ({
    type: CU_SETTING,
    payload: setting,
});

const readSettings = (settings) => ({
    type: READ_SETTINGS,
    payload: settings,
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
    const data = await response.json();
    if (response.ok) {
        await dispatch(cuSetting(data));
        return data;
    }
    if (data.errors[0] === 'The CSRF token has expired.'
        || response.status === 500) {
        window.location.reload();
        return null;
    }
    alert(data.errors);
    return null;
};

export const readUserSettings = () => async (dispatch) => {
    const response = await fetch('/api/settings/');
    if (response.ok) {
        const settings = await response.json();
        await dispatch(readSettings(settings));
        return settings;
    }
    return null;
};

export const updateUserSetting = (settingID, formData) => async (dispatch) => {
    const response = await fetch(`/api/settings/${settingID}`, {
        method: 'PUT',
        body: formData,
    });
    const data = await response.json();
    if (response.ok) {
        await dispatch(cuSetting(data));
        return data;
    }
    if (data.errors[0] === 'The CSRF token has expired.'
        || response.status === 500) {
        window.location.reload();
        return null;
    }
    alert(data.errors);
    return null;
};

export const deleteUserSetting = (settingID) => async (dispatch) => {
    const response = await fetch(`/api/settings/${settingID}`, {
        method: 'DELETE',
    });
    const data = await response.json();
    if (response.ok) {
        await dispatch(deleteSetting(settingID));
        return data;
    }
    if (data.errors[0] === 'The CSRF token has expired.'
        || response.status === 500) {
        window.location.reload();
        return null;
    }
    alert(data.errors);
    return null;
};

//$ reducers
const initialState = {};
let newState;

export const settingsReducer = (state = initialState, action) => {
    newState = { ...state };
    switch (action.type) {
    case CU_SETTING: {
        const { setting } = action.payload;
        newState[setting.id] = setting;
        return newState;
    }
    case READ_SETTINGS: {
        const { settings } = action.payload;
        settings.forEach((setting) => { newState[setting.id] = setting; });
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
