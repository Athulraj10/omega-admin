import { takeEvery, call, put } from "redux-saga/effects";
import API from "@/utils/api";
import * as types from "../../action/types/productTypes";
import { notifySuccess, notifyDanger } from "@/utils/helper";
import { ProductAction } from "../../action/types/productTypes";

function* fetchProductsRequest() {
  try {
    const { data } = yield call(API.get, "admin/products");
    if (data?.success) {
      yield put({ type: types.FETCH_PRODUCTS_SUCCESS, payload: data.data });
    } else {
      yield put({ type: types.FETCH_PRODUCTS_FAILURE });
      notifyDanger(data?.message);
    }
  } catch (error) {
    yield put({ type: types.FETCH_PRODUCTS_FAILURE });
    notifyDanger("Failed to fetch products");
  }
}

function* addProductRequest(action: ProductAction) {
  try {
    if (!action.payload) return;
    const formData = new FormData();
    Object.entries(action.payload.data || {}).forEach(([key, value]) => {
      if (key === "images" && Array.isArray(value)) {
        value.forEach((file) => formData.append("images", file));
      } else {
        formData.append(key, value !== undefined && value !== null ? String(value) : "");
      }
    });
    const { data } = yield call(() => API.post("admin/products", formData, { headers: { "Content-Type": "multipart/form-data" } }));
    if (data?.success) {
      yield put({ type: types.ADD_PRODUCT_SUCCESS, payload: data.data });
      if (action.payload?.callback) yield call(action.payload.callback, data.data);
      notifySuccess(data?.message);
    } else {
      yield put({ type: types.ADD_PRODUCT_FAILURE });
      notifyDanger(data?.message);
    }
  } catch (error) {
    yield put({ type: types.ADD_PRODUCT_FAILURE });
    notifyDanger("Failed to add product");
  }
}

function* editProductRequest(action: ProductAction) {
  try {
    if (!action.payload) return;
    const formData = new FormData();
    Object.entries(action.payload.data || {}).forEach(([key, value]) => {
      if (key === "images" && Array.isArray(value)) {
        value.forEach((file) => formData.append("images", file));
      } else {
        formData.append(key, value !== undefined && value !== null ? String(value) : "");
      }
    });
    const { data } = yield call(() => API.put(`admin/products/${action.payload?.id}`, formData, { headers: { "Content-Type": "multipart/form-data" } }));
    if (data?.success) {
      yield put({ type: types.EDIT_PRODUCT_SUCCESS, payload: data.data });
      if (action.payload?.callback) yield call(action.payload.callback, data.data);
      notifySuccess(data?.message);
    } else {
      yield put({ type: types.EDIT_PRODUCT_FAILURE });
      notifyDanger(data?.message);
    }
  } catch (error) {
    yield put({ type: types.EDIT_PRODUCT_FAILURE });
    notifyDanger("Failed to edit product");
  }
}

function* deleteProductRequest(action: ProductAction) {
  try {
    if (!action.payload) return;
    const { data } = yield call(() => API.delete(`admin/products/${action.payload?.id}`));
    if (data?.success) {
      yield put({ type: types.DELETE_PRODUCT_SUCCESS, payload: action.payload.id });
      if (action.payload?.callback) yield call(action.payload.callback, data);
      notifySuccess(data?.message);
    } else {
      yield put({ type: types.DELETE_PRODUCT_FAILURE });
      notifyDanger(data?.message);
    }
  } catch (error) {
    yield put({ type: types.DELETE_PRODUCT_FAILURE });
    notifyDanger("Failed to delete product");
  }
}

function* updateProductStatusRequest(action: ProductAction) {
  try {
    if (!action.payload) return;
    const { data } = yield call(() => API.patch(`admin/products/${action.payload?.id}/status`, { status: action.payload?.data?.status }));
    if (data?.success) {
      yield put({ type: types.UPDATE_PRODUCT_STATUS_SUCCESS, payload: data.data });
      if (action.payload?.callback) yield call(action.payload.callback, data.data);
      notifySuccess(data?.message);
    } else {
      yield put({ type: types.UPDATE_PRODUCT_STATUS_FAILURE });
      notifyDanger(data?.message);
    }
  } catch (error) {
    yield put({ type: types.UPDATE_PRODUCT_STATUS_FAILURE });
    notifyDanger("Failed to update product status");
  }
}

export default function* watchProductAPI() {
  yield takeEvery(types.FETCH_PRODUCTS, fetchProductsRequest);
  yield takeEvery(types.ADD_PRODUCT, addProductRequest);
  yield takeEvery(types.EDIT_PRODUCT, editProductRequest);
  yield takeEvery(types.DELETE_PRODUCT, deleteProductRequest);
  yield takeEvery(types.UPDATE_PRODUCT_STATUS, updateProductStatusRequest);
} 