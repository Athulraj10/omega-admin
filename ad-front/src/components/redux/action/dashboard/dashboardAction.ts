import { createAction } from '@reduxjs/toolkit';

// Action Types
export const FETCH_DASHBOARD_OVERVIEW_REQUEST = 'dashboard/fetchOverviewRequest';
export const FETCH_DASHBOARD_OVERVIEW_SUCCESS = 'dashboard/fetchOverviewSuccess';
export const FETCH_DASHBOARD_OVERVIEW_FAILURE = 'dashboard/fetchOverviewFailure';

export const FETCH_RECENT_USERS_REQUEST = 'dashboard/fetchRecentUsersRequest';
export const FETCH_RECENT_USERS_SUCCESS = 'dashboard/fetchRecentUsersSuccess';
export const FETCH_RECENT_USERS_FAILURE = 'dashboard/fetchRecentUsersFailure';

export const FETCH_PAYMENTS_OVERVIEW_REQUEST = 'dashboard/fetchPaymentsOverviewRequest';
export const FETCH_PAYMENTS_OVERVIEW_SUCCESS = 'dashboard/fetchPaymentsOverviewSuccess';
export const FETCH_PAYMENTS_OVERVIEW_FAILURE = 'dashboard/fetchPaymentsOverviewFailure';

export const FETCH_WEEKLY_PROFIT_REQUEST = 'dashboard/fetchWeeklyProfitRequest';
export const FETCH_WEEKLY_PROFIT_SUCCESS = 'dashboard/fetchWeeklyProfitSuccess';
export const FETCH_WEEKLY_PROFIT_FAILURE = 'dashboard/fetchWeeklyProfitFailure';

export const FETCH_DEVICE_USAGE_REQUEST = 'dashboard/fetchDeviceUsageRequest';
export const FETCH_DEVICE_USAGE_SUCCESS = 'dashboard/fetchDeviceUsageSuccess';
export const FETCH_DEVICE_USAGE_FAILURE = 'dashboard/fetchDeviceUsageFailure';

export const FETCH_CAMPAIGN_VISITORS_REQUEST = 'dashboard/fetchCampaignVisitorsRequest';
export const FETCH_CAMPAIGN_VISITORS_SUCCESS = 'dashboard/fetchCampaignVisitorsSuccess';
export const FETCH_CAMPAIGN_VISITORS_FAILURE = 'dashboard/fetchCampaignVisitorsFailure';

// Action Creators
export const fetchDashboardOverviewRequest = createAction(FETCH_DASHBOARD_OVERVIEW_REQUEST);
export const fetchDashboardOverviewSuccess = createAction<any>(FETCH_DASHBOARD_OVERVIEW_SUCCESS);
export const fetchDashboardOverviewFailure = createAction<string>(FETCH_DASHBOARD_OVERVIEW_FAILURE);

export const fetchRecentUsersRequest = createAction(FETCH_RECENT_USERS_REQUEST);
export const fetchRecentUsersSuccess = createAction<any[]>(FETCH_RECENT_USERS_SUCCESS);
export const fetchRecentUsersFailure = createAction<string>(FETCH_RECENT_USERS_FAILURE);

export const fetchPaymentsOverviewRequest = createAction(FETCH_PAYMENTS_OVERVIEW_REQUEST);
export const fetchPaymentsOverviewSuccess = createAction<any>(FETCH_PAYMENTS_OVERVIEW_SUCCESS);
export const fetchPaymentsOverviewFailure = createAction<string>(FETCH_PAYMENTS_OVERVIEW_FAILURE);

export const fetchWeeklyProfitRequest = createAction(FETCH_WEEKLY_PROFIT_REQUEST);
export const fetchWeeklyProfitSuccess = createAction<any>(FETCH_WEEKLY_PROFIT_SUCCESS);
export const fetchWeeklyProfitFailure = createAction<string>(FETCH_WEEKLY_PROFIT_FAILURE);

export const fetchDeviceUsageRequest = createAction(FETCH_DEVICE_USAGE_REQUEST);
export const fetchDeviceUsageSuccess = createAction<any[]>(FETCH_DEVICE_USAGE_SUCCESS);
export const fetchDeviceUsageFailure = createAction<string>(FETCH_DEVICE_USAGE_FAILURE);

export const fetchCampaignVisitorsRequest = createAction(FETCH_CAMPAIGN_VISITORS_REQUEST);
export const fetchCampaignVisitorsSuccess = createAction<any>(FETCH_CAMPAIGN_VISITORS_SUCCESS);
export const fetchCampaignVisitorsFailure = createAction<string>(FETCH_CAMPAIGN_VISITORS_FAILURE);

// Action Creators for Saga
export const fetchDashboardOverview = () => ({
  type: FETCH_DASHBOARD_OVERVIEW_REQUEST
});

export const fetchRecentUsers = (limit?: number) => ({
  type: FETCH_RECENT_USERS_REQUEST,
  payload: { limit }
});

export const fetchPaymentsOverview = (timeFrame?: string) => ({
  type: FETCH_PAYMENTS_OVERVIEW_REQUEST,
  payload: { timeFrame }
});

export const fetchWeeklyProfit = (timeFrame?: string) => ({
  type: FETCH_WEEKLY_PROFIT_REQUEST,
  payload: { timeFrame }
});

export const fetchDeviceUsage = (timeFrame?: string) => ({
  type: FETCH_DEVICE_USAGE_REQUEST,
  payload: { timeFrame }
});

export const fetchCampaignVisitors = () => ({
  type: FETCH_CAMPAIGN_VISITORS_REQUEST
}); 