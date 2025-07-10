import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LoginAction,
  LoginPayload,
  LoginSuccessAction,
  LoginFailureAction,
} from "../types/loginTypes";

export const login = (payload: LoginPayload): LoginAction => ({
  type: LOGIN,
  payload,
});

export const loginSuccess = (payload: any): LoginSuccessAction => ({
  type: LOGIN_SUCCESS,
  payload,
});

export const loginFailure = (error?: string): LoginFailureAction => ({
  type: LOGIN_FAILURE,
  payload: error,
});
