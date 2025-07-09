// =====================Login===========================
export const LOGOUT = "Logout";
export const LOGOUT_SUCCESS = "Logout_SUCCESS";
export const LOGOUT_FAILURE = "Logout_FAILURE";
export interface LogoutPayload {
  data: {
    id: string;
    action_type: string;
  };
  callback: (data: any) => void;
}
export interface LogoutAction {
  type: typeof LOGOUT;
  payload: LogoutPayload;
}
export interface LogoutSuccessAction {
  type: typeof LOGOUT_SUCCESS;
  payload: any;
}
export interface LogoutFailureAction {
  type: typeof LOGOUT_FAILURE;
}
// =====================Logout===========================
export type logoutActionType =
  | LogoutAction
  | LogoutSuccessAction
  | LogoutFailureAction;
