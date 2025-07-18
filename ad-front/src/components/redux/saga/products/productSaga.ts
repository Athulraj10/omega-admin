import { takeEvery, call, put } from "redux-saga/effects";
import API from "@/utils/api";
import * as types from "../../action/types/productTypes";
import { notifySuccess, notifyDanger } from "@/utils/helper";
import { ProductAction } from "../../action/types/productTypes";

function* fetchProductsRequest() {
  try {
    console.log('🔄 Saga: fetchProductsRequest started');
    console.log('🔄 Fetching products...');
    console.log('🔑 Token check:', typeof window !== 'undefined' ? !!localStorage.getItem('token') : 'SSR');
    
    const { data } = yield call(API.get, "admin/products");
    console.log('📡 API Response:', data);
    
    if (data?.meta?.code === 200 || data?.success) {
      console.log('✅ Products fetched successfully:', data.data?.length || 0, 'products');
      console.log('📦 First product sample:', data.data?.[0] ? {
        _id: data.data[0]._id,
        name: data.data[0].name,
        category: data.data[0].category
      } : 'No products');
      yield put({ type: types.FETCH_PRODUCTS_SUCCESS, payload: data.data });
    } else {
      console.log('❌ API returned error:', data?.meta?.message || data?.message);
      yield put({ type: types.FETCH_PRODUCTS_FAILURE });
      notifyDanger(data?.meta?.message || data?.message);
    }
  } catch (error: any) {
    console.error('❌ Error fetching products:', error);
    if (error.response) {
      console.error('📄 Error response status:', error.response.status);
      console.error('📄 Error response data:', error.response.data);
    }
    yield put({ type: types.FETCH_PRODUCTS_FAILURE });
    notifyDanger("Failed to fetch products");
  }
}

function* addProductRequest(action: ProductAction) {
  try {
    if (!action.payload) return;
    
    console.log('🔄 Saga: addProductRequest started');
    console.log('📦 Payload received:', action.payload);
    
    // The component is already sending FormData in action.payload.data
    const formData = action.payload.data;
    
    if (!formData || !(formData instanceof FormData)) {
      console.error('❌ FormData not found in payload');
      yield put({ type: types.ADD_PRODUCT_FAILURE });
      if (action.payload?.errorCallback) yield call(action.payload.errorCallback);
      notifyDanger("Invalid form data");
      return;
    }
    
    console.log('📤 Sending FormData to API...');
    const { data } = yield call(() => API.post("admin/products", formData, { 
      headers: { "Content-Type": "multipart/form-data" } 
    }));
    
    console.log('📥 API Response:', data);
    
    if (data?.success) {
      console.log('✅ Product added successfully');
      yield put({ type: types.ADD_PRODUCT_SUCCESS, payload: data.data });
      if (action.payload?.callback) yield call(action.payload.callback, data.data);
      notifySuccess(data?.message || 'Product added successfully');
    } else {
      console.log('❌ API returned error:', data?.message);
      yield put({ type: types.ADD_PRODUCT_FAILURE });
      if (action.payload?.errorCallback) yield call(action.payload.errorCallback);
      notifyDanger(data?.message || 'Failed to add product');
    }
  } catch (error: any) {
    console.error('❌ Error in addProductRequest:', error);
    if (error.response) {
      console.error('📄 Error response status:', error.response.status);
      console.error('📄 Error response data:', error.response.data);
    }
    yield put({ type: types.ADD_PRODUCT_FAILURE });
    if (action.payload?.errorCallback) yield call(action.payload.errorCallback);
    notifyDanger("Failed to add product");
  }
}

function* editProductRequest(action: ProductAction) {
  try {
    if (!action.payload) return;
    
    console.log('🔄 Saga: editProductRequest started');
    console.log('📦 Payload received:', action.payload);
    
    // The component is already sending FormData in action.payload.data
    const formData = action.payload.data;
    
    if (!formData || !(formData instanceof FormData)) {
      console.error('❌ FormData not found in payload');
      yield put({ type: types.EDIT_PRODUCT_FAILURE });
      if (action.payload?.errorCallback) yield call(action.payload.errorCallback);
      notifyDanger("Invalid form data");
      return;
    }
    
    console.log('📤 Sending FormData to API...');
    const { data } = yield call(() => API.put(`admin/products/${action.payload?.id}`, formData, { 
      headers: { "Content-Type": "multipart/form-data" } 
    }));
    
    console.log('📥 API Response:', data);
    
    if (data?.success) {
      console.log('✅ Product updated successfully');
      yield put({ type: types.EDIT_PRODUCT_SUCCESS, payload: data.data });
      if (action.payload?.callback) yield call(action.payload.callback, data.data);
      notifySuccess(data?.message || 'Product updated successfully');
    } else {
      console.log('❌ API returned error:', data?.message);
      yield put({ type: types.EDIT_PRODUCT_FAILURE });
      if (action.payload?.errorCallback) yield call(action.payload.errorCallback);
      notifyDanger(data?.message || 'Failed to update product');
    }
  } catch (error: any) {
    console.error('❌ Error in editProductRequest:', error);
    if (error.response) {
      console.error('📄 Error response status:', error.response.status);
      console.error('📄 Error response data:', error.response.data);
    }
    yield put({ type: types.EDIT_PRODUCT_FAILURE });
    if (action.payload?.errorCallback) yield call(action.payload.errorCallback);
    notifyDanger("Failed to update product");
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