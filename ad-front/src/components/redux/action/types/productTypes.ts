export const FETCH_PRODUCTS = "FETCH_PRODUCTS";
export const FETCH_PRODUCTS_SUCCESS = "FETCH_PRODUCTS_SUCCESS";
export const FETCH_PRODUCTS_FAILURE = "FETCH_PRODUCTS_FAILURE";

export const ADD_PRODUCT = "ADD_PRODUCT";
export const ADD_PRODUCT_SUCCESS = "ADD_PRODUCT_SUCCESS";
export const ADD_PRODUCT_FAILURE = "ADD_PRODUCT_FAILURE";

export const EDIT_PRODUCT = "EDIT_PRODUCT";
export const EDIT_PRODUCT_SUCCESS = "EDIT_PRODUCT_SUCCESS";
export const EDIT_PRODUCT_FAILURE = "EDIT_PRODUCT_FAILURE";

export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const DELETE_PRODUCT_SUCCESS = "DELETE_PRODUCT_SUCCESS";
export const DELETE_PRODUCT_FAILURE = "DELETE_PRODUCT_FAILURE";

export const UPDATE_PRODUCT_STATUS = "UPDATE_PRODUCT_STATUS";
export const UPDATE_PRODUCT_STATUS_SUCCESS = "UPDATE_PRODUCT_STATUS_SUCCESS";
export const UPDATE_PRODUCT_STATUS_FAILURE = "UPDATE_PRODUCT_STATUS_FAILURE";

export interface ProductPayload {
  id?: string;
  data?: any;
  files?: File[];
  callback?: (data: any) => void;
  errorCallback?: () => void;
}

export interface ProductAction {
  type: string;
  payload?: ProductPayload;
} 