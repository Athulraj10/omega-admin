import {
  FETCH_DASHBOARD_OVERVIEW_REQUEST,
  FETCH_DASHBOARD_OVERVIEW_SUCCESS,
  FETCH_DASHBOARD_OVERVIEW_FAILURE,
  FETCH_RECENT_USERS_REQUEST,
  FETCH_RECENT_USERS_SUCCESS,
  FETCH_RECENT_USERS_FAILURE,
  FETCH_PAYMENTS_OVERVIEW_REQUEST,
  FETCH_PAYMENTS_OVERVIEW_SUCCESS,
  FETCH_PAYMENTS_OVERVIEW_FAILURE,
  FETCH_WEEKLY_PROFIT_REQUEST,
  FETCH_WEEKLY_PROFIT_SUCCESS,
  FETCH_WEEKLY_PROFIT_FAILURE,
  FETCH_DEVICE_USAGE_REQUEST,
  FETCH_DEVICE_USAGE_SUCCESS,
  FETCH_DEVICE_USAGE_FAILURE,
  FETCH_CAMPAIGN_VISITORS_REQUEST,
  FETCH_CAMPAIGN_VISITORS_SUCCESS,
  FETCH_CAMPAIGN_VISITORS_FAILURE,
} from '../../action/dashboard/dashboardAction';

interface DashboardState {
  overview: {
    views: { value: number; growthRate: number };
    profit: { value: number; growthRate: number };
    products: { value: number; growthRate: number };
    users: { value: number; growthRate: number };
    orders: { value: number; growthRate: number };
    categories: { value: number; growthRate: number };
    sellers: { value: number; growthRate: number };
  } | null;
  recentUsers: any[];
  paymentsOverview: {
    received: Array<{ x: string; y: number }>;
    due: Array<{ x: string; y: number }>;
  } | null;
  weeklyProfit: {
    sales: Array<{ x: string; y: number }>;
    revenue: Array<{ x: string; y: number }>;
  } | null;
  deviceUsage: Array<{
    name: string;
    percentage: number;
    amount: number;
  }> | null;
  campaignVisitors: {
    total_visitors: number;
    performance: number;
    chart: Array<{ x: string; y: number }>;
  } | null;
  loading: {
    overview: boolean;
    recentUsers: boolean;
    paymentsOverview: boolean;
    weeklyProfit: boolean;
    deviceUsage: boolean;
    campaignVisitors: boolean;
  };
  error: string | null;
}

const initialState: DashboardState = {
  overview: null,
  recentUsers: [],
  paymentsOverview: null,
  weeklyProfit: null,
  deviceUsage: null,
  campaignVisitors: null,
  loading: {
    overview: false,
    recentUsers: false,
    paymentsOverview: false,
    weeklyProfit: false,
    deviceUsage: false,
    campaignVisitors: false,
  },
  error: null,
};

const dashboardReducer = (state = initialState, action: any): DashboardState => {
  switch (action.type) {
    // Dashboard Overview
    case FETCH_DASHBOARD_OVERVIEW_REQUEST:
      return {
        ...state,
        loading: { ...state.loading, overview: true },
        error: null,
      };

    case FETCH_DASHBOARD_OVERVIEW_SUCCESS:
      return {
        ...state,
        loading: { ...state.loading, overview: false },
        overview: action.payload,
        error: null,
      };

    case FETCH_DASHBOARD_OVERVIEW_FAILURE:
      return {
        ...state,
        loading: { ...state.loading, overview: false },
        error: action.payload,
      };

    // Recent Users
    case FETCH_RECENT_USERS_REQUEST:
      return {
        ...state,
        loading: { ...state.loading, recentUsers: true },
        error: null,
      };

    case FETCH_RECENT_USERS_SUCCESS:
      return {
        ...state,
        loading: { ...state.loading, recentUsers: false },
        recentUsers: action.payload,
        error: null,
      };

    case FETCH_RECENT_USERS_FAILURE:
      return {
        ...state,
        loading: { ...state.loading, recentUsers: false },
        error: action.payload,
      };

    // Payments Overview
    case FETCH_PAYMENTS_OVERVIEW_REQUEST:
      return {
        ...state,
        loading: { ...state.loading, paymentsOverview: true },
        error: null,
      };

    case FETCH_PAYMENTS_OVERVIEW_SUCCESS:
      return {
        ...state,
        loading: { ...state.loading, paymentsOverview: false },
        paymentsOverview: action.payload,
        error: null,
      };

    case FETCH_PAYMENTS_OVERVIEW_FAILURE:
      return {
        ...state,
        loading: { ...state.loading, paymentsOverview: false },
        error: action.payload,
      };

    // Weekly Profit
    case FETCH_WEEKLY_PROFIT_REQUEST:
      return {
        ...state,
        loading: { ...state.loading, weeklyProfit: true },
        error: null,
      };

    case FETCH_WEEKLY_PROFIT_SUCCESS:
      return {
        ...state,
        loading: { ...state.loading, weeklyProfit: false },
        weeklyProfit: action.payload,
        error: null,
      };

    case FETCH_WEEKLY_PROFIT_FAILURE:
      return {
        ...state,
        loading: { ...state.loading, weeklyProfit: false },
        error: action.payload,
      };

    // Device Usage
    case FETCH_DEVICE_USAGE_REQUEST:
      return {
        ...state,
        loading: { ...state.loading, deviceUsage: true },
        error: null,
      };

    case FETCH_DEVICE_USAGE_SUCCESS:
      return {
        ...state,
        loading: { ...state.loading, deviceUsage: false },
        deviceUsage: action.payload,
        error: null,
      };

    case FETCH_DEVICE_USAGE_FAILURE:
      return {
        ...state,
        loading: { ...state.loading, deviceUsage: false },
        error: action.payload,
      };

    // Campaign Visitors
    case FETCH_CAMPAIGN_VISITORS_REQUEST:
      return {
        ...state,
        loading: { ...state.loading, campaignVisitors: true },
        error: null,
      };

    case FETCH_CAMPAIGN_VISITORS_SUCCESS:
      return {
        ...state,
        loading: { ...state.loading, campaignVisitors: false },
        campaignVisitors: action.payload,
        error: null,
      };

    case FETCH_CAMPAIGN_VISITORS_FAILURE:
      return {
        ...state,
        loading: { ...state.loading, campaignVisitors: false },
        error: action.payload,
      };

    default:
      return state;
  }
};

export default dashboardReducer; 