import { call, put, takeLatest } from 'redux-saga/effects';
import API from '@/utils/api';
import {
  FETCH_CATEGORIES_REQUEST,
  FETCH_ACTIVE_CATEGORIES_REQUEST,
  FETCH_CATEGORY_DETAILS_REQUEST,
  CREATE_CATEGORY_REQUEST,
  UPDATE_CATEGORY_REQUEST,
  DELETE_CATEGORY_REQUEST,
  UPDATE_CATEGORY_STATUS_REQUEST,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
  fetchActiveCategoriesSuccess,
  fetchActiveCategoriesFailure,
  fetchCategoryDetailsSuccess,
  fetchCategoryDetailsFailure,
  createCategorySuccess,
  createCategoryFailure,
  updateCategorySuccess,
  updateCategoryFailure,
  deleteCategorySuccess,
  deleteCategoryFailure,
  updateCategoryStatusSuccess,
  updateCategoryStatusFailure,
} from '../../action/categories/categoryAction';

// Fetch Categories Saga
function* fetchCategoriesSaga(action: any): Generator<any, void, any> {
  try {
    const { page = 1, limit = 10, search = '', status = '' } = action.payload;
    
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    if (search) params.append('search', search);
    if (status) params.append('status', status);

    const response = yield call(API.get, `/admin/categories?${params.toString()}`);
    
    if (response.data.success) {
      yield put(fetchCategoriesSuccess(response.data.data));
    } else {
      yield put(fetchCategoriesFailure(response.data.message || 'Failed to fetch categories'));
    }
  } catch (error: any) {
    console.error('Error in fetchCategoriesSaga:', error);
    yield put(fetchCategoriesFailure(error.response?.data?.message || 'Failed to fetch categories'));
  }
}

// Fetch Active Categories Saga
function* fetchActiveCategoriesSaga(): Generator<any, void, any> {
  try {
    const response = yield call(API.get, '/admin/categories/active');
    
    if (response.data.success) {
      yield put(fetchActiveCategoriesSuccess(response.data.data));
    } else {
      yield put(fetchActiveCategoriesFailure(response.data.message || 'Failed to fetch active categories'));
    }
  } catch (error: any) {
    console.error('Error in fetchActiveCategoriesSaga:', error);
    yield put(fetchActiveCategoriesFailure(error.response?.data?.message || 'Failed to fetch active categories'));
  }
}

// Fetch Category Details Saga
function* fetchCategoryDetailsSaga(action: any): Generator<any, void, any> {
  try {
    const { categoryId } = action.payload;
    const response = yield call(API.get, `/admin/categories/${categoryId}`);
    
    if (response.data.success) {
      yield put(fetchCategoryDetailsSuccess(response.data.data));
    } else {
      yield put(fetchCategoryDetailsFailure(response.data.message || 'Failed to fetch category details'));
    }
  } catch (error: any) {
    console.error('Error in fetchCategoryDetailsSaga:', error);
    yield put(fetchCategoryDetailsFailure(error.response?.data?.message || 'Failed to fetch category details'));
  }
}

// Create Category Saga
function* createCategorySaga(action: any): Generator<any, void, any> {
  try {
    const response = yield call(API.post, '/admin/categories', action.payload);
    
    if (response.data.success) {
      yield put(createCategorySuccess(response.data.data));
    } else {
      yield put(createCategoryFailure(response.data.message || 'Failed to create category'));
    }
  } catch (error: any) {
    console.error('Error in createCategorySaga:', error);
    yield put(createCategoryFailure(error.response?.data?.message || 'Failed to create category'));
  }
}

// Update Category Saga
function* updateCategorySaga(action: any): Generator<any, void, any> {
  try {
    const { categoryId, data } = action.payload;
    const response = yield call(API.put, `/admin/categories/${categoryId}`, data);
    
    if (response.data.success) {
      yield put(updateCategorySuccess(response.data.data));
    } else {
      yield put(updateCategoryFailure(response.data.message || 'Failed to update category'));
    }
  } catch (error: any) {
    console.error('Error in updateCategorySaga:', error);
    yield put(updateCategoryFailure(error.response?.data?.message || 'Failed to update category'));
  }
}

// Delete Category Saga
function* deleteCategorySaga(action: any): Generator<any, void, any> {
  try {
    const { categoryId } = action.payload;
    const response = yield call(API.delete, `/admin/categories/${categoryId}`);
    
    if (response.data.success) {
      yield put(deleteCategorySuccess(categoryId));
    } else {
      yield put(deleteCategoryFailure(response.data.message || 'Failed to delete category'));
    }
  } catch (error: any) {
    console.error('Error in deleteCategorySaga:', error);
    yield put(deleteCategoryFailure(error.response?.data?.message || 'Failed to delete category'));
  }
}

// Update Category Status Saga
function* updateCategoryStatusSaga(action: any): Generator<any, void, any> {
  try {
    const { categoryId, status } = action.payload;
    const response = yield call(API.patch, `/admin/categories/${categoryId}/status`, { status });
    
    if (response.data.success) {
      yield put(updateCategoryStatusSuccess(response.data.data));
    } else {
      yield put(updateCategoryStatusFailure(response.data.message || 'Failed to update category status'));
    }
  } catch (error: any) {
    console.error('Error in updateCategoryStatusSaga:', error);
    yield put(updateCategoryStatusFailure(error.response?.data?.message || 'Failed to update category status'));
  }
}

// Category Saga Watcher
export function* categorySaga() {
  yield takeLatest(FETCH_CATEGORIES_REQUEST, fetchCategoriesSaga);
  yield takeLatest(FETCH_ACTIVE_CATEGORIES_REQUEST, fetchActiveCategoriesSaga);
  yield takeLatest(FETCH_CATEGORY_DETAILS_REQUEST, fetchCategoryDetailsSaga);
  yield takeLatest(CREATE_CATEGORY_REQUEST, createCategorySaga);
  yield takeLatest(UPDATE_CATEGORY_REQUEST, updateCategorySaga);
  yield takeLatest(DELETE_CATEGORY_REQUEST, deleteCategorySaga);
  yield takeLatest(UPDATE_CATEGORY_STATUS_REQUEST, updateCategoryStatusSaga);
} 