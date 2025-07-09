import {
  LOGOUT,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,
  LogoutAction,
  LogoutPayload,
  LogoutFailureAction,
  LogoutSuccessAction,
} from "../types/logoutTypes";

export const logout = (payload: LogoutPayload): LogoutAction => ({
  type: LOGOUT,
  payload,
});

export const logoutSuccess = (payload: any): LogoutSuccessAction => ({
  type: LOGOUT_SUCCESS,
  payload,
});

export const logoutFailure = (): LogoutFailureAction => ({
  type: LOGOUT_FAILURE,
});
