// constants
const SET_USER = 'session/SET_USER';
const GET_USER = 'session/GET_USER';
const EDIT_USER = 'session/EDIT_USER';
const RESET_THEME = 'session/RESET_THEME';
const REMOVE_USER = 'session/REMOVE_USER';


const setUser = (user) => ({
  type: SET_USER,
  payload: user
});

const getUser = (user) => ({
  type: GET_USER,
  payload: user
})

const editUser = (user) => ({
  type: EDIT_USER,
  payload: user
})

const resetTheme = () => ({
  type: RESET_THEME
})

const removeUser = () => ({
  type: REMOVE_USER,
})

const initialState = { user: null };

export const authenticate = () => async (dispatch) => {
  const response = await fetch('/creepycrawler/auth/', {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (response.ok) {
    const data = await response.json();
    if (data.errors) {
      return;
    }
    dispatch(setUser(data));
  }
}

export const login = (email, password) => async (dispatch) => {
  const response = await fetch('/creepycrawler/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      password
    })
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data))
    return null;
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ['An error occurred. Please try again.'];
  }

}

export const signUp = (username, email, password) => async (dispatch) => {
  const response = await fetch('/creepycrawler/auth/signup', {
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
    dispatch(setUser(data))
    return null;
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ['An error occurred. Please try again.']
  }
}

export const readUser = (userID) => async dispatch => {
  const response = await fetch(`/creepycrawler/users/${userID}`);
  
  if (response.ok) {
    const user = await response.json();
    await dispatch(getUser(user));
    return user;
  }
}

export const editProfileMedia = (userID, formData) => async dispatch => {
  const response = await fetch(`/creepycrawler/users/${userID}`, {
      method: 'PUT',
      body: formData
  })
  if (response.ok) {
      const media = await response.json();
      dispatch(editUser(media));
      return media;
  } else if (response <= 500) {
      const data = await response.json();
      if (data) {
        return data;
      } else return ['A wild error appeared in the bushes, please try again.'];
  }
}

export const editProfile = (setting) => async dispatch => {
  const response = await fetch(`/creepycrawler/users/profile/${setting.id}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'PATCH',
      body: JSON.stringify(
        setting
      )
  })
  if (response.ok) {
      const data = await response.json();
      dispatch(editUser(data));
      return data;
  } else if (response <= 500) {
      const data = await response.json();
      if (data.errors) {
        return data.errors;
      } else return ['A wild error appeared in the bushes, please try again.'];
  }
}

export const resetProfileTheme = () => async dispatch => {
  const response = await fetch('/creepycrawler/users/profile/reset-theme', {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'PATCH'
  })

  if (response.ok) {
    dispatch(resetTheme());
    return null;
  } else {
    return ['A wild error appeared in the bushes, please try again.'];
  }
}

export const logout = () => async (dispatch) => {
  const response = await fetch('/creepycrawler/auth/logout', {
    headers: {
      'Content-Type': 'application/json',
    }
  });

  if (response.ok) {
    dispatch(removeUser());
  }
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { user: action.payload }
    case GET_USER:
      return { user: action.payload }
    case EDIT_USER:
      return { user: action.payload }
    case RESET_THEME:
      return { active_theme: null }
    case REMOVE_USER:
      return { user: null }
    default:
      return state;
  }
}
