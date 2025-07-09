import { toast } from "react-toastify";
import { takeEvery, call, put, all } from "redux-saga/effects";
import API from "@/utils/api";
import {
  notifyDanger,
  notifySuccess,
  notifyWarning,
} from "@/utils/helper";
import { loginFailure, loginSuccess } from "../../action/auth/loginAction";
import { LoginAction, LOGIN } from "../../action/types/loginTypes";

function* loginRequest(action: LoginAction) {
  try {
    const { data } = yield API.post("admin/login", action?.payload?.data);
    // const { data } = yield call(API.post, "admin/login", action.payload.data);
    console.log(data);
    if (data?.meta?.code === 200) {
      yield put(loginSuccess(data?.data));
      const modifiedData = {
        ...data?.data,
        token: data?.meta?.token,
      };
      yield call(action?.payload?.callback, modifiedData);
      notifySuccess(data?.meta?.message);
    } else {
      console.log(data.meta.message);
      notifyWarning(data?.meta?.message);
      yield put(loginFailure());
    }
  } catch (error) {
    yield put(loginFailure());
    notifyDanger("Internal Server Error.");
  }
}

export default function* watchLoginAPI() {
  yield takeEvery(LOGIN, loginRequest);
}
