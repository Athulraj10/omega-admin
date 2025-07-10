import {
  FETCH_CATEGORIES_REQUEST,
  FETCH_CATEGORIES_SUCCESS,
  FETCH_CATEGORIES_FAILURE,
  FETCH_ACTIVE_CATEGORIES_REQUEST,
  FETCH_ACTIVE_CATEGORIES_SUCCESS,
  FETCH_ACTIVE_CATEGORIES_FAILURE,
  FETCH_CATEGORY_DETAILS_REQUEST,
  FETCH_CATEGORY_DETAILS_SUCCESS,
  FETCH_CATEGORY_DETAILS_FAILURE,
  CREATE_CATEGORY_REQUEST,
  CREATE_CATEGORY_SUCCESS,
  CREATE_CATEGORY_FAILURE,
  UPDATE_CATEGORY_REQUEST,
  UPDATE_CATEGORY_SUCCESS,
  UPDATE_CATEGORY_FAILURE,
  DELETE_CATEGORY_REQUEST,
  DELETE_CATEGORY_SUCCESS,
  DELETE_CATEGORY_FAILURE,
  UPDATE_CATEGORY_STATUS_REQUEST,
  UPDATE_CATEGORY_STATUS_SUCCESS,
  UPDATE_CATEGORY_STATUS_FAILURE,
} from '../../action/categories/categoryAction';

interface Category {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

interface ActiveCategory {
  id: string;
  name: string;
  description: string;
}

interface CategoryState {
  categories: Category[];
  activeCategories: ActiveCategory[];
  selectedCategory: Category | null;
  loading: boolean;
  activeCategoriesLoading: boolean;
  detailsLoading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCategories: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

const initialState: CategoryState = {
  categories: [],
  activeCategories: [],
  selectedCategory: null,
  loading: false,
  activeCategoriesLoading: false,
  detailsLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCategories: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
};

const categoryReducer = (state = initialState, action: any): CategoryState => {
  switch (action.type) {
    // Fetch Categories
    case FETCH_CATEGORIES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_CATEGORIES_SUCCESS:
      return {
        ...state,
        loading: false,
        categories: action.payload.categories,
        pagination: action.payload.pagination,
        error: null,
      };

    case FETCH_CATEGORIES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Fetch Active Categories
    case FETCH_ACTIVE_CATEGORIES_REQUEST:
      return {
        ...state,
        activeCategoriesLoading: true,
        error: null,
      };

    case FETCH_ACTIVE_CATEGORIES_SUCCESS:
      return {
        ...state,
        activeCategoriesLoading: false,
        activeCategories: action.payload,
        error: null,
      };

    case FETCH_ACTIVE_CATEGORIES_FAILURE:
      return {
        ...state,
        activeCategoriesLoading: false,
        error: action.payload,
      };

    // Fetch Category Details
    case FETCH_CATEGORY_DETAILS_REQUEST:
      return {
        ...state,
        detailsLoading: true,
        error: null,
      };

    case FETCH_CATEGORY_DETAILS_SUCCESS:
      return {
        ...state,
        detailsLoading: false,
        selectedCategory: action.payload,
        error: null,
      };

    case FETCH_CATEGORY_DETAILS_FAILURE:
      return {
        ...state,
        detailsLoading: false,
        error: action.payload,
      };

    // Create Category
    case CREATE_CATEGORY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case CREATE_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        categories: [action.payload, ...state.categories],
        error: null,
      };

    case CREATE_CATEGORY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Update Category
    case UPDATE_CATEGORY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case UPDATE_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        categories: state.categories.map((category) =>
          category.id === action.payload.id ? action.payload : category
        ),
        selectedCategory: state.selectedCategory?.id === action.payload.id ? action.payload : state.selectedCategory,
        error: null,
      };

    case UPDATE_CATEGORY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Delete Category
    case DELETE_CATEGORY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case DELETE_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        categories: state.categories.filter((category) => category.id !== action.payload),
        selectedCategory: state.selectedCategory?.id === action.payload ? null : state.selectedCategory,
        error: null,
      };

    case DELETE_CATEGORY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Update Category Status
    case UPDATE_CATEGORY_STATUS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case UPDATE_CATEGORY_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
        categories: state.categories.map((category) =>
          category.id === action.payload.id ? action.payload : category
        ),
        selectedCategory: state.selectedCategory?.id === action.payload.id ? action.payload : state.selectedCategory,
        error: null,
      };

    case UPDATE_CATEGORY_STATUS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default categoryReducer; 