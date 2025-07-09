import {
  UPDATE_PROFILE,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILURE,
  ProfileActionType,
} from "../../action/types/profileTypes";

const initialState = {
  loading: false,
  user: null,
  error: null,
};

export default function profileReducer(state = initialState, action: ProfileActionType) {
  switch (action.type) {
    case UPDATE_PROFILE:
      return { ...state, loading: true, error: null };
    case UPDATE_PROFILE_SUCCESS:
      return { ...state, loading: false, user: action.payload, error: null };
    case UPDATE_PROFILE_FAILURE:
      return { ...state, loading: false, error: "Failed to update profile" };
    default:
      return state;
  }
} 