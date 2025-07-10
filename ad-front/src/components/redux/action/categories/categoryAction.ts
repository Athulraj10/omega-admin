import { createAction } from '@reduxjs/toolkit';

// Action Types
export const FETCH_CATEGORIES_REQUEST = 'categories/fetchCategoriesRequest';
export const FETCH_CATEGORIES_SUCCESS = 'categories/fetchCategoriesSuccess';
export const FETCH_CATEGORIES_FAILURE = 'categories/fetchCategoriesFailure';

export const FETCH_ACTIVE_CATEGORIES_REQUEST = 'categories/fetchActiveCategoriesRequest';
export const FETCH_ACTIVE_CATEGORIES_SUCCESS = 'categories/fetchActiveCategoriesSuccess';
export const FETCH_ACTIVE_CATEGORIES_FAILURE = 'categories/fetchActiveCategoriesFailure';

export const FETCH_CATEGORY_DETAILS_REQUEST = 'categories/fetchCategoryDetailsRequest';
export const FETCH_CATEGORY_DETAILS_SUCCESS = 'categories/fetchCategoryDetailsSuccess';
export const FETCH_CATEGORY_DETAILS_FAILURE = 'categories/fetchCategoryDetailsFailure';

export const CREATE_CATEGORY_REQUEST = 'categories/createCategoryRequest';
export const CREATE_CATEGORY_SUCCESS = 'categories/createCategorySuccess';
export const CREATE_CATEGORY_FAILURE = 'categories/createCategoryFailure';

export const UPDATE_CATEGORY_REQUEST = 'categories/updateCategoryRequest';
export const UPDATE_CATEGORY_SUCCESS = 'categories/updateCategorySuccess';
export const UPDATE_CATEGORY_FAILURE = 'categories/updateCategoryFailure';

export const DELETE_CATEGORY_REQUEST = 'categories/deleteCategoryRequest';
export const DELETE_CATEGORY_SUCCESS = 'categories/deleteCategorySuccess';
export const DELETE_CATEGORY_FAILURE = 'categories/deleteCategoryFailure';

export const UPDATE_CATEGORY_STATUS_REQUEST = 'categories/updateCategoryStatusRequest';
export const UPDATE_CATEGORY_STATUS_SUCCESS = 'categories/updateCategoryStatusSuccess';
export const UPDATE_CATEGORY_STATUS_FAILURE = 'categories/updateCategoryStatusFailure';

// Action Creators
export const fetchCategoriesRequest = createAction(FETCH_CATEGORIES_REQUEST);
export const fetchCategoriesSuccess = createAction(FETCH_CATEGORIES_SUCCESS);
export const fetchCategoriesFailure = createAction(FETCH_CATEGORIES_FAILURE);

export const fetchActiveCategoriesRequest = createAction(FETCH_ACTIVE_CATEGORIES_REQUEST);
export const fetchActiveCategoriesSuccess = createAction(FETCH_ACTIVE_CATEGORIES_SUCCESS);
export const fetchActiveCategoriesFailure = createAction(FETCH_ACTIVE_CATEGORIES_FAILURE);

export const fetchCategoryDetailsRequest = createAction(FETCH_CATEGORY_DETAILS_REQUEST);
export const fetchCategoryDetailsSuccess = createAction(FETCH_CATEGORY_DETAILS_SUCCESS);
export const fetchCategoryDetailsFailure = createAction(FETCH_CATEGORY_DETAILS_FAILURE);

export const createCategoryRequest = createAction(CREATE_CATEGORY_REQUEST);
export const createCategorySuccess = createAction(CREATE_CATEGORY_SUCCESS);
export const createCategoryFailure = createAction(CREATE_CATEGORY_FAILURE);

export const updateCategoryRequest = createAction(UPDATE_CATEGORY_REQUEST);
export const updateCategorySuccess = createAction(UPDATE_CATEGORY_SUCCESS);
export const updateCategoryFailure = createAction(UPDATE_CATEGORY_FAILURE);

export const deleteCategoryRequest = createAction(DELETE_CATEGORY_REQUEST);
export const deleteCategorySuccess = createAction(DELETE_CATEGORY_SUCCESS);
export const deleteCategoryFailure = createAction(DELETE_CATEGORY_FAILURE);

export const updateCategoryStatusRequest = createAction(UPDATE_CATEGORY_STATUS_REQUEST);
export const updateCategoryStatusSuccess = createAction(UPDATE_CATEGORY_STATUS_SUCCESS);
export const updateCategoryStatusFailure = createAction(UPDATE_CATEGORY_STATUS_FAILURE);

// Action Creators for Saga
export const fetchCategories = (params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) => ({
  type: FETCH_CATEGORIES_REQUEST,
  payload: params
});

export const fetchActiveCategories = () => ({
  type: FETCH_ACTIVE_CATEGORIES_REQUEST
});

export const fetchCategoryDetails = (categoryId: string) => ({
  type: FETCH_CATEGORY_DETAILS_REQUEST,
  payload: { categoryId }
});

export const createCategory = (data: {
  name: string;
  description?: string;
  status?: string;
}) => ({
  type: CREATE_CATEGORY_REQUEST,
  payload: data
});

export const updateCategory = (categoryId: string, data: {
  name?: string;
  description?: string;
  status?: string;
}) => ({
  type: UPDATE_CATEGORY_REQUEST,
  payload: { categoryId, data }
});

export const deleteCategory = (categoryId: string) => ({
  type: DELETE_CATEGORY_REQUEST,
  payload: { categoryId }
});

export const updateCategoryStatus = (categoryId: string, status: string) => ({
  type: UPDATE_CATEGORY_STATUS_REQUEST,
  payload: { categoryId, status }
}); 