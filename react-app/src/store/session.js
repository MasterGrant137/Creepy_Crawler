// constants
const SET_USER = 'session/SET_USER';
const GET_USER = 'session/GET_USER';
const EDIT_USER = 'session/EDIT_USER';
const RESET_THEME = 'session/RESET_THEME';
const REMOVE_USER = 'session/REMOVE_USER';

const setUser = (user) => ({
    type: SET_USER,
    payload: user,
});

const getUser = (user) => ({
    type: GET_USER,
    payload: user,
});

const editUser = (user) => ({
    type: EDIT_USER,
    payload: user,
});

const resetTheme = () => ({
    type: RESET_THEME,
});

const removeUser = () => ({
    type: REMOVE_USER,
});

const initialState = { user: null };

export const authenticateLogin = () => async (dispatch) => {
    const response = await fetch('/api/auth/login', {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(setUser(data));
    }
    return null;
};

export const authenticateSignup = () => async (dispatch) => {
    const response = await fetch('/api/auth/signup', {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(setUser(data));
    }
    return null;
};

export const login = (email, password) => async (dispatch) => {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(setUser(data));
        return null;
    } if (response.status === 500) {
        window.location.reload();
        return null;
    }
    const data = await response.json();
    return data.errors;
};

export const signUp = (username, email, password) => async (dispatch) => {
    const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username,
            email,
            password,
        }),
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(setUser(data));
        return null;
    } if (response.status === 500) {
        window.location.reload();
        return null;
    }
    const data = await response.json();
    return data.errors;
};

export const readUser = (userID) => async (dispatch) => {
    const response = await fetch(`/api/users/${userID}`);
    if (response.ok) {
        const user = await response.json();
        await dispatch(getUser(user));
        return user;
    }
    return null;
};

export const editProfileMedia = (userID, formData) => async (dispatch) => {
    const response = await fetch(`/api/users/${userID}`, {
        method: 'PUT',
        body: formData,
    });
    if (response.ok) {
        const media = await response.json();
        dispatch(editUser(media));
        return media;
    } if (response.status === 500) {
        window.location.reload();
        return null;
    }
    const data = await response.json();
    alert(data.errors);
    return null;
};

export const editProfile = (setting) => async (dispatch) => {
    const response = await fetch('/api/users/profile', {
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'PATCH',
        body: JSON.stringify(
            setting,
        ),
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(editUser(data));
        return data;
    } if (response.status === 500) {
        window.location.reload();
        return null;
    }
    const data = await response.json();
    return data.errors;
};

export const resetProfileTheme = () => async (dispatch) => {
    const response = await fetch('/api/users/profile/reset-theme', {
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'PATCH',
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(resetTheme());
        return data;
    } if (response.status === 500) {
        window.location.reload();
        return null;
    }
    const data = response.json();
    return data.errors;
};

export const logout = () => async (dispatch) => {
    const response = await fetch('/api/auth/logout', {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(removeUser());
        return data;
    } if (response.status === 500) {
        window.location.reload();
        return null;
    }
    return null;
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
    case SET_USER:
        return { user: action.payload };
    case GET_USER:
        return { user: action.payload };
    case EDIT_USER:
        return { user: action.payload };
    case RESET_THEME:
        return { active_theme: null };
    case REMOVE_USER:
        return { user: null };
    default:
        return state;
    }
}
