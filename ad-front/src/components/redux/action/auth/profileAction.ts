import {
  UPDATE_PROFILE,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILURE,
  UpdateProfilePayload,
  UpdateProfileAction,
  UpdateProfileSuccessAction,
  UpdateProfileFailureAction,
} from "../types/profileTypes";

export const updateProfile = (payload: UpdateProfilePayload): UpdateProfileAction => ({
  type: UPDATE_PROFILE,
  payload,
});

export const updateProfileSuccess = (payload: any): UpdateProfileSuccessAction => ({
  type: UPDATE_PROFILE_SUCCESS,
  payload,
});

export const updateProfileFailure = (): UpdateProfileFailureAction => ({
  type: UPDATE_PROFILE_FAILURE,
}); 