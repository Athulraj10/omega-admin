import { takeEvery, call, put } from "redux-saga/effects";
import API from "@/utils/api";
import { updateProfileSuccess, updateProfileFailure } from "../../action/auth/profileAction";
import { UPDATE_PROFILE, UpdateProfileAction } from "../../action/types/profileTypes";
import { setLocalStorageItem } from "@/utils/helperWindows";
import { notifySuccess, notifyDanger } from "@/utils/helper";

function* updateProfileRequest(action: UpdateProfileAction) {
  try {
    const { data } = yield call(API.post, "admin/update-profile", action.payload.data);
    if (data?.meta?.code === 200) {
      yield put(updateProfileSuccess(data?.data));
      setLocalStorageItem("adminData", JSON.stringify(data.data));
      yield call(action?.payload?.callback, data.data);
      notifySuccess(data?.meta?.message);
    } else {
      yield put(updateProfileFailure());
      notifyDanger(data?.meta?.message);
    }
  } catch (error) {
    yield put(updateProfileFailure());
    notifyDanger("Internal Server Error.");
  }
}

export default function* watchProfileAPI() {
  yield takeEvery(UPDATE_PROFILE, updateProfileRequest);
} 