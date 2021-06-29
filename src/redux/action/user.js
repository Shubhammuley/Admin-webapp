export const AUTH_ACTIONS = {
  SET_USER: 'SET_USER',
  REMOVE_USER: 'REMOVE_USER',
};

export const doUserLoginAction = (data) => async (dispatch) => {
  dispatch({
    type: AUTH_ACTIONS.SET_USER,
    payload: { ...data },
  });
};

export const logoutUser = () => async (dispatch) => {
  localStorage.removeItem('loggedUser');
  dispatch({
    type: AUTH_ACTIONS.REMOVE_USER,
  });
};


export const checkLogin = () => async (dispatch) => {
  const user = (localStorage.getItem('loggedUser') && JSON.parse(localStorage.getItem('loggedUser'))) || null;
  if (user) {
    dispatch({
      type: AUTH_ACTIONS.SET_USER,
      payload: { ...user },
    });
  }
};
