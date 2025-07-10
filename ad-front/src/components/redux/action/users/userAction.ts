import { createAction } from '@reduxjs/toolkit';

// Action Types
export const FETCH_USERS_REQUEST = 'users/fetchUsersRequest';
export const FETCH_USERS_SUCCESS = 'users/fetchUsersSuccess';
export const FETCH_USERS_FAILURE = 'users/fetchUsersFailure';

export const FETCH_USER_DETAILS_REQUEST = 'users/fetchUserDetailsRequest';
export const FETCH_USER_DETAILS_SUCCESS = 'users/fetchUserDetailsSuccess';
export const FETCH_USER_DETAILS_FAILURE = 'users/fetchUserDetailsFailure';

export const FETCH_USER_ORDERS_REQUEST = 'users/fetchUserOrdersRequest';
export const FETCH_USER_ORDERS_SUCCESS = 'users/fetchUserOrdersSuccess';
export const FETCH_USER_ORDERS_FAILURE = 'users/fetchUserOrdersFailure';

export const FETCH_USER_REPORTS_REQUEST = 'users/fetchUserReportsRequest';
export const FETCH_USER_REPORTS_SUCCESS = 'users/fetchUserReportsSuccess';
export const FETCH_USER_REPORTS_FAILURE = 'users/fetchUserReportsFailure';

export const UPDATE_USER_STATUS_REQUEST = 'users/updateUserStatusRequest';
export const UPDATE_USER_STATUS_SUCCESS = 'users/updateUserStatusSuccess';
export const UPDATE_USER_STATUS_FAILURE = 'users/updateUserStatusFailure';

export const DELETE_USER_REQUEST = 'users/deleteUserRequest';
export const DELETE_USER_SUCCESS = 'users/deleteUserSuccess';
export const DELETE_USER_FAILURE = 'users/deleteUserFailure';

// Action Creators
export const fetchUsersRequest = createAction(FETCH_USERS_REQUEST);
export const fetchUsersSuccess = createAction(FETCH_USERS_SUCCESS);
export const fetchUsersFailure = createAction(FETCH_USERS_FAILURE);

export const fetchUserDetailsRequest = createAction(FETCH_USER_DETAILS_REQUEST);
export const fetchUserDetailsSuccess = createAction(FETCH_USER_DETAILS_SUCCESS);
export const fetchUserDetailsFailure = createAction(FETCH_USER_DETAILS_FAILURE);

export const fetchUserOrdersRequest = createAction(FETCH_USER_ORDERS_REQUEST);
export const fetchUserOrdersSuccess = createAction(FETCH_USER_ORDERS_SUCCESS);
export const fetchUserOrdersFailure = createAction(FETCH_USER_ORDERS_FAILURE);

export const fetchUserReportsRequest = createAction(FETCH_USER_REPORTS_REQUEST);
export const fetchUserReportsSuccess = createAction(FETCH_USER_REPORTS_SUCCESS);
export const fetchUserReportsFailure = createAction(FETCH_USER_REPORTS_FAILURE);

export const updateUserStatusRequest = createAction(UPDATE_USER_STATUS_REQUEST);
export const updateUserStatusSuccess = createAction(UPDATE_USER_STATUS_SUCCESS);
export const updateUserStatusFailure = createAction(UPDATE_USER_STATUS_FAILURE);

export const deleteUserRequest = createAction(DELETE_USER_REQUEST);
export const deleteUserSuccess = createAction(DELETE_USER_SUCCESS);
export const deleteUserFailure = createAction(DELETE_USER_FAILURE);

// Action Creators for Saga
export const fetchUsers = (params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) => ({
  type: FETCH_USERS_REQUEST,
  payload: params
});

export const fetchUserDetails = (userId: string) => ({
  type: FETCH_USER_DETAILS_REQUEST,
  payload: { userId }
});

export const fetchUserOrders = (userId: string, params: {
  page?: number;
  limit?: number;
  status?: string;
}) => ({
  type: FETCH_USER_ORDERS_REQUEST,
  payload: { userId, params }
});

export const fetchUserReports = (userId: string, period: string = '30') => ({
  type: FETCH_USER_REPORTS_REQUEST,
  payload: { userId, period }
});

export const updateUserStatus = (userId: string, status: string) => ({
  type: UPDATE_USER_STATUS_REQUEST,
  payload: { userId, status }
});

export const deleteUser = (userId: string) => ({
  type: DELETE_USER_REQUEST,
  payload: { userId }
}); 