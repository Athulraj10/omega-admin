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
  SellerActionTypes,
  Seller,
} from "../../action/types/sellerTypes";

interface SellerState {
  sellers: Seller[];
  loading: boolean;
  error: string | null;
  addLoading: boolean;
  editLoading: boolean;
  deleteLoading: boolean;
  reportsLoading: boolean;
  reports: any;
}

const initialState: SellerState = {
  sellers: [],
  loading: false,
  error: null,
  addLoading: false,
  editLoading: false,
  deleteLoading: false,
  reportsLoading: false,
  reports: null,
};

const sellerReducer = (state = initialState, action: SellerActionTypes): SellerState => {
  switch (action.type) {
    // Get Sellers
    case GET_SELLERS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_SELLERS_SUCCESS:
      return {
        ...state,
        loading: false,
        sellers: action.payload,
        error: null,
      };
    case GET_SELLERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Add Seller
    case ADD_SELLER_REQUEST:
      return {
        ...state,
        addLoading: true,
        error: null,
      };
    case ADD_SELLER_SUCCESS:
      return {
        ...state,
        addLoading: false,
        sellers: [action.payload, ...state.sellers],
        error: null,
      };
    case ADD_SELLER_FAILURE:
      return {
        ...state,
        addLoading: false,
        error: action.payload,
      };

    // Edit Seller
    case EDIT_SELLER_REQUEST:
      return {
        ...state,
        editLoading: true,
        error: null,
      };
    case EDIT_SELLER_SUCCESS:
      return {
        ...state,
        editLoading: false,
        sellers: state.sellers.map((seller) =>
          seller._id === action.payload._id ? action.payload : seller
        ),
        error: null,
      };
    case EDIT_SELLER_FAILURE:
      return {
        ...state,
        editLoading: false,
        error: action.payload,
      };

    // Delete Seller
    case DELETE_SELLER_REQUEST:
      return {
        ...state,
        deleteLoading: true,
        error: null,
      };
    case DELETE_SELLER_SUCCESS:
      return {
        ...state,
        deleteLoading: false,
        sellers: state.sellers.filter((seller) => seller._id !== action.payload),
        error: null,
      };
    case DELETE_SELLER_FAILURE:
      return {
        ...state,
        deleteLoading: false,
        error: action.payload,
      };

    // Get Seller Reports
    case GET_SELLER_REPORTS_REQUEST:
      return {
        ...state,
        reportsLoading: true,
        error: null,
      };
    case GET_SELLER_REPORTS_SUCCESS:
      return {
        ...state,
        reportsLoading: false,
        reports: action.payload,
        error: null,
      };
    case GET_SELLER_REPORTS_FAILURE:
      return {
        ...state,
        reportsLoading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default sellerReducer; 