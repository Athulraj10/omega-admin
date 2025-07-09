import { call, put, takeLatest } from "redux-saga/effects";
import {
  GET_SELLERS_REQUEST,
  ADD_SELLER_REQUEST,
  EDIT_SELLER_REQUEST,
  DELETE_SELLER_REQUEST,
  GET_SELLER_REPORTS_REQUEST,
} from "../../action/types/sellerTypes";
import {
  getSellersSuccess,
  getSellersFailure,
  addSellerSuccess,
  addSellerFailure,
  editSellerSuccess,
  editSellerFailure,
  deleteSellerSuccess,
  deleteSellerFailure,
  getSellerReportsSuccess,
  getSellerReportsFailure,
} from "../../action/seller";
import api from "../../../../utils/api";

// Get Sellers Saga
function* getSellersSaga(): Generator<any, void, any> {
  try {
    const response: any = yield call(api.get, "/admin/sellers");
    console.log("Seller API Response:", response);
    
    // Check for success based on meta.code
    if (response.data.meta?.code === 200) {
      yield put(getSellersSuccess(response.data.data));
    } else {
      yield put(getSellersFailure(response.data.meta?.message || "Failed to fetch sellers"));
    }
  } catch (error: any) {
    console.log("Seller API Error:", error);
    console.log("Error Response Data:", error.response?.data);
    
    // Check if it's an authentication error
    if (error.response?.data?.meta?.code === 401) {
      // This should trigger the API interceptor to redirect to login
      const errorMessage = error.response?.data?.meta?.message || "Authentication failed";
      yield put(getSellersFailure(errorMessage));
    } else {
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch sellers";
      yield put(getSellersFailure(errorMessage));
    }
  }
}

// Add Seller Saga
function* addSellerSaga(action: any): Generator<any, void, any> {
  try {
    const response: any = yield call(api.post, "/admin/seller", action.payload);
    console.log("Add Seller Response:", response);
    
    // Check for success based on meta.code
    if (response.data.meta?.code === 200) {
      yield put(addSellerSuccess(response.data.data));
      if (action.callback) {
        action.callback();
      }
    } else {
      // Handle error responses (like 400 for duplicates)
      yield put(addSellerFailure(response.data.meta?.message || "Failed to add seller"));
    }
  } catch (error: any) {
    // Check if it's a 400 error with response data
    if (error.response?.status === 400 && error.response?.data) {
      const errorMessage = error.response.data.meta?.message || error.response.data.message || "Failed to add seller";
      yield put(addSellerFailure(errorMessage));
    } else {
      yield put(addSellerFailure(error.message || "Failed to add seller"));
    }
  }
}

// Edit Seller Saga
function* editSellerSaga(action: any): Generator<any, void, any> {
  try {
    const { id, data } = action.payload;
    const response: any = yield call(api.put, `/admin/seller/${id}`, data);
    
    // Check for success based on meta.code
    if (response.data.meta?.code === 200) {
      yield put(editSellerSuccess(response.data.data));
      if (action.callback) {
        action.callback();
      }
    } else {
      // Handle error responses (like 400 for duplicates)
      yield put(editSellerFailure(response.data.meta?.message || "Failed to edit seller"));
    }
  } catch (error: any) {
    // Check if it's a 400 error with response data
    if (error.response?.status === 400 && error.response?.data) {
      const errorMessage = error.response.data.meta?.message || error.response.data.message || "Failed to edit seller";
      yield put(editSellerFailure(errorMessage));
    } else {
      yield put(editSellerFailure(error.message || "Failed to edit seller"));
    }
  }
}

// Delete Seller Saga
function* deleteSellerSaga(action: any): Generator<any, void, any> {
  try {
    const response: any = yield call(api.delete, `/admin/seller/${action.payload}`);
    
    // Check for success based on meta.code
    if (response.data.meta?.code === 200) {
      yield put(deleteSellerSuccess(action.payload));
      if (action.callback) {
        action.callback();
      }
    } else {
      yield put(deleteSellerFailure(response.data.meta?.message || "Failed to delete seller"));
    }
  } catch (error: any) {
    yield put(deleteSellerFailure(error.message || "Failed to delete seller"));
  }
}

// Get Seller Reports Saga
function* getSellerReportsSaga(action: any): Generator<any, void, any> {
  try {
    const response: any = yield call(api.get, `/admin/seller/${action.payload}/reports`);
    
    // Check for success based on meta.code
    if (response.data.meta?.code === 200) {
      yield put(getSellerReportsSuccess(response.data.data));
    } else {
      yield put(getSellerReportsFailure(response.data.meta?.message || "Failed to fetch seller reports"));
    }
  } catch (error: any) {
    yield put(getSellerReportsFailure(error.message || "Failed to fetch seller reports"));
  }
}

// Seller Sagas
export function* sellerSagas() {
  yield takeLatest(GET_SELLERS_REQUEST, getSellersSaga);
  yield takeLatest(ADD_SELLER_REQUEST, addSellerSaga);
  yield takeLatest(EDIT_SELLER_REQUEST, editSellerSaga);
  yield takeLatest(DELETE_SELLER_REQUEST, deleteSellerSaga);
  yield takeLatest(GET_SELLER_REPORTS_REQUEST, getSellerReportsSaga);
} 