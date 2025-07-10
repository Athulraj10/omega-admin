import { createReducer } from '@reduxjs/toolkit';
import {
  fetchUsersRequest,
  fetchUsersSuccess,
  fetchUsersFailure,
  fetchUserDetailsRequest,
  fetchUserDetailsSuccess,
  fetchUserDetailsFailure,
  fetchUserOrdersRequest,
  fetchUserOrdersSuccess,
  fetchUserOrdersFailure,
  fetchUserReportsRequest,
  fetchUserReportsSuccess,
  fetchUserReportsFailure,
  updateUserStatusRequest,
  updateUserStatusSuccess,
  updateUserStatusFailure,
  deleteUserRequest,
  deleteUserSuccess,
  deleteUserFailure,
} from '../../action/users/userAction';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'blocked';
  registrationDate: string;
  lastLogin: string;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrder?: {
    date: string;
    amount: number;
  };
  avatar?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  itemCount: number;
  date: string;
  paymentStatus: string;
  shippingAddress: any;
  items: Array<{
    product: any;
    quantity: number;
    price: number;
  }>;
}

interface UserReports {
  period: string;
  summary: {
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    minOrderValue: number;
    maxOrderValue: number;
  };
  ordersByStatus: Record<string, { count: number; totalAmount: number }>;
  monthlyTrends: Array<{
    month: string;
    orders: number;
    totalAmount: number;
  }>;
  recentOrders: Array<{
    id: string;
    status: string;
    totalAmount: number;
    date: string;
  }>;
}

interface UserState {
  users: User[];
  selectedUser: User | null;
  userOrders: Order[];
  userReports: UserReports | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  loading: boolean;
  error: string | null;
  ordersLoading: boolean;
  ordersError: string | null;
  reportsLoading: boolean;
  reportsError: string | null;
}

const initialState: UserState = {
  users: [],
  selectedUser: null,
  userOrders: [],
  userReports: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  loading: false,
  error: null,
  ordersLoading: false,
  ordersError: null,
  reportsLoading: false,
  reportsError: null,
};

const userReducer = createReducer(initialState, (builder) => {
  builder
    // Fetch Users
    .addCase(fetchUsersRequest, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchUsersSuccess, (state, action) => {
      state.loading = false;
      if (action.payload && typeof action.payload === 'object') {
        const payload = action.payload as any;
        state.users = payload.users || [];
        state.pagination = payload.pagination || state.pagination;
      }
    })
    .addCase(fetchUsersFailure, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to fetch users';
    })
    
    // Fetch User Details
    .addCase(fetchUserDetailsRequest, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchUserDetailsSuccess, (state, action) => {
      state.loading = false;
      state.selectedUser = action.payload || null;
    })
    .addCase(fetchUserDetailsFailure, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to fetch user details';
    })
    
    // Fetch User Orders
    .addCase(fetchUserOrdersRequest, (state) => {
      state.ordersLoading = true;
      state.ordersError = null;
    })
    .addCase(fetchUserOrdersSuccess, (state, action) => {
      state.ordersLoading = false;
      if (action.payload) {
        state.userOrders = action.payload.orders || [];
      }
    })
    .addCase(fetchUserOrdersFailure, (state, action) => {
      state.ordersLoading = false;
      state.ordersError = action.payload || 'Failed to fetch user orders';
    })
    
    // Fetch User Reports
    .addCase(fetchUserReportsRequest, (state) => {
      state.reportsLoading = true;
      state.reportsError = null;
    })
    .addCase(fetchUserReportsSuccess, (state, action) => {
      state.reportsLoading = false;
      state.userReports = action.payload || null;
    })
    .addCase(fetchUserReportsFailure, (state, action) => {
      state.reportsLoading = false;
      state.reportsError = action.payload || 'Failed to fetch user reports';
    })
    
    // Update User Status
    .addCase(updateUserStatusRequest, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateUserStatusSuccess, (state, action) => {
      state.loading = false;
      // Update the user in the list with proper null checks
      if (action.payload && action.payload.user && action.payload.user.id) {
        const updatedUser = action.payload.user;
        const userIndex = state.users.findIndex(user => user && user.id === updatedUser.id);
        if (userIndex !== -1 && state.users[userIndex]) {
          state.users[userIndex] = {
            ...state.users[userIndex],
            status: updatedUser.status
          };
        }
      }
    })
    .addCase(updateUserStatusFailure, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to update user status';
    })
    
    // Delete User
    .addCase(deleteUserRequest, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(deleteUserSuccess, (state, action) => {
      state.loading = false;
      // Remove the user from the list with proper null checks
      if (action.payload && action.payload.userId) {
        state.users = state.users.filter(user => user && user.id !== action.payload.userId);
        state.pagination.totalUsers = Math.max(0, state.pagination.totalUsers - 1);
      }
    })
    .addCase(deleteUserFailure, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to delete user';
    });
});

export default userReducer; 