import {
  GET_SELLERS_REQUEST,
  GET_SELLERS_SUCCESS,
  GET_SELLERS_FAILURE,
  ADD_SELLER_REQUEST,
  ADD_SELLER_SUCCESS,
  ADD_SELLER_FAILURE,
  EDIT_SELLER_REQUEST,
  EDIT_SELLER_SUCCESS,
  EDIT_SELLER_FAILURE,
  DELETE_SELLER_REQUEST,
  DELETE_SELLER_SUCCESS,
  DELETE_SELLER_FAILURE,
  GET_SELLER_REPORTS_REQUEST,
  GET_SELLER_REPORTS_SUCCESS,
  GET_SELLER_REPORTS_FAILURE,
  SellerFormData,
  Seller,
} from "../types/sellerTypes";

// Get Sellers
export const getSellersRequest = () => ({
  type: GET_SELLERS_REQUEST,
});

export const getSellersSuccess = (sellers: Seller[]) => ({
  type: GET_SELLERS_SUCCESS,
  payload: sellers,
});

export const getSellersFailure = (error: string) => ({
  type: GET_SELLERS_FAILURE,
  payload: error,
});

// Add Seller
export const addSellerRequest = (sellerData: SellerFormData, callback?: () => void) => ({
  type: ADD_SELLER_REQUEST,
  payload: sellerData,
  callback,
});

export const addSellerSuccess = (seller: Seller) => ({
  type: ADD_SELLER_SUCCESS,
  payload: seller,
});

export const addSellerFailure = (error: string) => ({
  type: ADD_SELLER_FAILURE,
  payload: error,
});

// Edit Seller
export const editSellerRequest = (id: string, sellerData: SellerFormData, callback?: () => void) => ({
  type: EDIT_SELLER_REQUEST,
  payload: { id, data: sellerData },
  callback,
});

export const editSellerSuccess = (seller: Seller) => ({
  type: EDIT_SELLER_SUCCESS,
  payload: seller,
});

export const editSellerFailure = (error: string) => ({
  type: EDIT_SELLER_FAILURE,
  payload: error,
});

// Delete Seller
export const deleteSellerRequest = (id: string, callback?: () => void) => ({
  type: DELETE_SELLER_REQUEST,
  payload: id,
  callback,
});

export const deleteSellerSuccess = (id: string) => ({
  type: DELETE_SELLER_SUCCESS,
  payload: id,
});

export const deleteSellerFailure = (error: string) => ({
  type: DELETE_SELLER_FAILURE,
  payload: error,
});

// Get Seller Reports
export const getSellerReportsRequest = (id: string) => ({
  type: GET_SELLER_REPORTS_REQUEST,
  payload: id,
});

export const getSellerReportsSuccess = (reports: any) => ({
  type: GET_SELLER_REPORTS_SUCCESS,
  payload: reports,
});

export const getSellerReportsFailure = (error: string) => ({
  type: GET_SELLER_REPORTS_FAILURE,
  payload: error,
}); 