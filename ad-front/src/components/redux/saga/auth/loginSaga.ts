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
    console.log('🔐 Login response:', data);
    
    if (data?.meta?.code === 200) {
      const modifiedData = {
        ...data?.data,
        token: data?.meta?.token,
      };
      yield put(loginSuccess(modifiedData));
      notifySuccess(data?.meta?.message);
    } else {
      console.log('❌ Login failed:', data.meta.message);
      // Show the actual error message from the backend
      notifyWarning(data?.meta?.message || "Login failed");
      yield put(loginFailure(data?.meta?.message || "Login failed"));
    }
  } catch (error: any) {
    // console.error('💥 Login error:', error);
    yield put(loginFailure());
    
    // Show appropriate error message
    const errorMessage = error?.response?.data?.meta?.message || 
                        error?.message || 
                        "Internal Server Error.";
    notifyDanger(errorMessage);
  }
}

export default function* watchLoginAPI() {
  yield takeEvery(LOGIN, loginRequest);
}
