import * as types from "../types/productTypes";
import { ProductPayload, ProductAction } from "../types/productTypes";

export const fetchProducts = (): ProductAction => ({
  type: types.FETCH_PRODUCTS,
});

export const addProduct = (payload: ProductPayload): ProductAction => ({
  type: types.ADD_PRODUCT,
  payload,
});

export const editProduct = (payload: ProductPayload): ProductAction => ({
  type: types.EDIT_PRODUCT,
  payload,
});

export const deleteProduct = (payload: ProductPayload): ProductAction => ({
  type: types.DELETE_PRODUCT,
  payload,
});

export const updateProductStatus = (payload: ProductPayload): ProductAction => ({
  type: types.UPDATE_PRODUCT_STATUS,
  payload,
}); 