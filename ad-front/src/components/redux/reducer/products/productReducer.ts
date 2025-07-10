import * as types from "../../action/types/productTypes";

const initialState = {
  products: [],
  loading: false,
  error: null,
};

export default function productReducer(state = initialState, action: any) {
  switch (action.type) {
    case types.FETCH_PRODUCTS:
    case types.ADD_PRODUCT:
    case types.EDIT_PRODUCT:
    case types.DELETE_PRODUCT:
    case types.UPDATE_PRODUCT_STATUS:
      return { ...state, loading: true, error: null };
    case types.FETCH_PRODUCTS_SUCCESS:
      console.log('📦 Reducer: Products updated with', action.payload?.length || 0, 'products');
      console.log('📦 Reducer: First product:', action.payload?.[0] ? {
        _id: action.payload[0]._id,
        name: action.payload[0].name,
        category: action.payload[0].category
      } : 'No products');
      return { ...state, loading: false, products: action.payload, error: null };
    case types.ADD_PRODUCT_SUCCESS:
      return { ...state, loading: false, products: [action.payload, ...state.products], error: null };
    case types.EDIT_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        products: state.products.map((p: any) => p._id === action.payload._id ? action.payload : p),
        error: null,
      };
    case types.DELETE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        products: state.products.filter((p: any) => p._id !== action.payload),
        error: null,
      };
    case types.UPDATE_PRODUCT_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
        products: state.products.map((p: any) => p._id === action.payload._id ? action.payload : p),
        error: null,
      };
    case types.FETCH_PRODUCTS_FAILURE:
    case types.ADD_PRODUCT_FAILURE:
    case types.EDIT_PRODUCT_FAILURE:
    case types.DELETE_PRODUCT_FAILURE:
    case types.UPDATE_PRODUCT_STATUS_FAILURE:
      return { ...state, loading: false, error: "Product operation failed" };
    default:
      return state;
  }
} 