import {
  LOGOUT,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,
  logoutActionType,
} from "../../action/types/logoutTypes";

interface LogOutState {
  loading: Boolean;
}
const INIT_STATE: LogOutState = {
  loading: false,
};

const logoutReducer = (
  state = INIT_STATE,
  action: logoutActionType,
): LogOutState => {
  switch (action.type) {
    case LOGOUT:
      return { ...state, loading: true };
    case LOGOUT_SUCCESS:
      return { ...state, loading: false };
    case LOGOUT_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default logoutReducer;
