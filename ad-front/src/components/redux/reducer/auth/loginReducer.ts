import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LoginAction,
  LoginSuccessAction,
  LoginFailureAction,
} from "../../action/types/loginTypes";

interface LoginState {
  loading: boolean;
  data: any;
  error: string | null;
}

const initialState: LoginState = {
  loading: false,
  data: null,
  error: null,
};

const loginReducer = (
  state = initialState,
  action: LoginAction | LoginSuccessAction | LoginFailureAction
): LoginState => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: null,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        data: null,
        error: action.payload || "Login failed",
      };
    default:
      return state;
  }
};

export default loginReducer;
