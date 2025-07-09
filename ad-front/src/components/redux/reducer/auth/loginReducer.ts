import { getDefaultState } from "@/utils//helperWindows";
import {
  LOGIN,
  LOGIN_FAILURE,
  LOGIN_SUCCESS,
  AuthActionType,
} from "../../action/types/loginTypes";

interface AuthState {
  loading: boolean;
  userData: any;
}
const defaultUserData = getDefaultState("userData");

const INIT_STATE: AuthState = {
  loading: false,
  userData: defaultUserData,
};

const loginReducer = (
  state = INIT_STATE,
  action: AuthActionType,
): AuthState => {
  switch (action.type) {
    case LOGIN:
      return { ...state, loading: true };
    case LOGIN_SUCCESS:
      return { ...state, userData: action?.payload, loading: false };
    case LOGIN_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default loginReducer;
