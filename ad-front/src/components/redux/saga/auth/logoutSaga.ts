import { toast } from "react-toastify";
import { takeEvery, call, put, all } from "redux-saga/effects";
import API from "../../../../utils/api";
import {
  notifyDanger,
  notifySuccess,
  notifyWarning,
} from "../../../../utils/helper";
import { logoutFailure, logoutSuccess } from "../../action/auth/logoutAction";
import { LogoutAction, LOGOUT } from "../../action/types/logoutTypes";
import { removeLocalStorageItem } from "@/utils/helperWindows";

function* logoutRequest(action: LogoutAction) {
  try {
    const { data } = yield call(API.post, "admin/logout", action.payload.data);
    if (data?.meta?.code === 200) {
      yield put(logoutSuccess(data?.data));
      removeLocalStorageItem("token");
      removeLocalStorageItem("adminData");
      yield call(action?.payload?.callback, data.data);
      notifySuccess(data?.meta?.message);
    } else {
      yield put(logoutFailure());
      notifyWarning(data?.meta?.message);
    }
  } catch (error) {
    yield put(logoutFailure());
    notifyDanger("Internal Server Error.");
  }
}

export default function* watchLoginAPI() {
  yield takeEvery(LOGOUT, logoutRequest);
}
