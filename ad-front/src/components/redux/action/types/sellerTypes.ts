// Seller Types
export interface Seller {
  _id: string;
  companyName: string;
  userName: string;
  email: string;
  mobile_no?: string;
  address?: string;
  role: string;
  roleLevel: number;
  status: "1" | "0";
  createdAt: string;
  updatedAt: string;
}

export interface SellerFormData {
  companyName: string;
  userName: string;
  email: string;
  mobile_no?: string;
  address?: string;
  role?: string;
  roleLevel?: number;
  status: "1" | "0";
}

// Action Types
export const GET_SELLERS_REQUEST = "GET_SELLERS_REQUEST";
export const GET_SELLERS_SUCCESS = "GET_SELLERS_SUCCESS";
export const GET_SELLERS_FAILURE = "GET_SELLERS_FAILURE";

export const ADD_SELLER_REQUEST = "ADD_SELLER_REQUEST";
export const ADD_SELLER_SUCCESS = "ADD_SELLER_SUCCESS";
export const ADD_SELLER_FAILURE = "ADD_SELLER_FAILURE";

export const EDIT_SELLER_REQUEST = "EDIT_SELLER_REQUEST";
export const EDIT_SELLER_SUCCESS = "EDIT_SELLER_SUCCESS";
export const EDIT_SELLER_FAILURE = "EDIT_SELLER_FAILURE";

export const DELETE_SELLER_REQUEST = "DELETE_SELLER_REQUEST";
export const DELETE_SELLER_SUCCESS = "DELETE_SELLER_SUCCESS";
export const DELETE_SELLER_FAILURE = "DELETE_SELLER_FAILURE";

export const GET_SELLER_REPORTS_REQUEST = "GET_SELLER_REPORTS_REQUEST";
export const GET_SELLER_REPORTS_SUCCESS = "GET_SELLER_REPORTS_SUCCESS";
export const GET_SELLER_REPORTS_FAILURE = "GET_SELLER_REPORTS_FAILURE";

// Action Interfaces
export interface GetSellersRequestAction {
  type: typeof GET_SELLERS_REQUEST;
}

export interface GetSellersSuccessAction {
  type: typeof GET_SELLERS_SUCCESS;
  payload: Seller[];
}

export interface GetSellersFailureAction {
  type: typeof GET_SELLERS_FAILURE;
  payload: string;
}

export interface AddSellerRequestAction {
  type: typeof ADD_SELLER_REQUEST;
  payload: SellerFormData;
  callback?: () => void;
}

export interface AddSellerSuccessAction {
  type: typeof ADD_SELLER_SUCCESS;
  payload: Seller;
}

export interface AddSellerFailureAction {
  type: typeof ADD_SELLER_FAILURE;
  payload: string;
}

export interface EditSellerRequestAction {
  type: typeof EDIT_SELLER_REQUEST;
  payload: { id: string; data: SellerFormData };
  callback?: () => void;
}

export interface EditSellerSuccessAction {
  type: typeof EDIT_SELLER_SUCCESS;
  payload: Seller;
}

export interface EditSellerFailureAction {
  type: typeof EDIT_SELLER_FAILURE;
  payload: string;
}

export interface DeleteSellerRequestAction {
  type: typeof DELETE_SELLER_REQUEST;
  payload: string;
  callback?: () => void;
}

export interface DeleteSellerSuccessAction {
  type: typeof DELETE_SELLER_SUCCESS;
  payload: string;
}

export interface DeleteSellerFailureAction {
  type: typeof DELETE_SELLER_FAILURE;
  payload: string;
}

export interface GetSellerReportsRequestAction {
  type: typeof GET_SELLER_REPORTS_REQUEST;
  payload: string;
}

export interface GetSellerReportsSuccessAction {
  type: typeof GET_SELLER_REPORTS_SUCCESS;
  payload: any;
}

export interface GetSellerReportsFailureAction {
  type: typeof GET_SELLER_REPORTS_FAILURE;
  payload: string;
}

export type SellerActionTypes =
  | GetSellersRequestAction
  | GetSellersSuccessAction
  | GetSellersFailureAction
  | AddSellerRequestAction
  | AddSellerSuccessAction
  | AddSellerFailureAction
  | EditSellerRequestAction
  | EditSellerSuccessAction
  | EditSellerFailureAction
  | DeleteSellerRequestAction
  | DeleteSellerSuccessAction
  | DeleteSellerFailureAction
  | GetSellerReportsRequestAction
  | GetSellerReportsSuccessAction
  | GetSellerReportsFailureAction; 