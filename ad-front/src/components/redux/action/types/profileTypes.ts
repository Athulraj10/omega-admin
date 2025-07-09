export const UPDATE_PROFILE = "UPDATE_PROFILE";
export const UPDATE_PROFILE_SUCCESS = "UPDATE_PROFILE_SUCCESS";
export const UPDATE_PROFILE_FAILURE = "UPDATE_PROFILE_FAILURE";

export interface UpdateProfilePayload {
  data: {
    id: string;
    name: string;
    email: string;
    password?: string;
  };
  callback: (data: any) => void;
}

export interface UpdateProfileAction {
  type: typeof UPDATE_PROFILE;
  payload: UpdateProfilePayload;
}

export interface UpdateProfileSuccessAction {
  type: typeof UPDATE_PROFILE_SUCCESS;
  payload: any;
}

export interface UpdateProfileFailureAction {
  type: typeof UPDATE_PROFILE_FAILURE;
}

export type ProfileActionType =
  | UpdateProfileAction
  | UpdateProfileSuccessAction
  | UpdateProfileFailureAction; 