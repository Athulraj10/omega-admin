export const AUTH_DETAILS = "AUTH_DETAILS";
export const AUTH_DETAILS_SUCCESS = "AUTH_DETAILS_SUCCESS";
export const AUTH_DETAILS_FAILURE = "AUTH_DETAILS_FAILURE";
export interface AuthDetailsPayload {
  data: any;
  callback: (data: any) => void;
}
export interface AuthDetailsAction {
  type: typeof AUTH_DETAILS;
  payload: AuthDetailsPayload;
}
export interface AuthDetailsSuccessAction {
  type: typeof AUTH_DETAILS_SUCCESS;
  payload: any;
}
export interface AuthDetailsFailureAction {
  type: typeof AUTH_DETAILS_FAILURE;
}

export type AuthDetailsActionType =
  | AuthDetailsAction
  | AuthDetailsSuccessAction
  | AuthDetailsFailureAction;
