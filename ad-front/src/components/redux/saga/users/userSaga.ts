import { call, put, takeLatest, all } from "redux-saga/effects";
import api from "../../../../utils/api";
import {
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAILURE,
  FETCH_USER_DETAILS_REQUEST,
  FETCH_USER_DETAILS_SUCCESS,
  FETCH_USER_DETAILS_FAILURE,
  FETCH_USER_ORDERS_REQUEST,
  FETCH_USER_ORDERS_SUCCESS,
  FETCH_USER_ORDERS_FAILURE,
  FETCH_USER_REPORTS_REQUEST,
  FETCH_USER_REPORTS_SUCCESS,
  FETCH_USER_REPORTS_FAILURE,
  UPDATE_USER_STATUS_REQUEST,
  UPDATE_USER_STATUS_SUCCESS,
  UPDATE_USER_STATUS_FAILURE,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAILURE,
} from "../../action/users/userAction";

// Fetch Users Saga
function* fetchUsersSaga(action: any): Generator<any, void, any> {
  try {
    const { page, limit, search, status } = action.payload;
    
    const queryParams = new URLSearchParams();
    if (page) queryParams.append('page', page.toString());
    if (limit) queryParams.append('limit', limit.toString());
    if (search) queryParams.append('search', search);
    if (status) queryParams.append('status', status);

    const response = yield call(api.get, `/admin/users?${queryParams.toString()}`);
    
    yield put({ type: FETCH_USERS_SUCCESS, payload: response.data });
  } catch (error: any) {
    yield put({ 
      type: FETCH_USERS_FAILURE, 
      payload: error.response?.data?.message || 'Failed to fetch users' 
    });
  }
}

// Fetch User Details Saga
function* fetchUserDetailsSaga(action: any): Generator<any, void, any> {
  try {
    const { userId } = action.payload;
    const response = yield call(api.get, `/admin/users/${userId}`);
    
    yield put({ type: FETCH_USER_DETAILS_SUCCESS, payload: response.data });
  } catch (error: any) {
    yield put({ 
      type: FETCH_USER_DETAILS_FAILURE, 
      payload: error.response?.data?.message || 'Failed to fetch user details' 
    });
  }
}

// Fetch User Orders Saga
function* fetchUserOrdersSaga(action: any): Generator<any, void, any> {
  try {
    const { userId, params } = action.payload;
    
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.status) queryParams.append('status', params.status);

    const response = yield call(api.get, `/admin/users/${userId}/orders?${queryParams.toString()}`);
    
    yield put({ type: FETCH_USER_ORDERS_SUCCESS, payload: response.data });
  } catch (error: any) {
    yield put({ 
      type: FETCH_USER_ORDERS_FAILURE, 
      payload: error.response?.data?.message || 'Failed to fetch user orders' 
    });
  }
}

// Fetch User Reports Saga
function* fetchUserReportsSaga(action: any): Generator<any, void, any> {
  try {
    const { userId, period } = action.payload;
    const response = yield call(api.get, `/admin/users/${userId}/reports?period=${period}`);
    
    yield put({ type: FETCH_USER_REPORTS_SUCCESS, payload: response.data });
  } catch (error: any) {
    yield put({ 
      type: FETCH_USER_REPORTS_FAILURE, 
      payload: error.response?.data?.message || 'Failed to fetch user reports' 
    });
  }
}

// Update User Status Saga
function* updateUserStatusSaga(action: any): Generator<any, void, any> {
  try {
    const { userId, status } = action.payload;
    const response = yield call(api.patch, `/admin/users/${userId}/status`, { status });
    
    yield put({ type: UPDATE_USER_STATUS_SUCCESS, payload: response.data });
  } catch (error: any) {
    yield put({ 
      type: UPDATE_USER_STATUS_FAILURE, 
      payload: error.response?.data?.message || 'Failed to update user status' 
    });
  }
}

// Delete User Saga
function* deleteUserSaga(action: any): Generator<any, void, any> {
  try {
    const { userId } = action.payload;
    const response = yield call(api.delete, `/admin/users/${userId}`);
    
    yield put({ type: DELETE_USER_SUCCESS, payload: { userId, ...response.data } });
  } catch (error: any) {
    yield put({ 
      type: DELETE_USER_FAILURE, 
      payload: error.response?.data?.message || 'Failed to delete user' 
    });
  }
}

// Watcher Sagas
export function* watchFetchUsers() {
  yield takeLatest(FETCH_USERS_REQUEST, fetchUsersSaga);
}

export function* watchFetchUserDetails() {
  yield takeLatest(FETCH_USER_DETAILS_REQUEST, fetchUserDetailsSaga);
}

export function* watchFetchUserOrders() {
  yield takeLatest(FETCH_USER_ORDERS_REQUEST, fetchUserOrdersSaga);
}

export function* watchFetchUserReports() {
  yield takeLatest(FETCH_USER_REPORTS_REQUEST, fetchUserReportsSaga);
}

export function* watchUpdateUserStatus() {
  yield takeLatest(UPDATE_USER_STATUS_REQUEST, updateUserStatusSaga);
}

export function* watchDeleteUser() {
  yield takeLatest(DELETE_USER_REQUEST, deleteUserSaga);
}

export default function* userSaga() {
  yield all([
    watchFetchUsers(),
    watchFetchUserDetails(),
    watchFetchUserOrders(),
    watchFetchUserReports(),
    watchUpdateUserStatus(),
    watchDeleteUser(),
  ]);
} 