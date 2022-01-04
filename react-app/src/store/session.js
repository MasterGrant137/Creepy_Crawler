const CRU_USER = 'session/SET_USER';
const REMOVE_USER = 'session/REMOVE_USER';

const cruUser = (user) => ({
    type: CRU_USER,
    payload: user,
});

const removeUser = () => ({
    type: REMOVE_USER,
});

export const authenticateLogin = () => async (dispatch) => {
    const response = await fetch('/api/auth/login');
    if (response.ok) {
        const data = await response.json();
        dispatch(cruUser(data));
    }
    return null;
};

export const authenticateSignup = () => async (dispatch) => {
    const response = await fetch('/api/auth/signup');
    if (response.ok) {
        const data = await response.json();
        dispatch(cruUser(data));
    }
    return null;
};

export const login = (email, password) => async (dispatch) => {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email,
            password,
        }),
    });
    const data = await response.json();
    if (response.ok) {
        dispatch(cruUser(data));
        return null;
    }
    if (data.errors[0] === 'The CSRF token has expired.'
    || response.status === 500 || response.status === 503) {
        window.location.reload();
        return null;
    }
    return data.errors;
};

export const signUp = (username, email, password) => async (dispatch) => {
    const response = await fetch('/api/auth/signup', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({
            username,
            email,
            password,
        }),
    });
    const data = await response.json();
    if (response.ok) {
        dispatch(cruUser(data));
        return null;
    }
    if (data.errors[0] === 'The CSRF token has expired.'
    || response.status === 500 || response.status === 503) {
        window.location.reload();
        return null;
    }
    return data.errors;
};

export const readUser = (userID) => async (dispatch) => {
    const response = await fetch(`/api/users/${userID}`);
    if (response.ok) {
        const user = await response.json();
        await dispatch(cruUser(user));
        return user;
    }
    return null;
};

export const editProfileMedia = (userID, formData) => async (dispatch) => {
    const response = await fetch(`/api/users/${userID}`, {
        method: 'PUT',
        body: formData,
    });
    const data = await response.json();
    if (response.ok) {
        dispatch(cruUser(data));
        return data;
    }
    if (data.errors[0] === 'The CSRF token has expired.'
    || response.status === 500 || response.status === 503) {
        window.location.reload();
        return null;
    }
    alert(data.errors);
    return null;
};

export const editProfile = (setting) => async (dispatch) => {
    const response = await fetch('/api/users/profile', {
        headers: { 'Content-Type': 'application/json' },
        method: 'PATCH',
        body: JSON.stringify(
            setting,
        ),
    });
    const data = await response.json();
    if (response.ok) {
        dispatch(cruUser(data));
        return data;
    }
    if (data.errors[0] === 'The CSRF token has expired.'
        || response.status === 500 || response.status === 503) {
        window.location.reload();
        return null;
    }
    alert(data.errors);
    return null;
};

export const logout = () => async (dispatch) => {
    const response = await fetch('/api/auth/logout');
    const data = await response.json();
    if (response.ok) {
        dispatch(removeUser());
        return data;
    }
    if (data.errors[0] === 'The CSRF token has expired.'
        || response.status === 500 || response.status === 503) {
        window.location.reload();
        return null;
    }
    return null;
};

const initialState = {};
export default function reducer(state = initialState, action) {
    switch (action.type) {
    case CRU_USER:
        return { user: action.payload };
    case REMOVE_USER:
        return {
            user: null,
        };
    default:
        return state;
    }
}
