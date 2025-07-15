import { createAction } from '@reduxjs/toolkit';

// Banner interface
export interface Banner {
  _id: string;
  image: string;
  titleLine1: string;
  titleLine2: string;
  offerText: string;
  offerHighlight: string;
  buttonText: string;
  device: 'desktop' | 'mobile';
  status: '1' | '0';
  isDefault: boolean;
  createdAt: string;
}

// Action Types
export const FETCH_BANNERS_REQUEST = 'banner/fetchBannersRequest';
export const FETCH_BANNERS_SUCCESS = 'banner/fetchBannersSuccess';
export const FETCH_BANNERS_FAILURE = 'banner/fetchBannersFailure';

export const ADD_BANNER_REQUEST = 'banner/addBannerRequest';
export const ADD_BANNER_SUCCESS = 'banner/addBannerSuccess';
export const ADD_BANNER_FAILURE = 'banner/addBannerFailure';

export const UPDATE_BANNER_REQUEST = 'banner/updateBannerRequest';
export const UPDATE_BANNER_SUCCESS = 'banner/updateBannerSuccess';
export const UPDATE_BANNER_FAILURE = 'banner/updateBannerFailure';

export const DELETE_BANNER_REQUEST = 'banner/deleteBannerRequest';
export const DELETE_BANNER_SUCCESS = 'banner/deleteBannerSuccess';
export const DELETE_BANNER_FAILURE = 'banner/deleteBannerFailure';

export const UPDATE_BANNER_STATUS_REQUEST = 'banner/updateBannerStatusRequest';
export const UPDATE_BANNER_STATUS_SUCCESS = 'banner/updateBannerStatusSuccess';
export const UPDATE_BANNER_STATUS_FAILURE = 'banner/updateBannerStatusFailure';

export const SET_DEFAULT_BANNER_REQUEST = 'banner/setDefaultBannerRequest';
export const SET_DEFAULT_BANNER_SUCCESS = 'banner/setDefaultBannerSuccess';
export const SET_DEFAULT_BANNER_FAILURE = 'banner/setDefaultBannerFailure';

// Action Creators
export const fetchBannersRequest = createAction(FETCH_BANNERS_REQUEST);
export const fetchBannersSuccess = createAction<Banner[]>(FETCH_BANNERS_SUCCESS);
export const fetchBannersFailure = createAction<string>(FETCH_BANNERS_FAILURE);

export const addBannerRequest = createAction<FormData>(ADD_BANNER_REQUEST);
export const addBannerSuccess = createAction<Banner>(ADD_BANNER_SUCCESS);
export const addBannerFailure = createAction<string>(ADD_BANNER_FAILURE);

export const updateBannerRequest = createAction<Partial<Banner> & { id: string }>(UPDATE_BANNER_REQUEST);
export const updateBannerSuccess = createAction<Banner>(UPDATE_BANNER_SUCCESS);
export const updateBannerFailure = createAction<string>(UPDATE_BANNER_FAILURE);

export const deleteBannerRequest = createAction<string>(DELETE_BANNER_REQUEST);
export const deleteBannerSuccess = createAction<string>(DELETE_BANNER_SUCCESS);
export const deleteBannerFailure = createAction<string>(DELETE_BANNER_FAILURE);

export const updateBannerStatusRequest = createAction<{ id: string; status: '1' | '0' }>(UPDATE_BANNER_STATUS_REQUEST);
export const updateBannerStatusSuccess = createAction<{ id: string; status: '1' | '0' }>(UPDATE_BANNER_STATUS_SUCCESS);
export const updateBannerStatusFailure = createAction<string>(UPDATE_BANNER_STATUS_FAILURE);

export const setDefaultBannerRequest = createAction<string>(SET_DEFAULT_BANNER_REQUEST);
export const setDefaultBannerSuccess = createAction<string>(SET_DEFAULT_BANNER_SUCCESS);
export const setDefaultBannerFailure = createAction<string>(SET_DEFAULT_BANNER_FAILURE); 