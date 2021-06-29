import { AUTH_ACTIONS } from '../action/user';

const initialAppState = {
  user: null,
};

const authReducer = (state = initialAppState, action) => {
  if (action.type === AUTH_ACTIONS.SET_USER) {
    return { ...state, user: action.payload };
  }
  if (action.type === AUTH_ACTIONS.REMOVE_USER) {
    return { ...state, user: null };
  }
  return state;
};
export default authReducer;
