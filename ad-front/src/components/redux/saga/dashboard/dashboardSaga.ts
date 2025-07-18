import { call, put, takeLatest } from 'redux-saga/effects';
import API from '@/utils/api';
import {
  FETCH_DASHBOARD_OVERVIEW_REQUEST,
  FETCH_RECENT_USERS_REQUEST,
  FETCH_PAYMENTS_OVERVIEW_REQUEST,
  FETCH_WEEKLY_PROFIT_REQUEST,
  FETCH_DEVICE_USAGE_REQUEST,
  FETCH_CAMPAIGN_VISITORS_REQUEST,
  fetchDashboardOverviewSuccess,
  fetchDashboardOverviewFailure,
  fetchRecentUsersSuccess,
  fetchRecentUsersFailure,
  fetchPaymentsOverviewSuccess,
  fetchPaymentsOverviewFailure,
  fetchWeeklyProfitSuccess,
  fetchWeeklyProfitFailure,
  fetchDeviceUsageSuccess,
  fetchDeviceUsageFailure,
  fetchCampaignVisitorsSuccess,
  fetchCampaignVisitorsFailure,
} from '../../action/dashboard/dashboardAction';

// Fetch Dashboard Overview Saga
function* fetchDashboardOverviewSaga(): Generator<any, void, any> {
  try {
    console.log('🔄 Fetching dashboard overview...');
    const response = yield call(API.get, '/admin/dashboard/overview');
    console.log('📥 Dashboard overview response:', response.data);
    
    if (response.data.success) {
      yield put(fetchDashboardOverviewSuccess(response.data.data));
    } else {
      yield put(fetchDashboardOverviewFailure(response.data.message || 'Failed to fetch dashboard overview'));
    }
  } catch (error: any) {
    console.error('❌ Error in fetchDashboardOverviewSaga:', error);
    yield put(fetchDashboardOverviewFailure(error.response?.data?.message || 'Failed to fetch dashboard overview'));
  }
}

// Fetch Recent Users Saga
function* fetchRecentUsersSaga(action: any): Generator<any, void, any> {
  try {
    const { limit } = action.payload || {};
    const params = limit ? `?limit=${limit}` : '';
    
    console.log('🔄 Fetching recent users...');
    const response = yield call(API.get, `/admin/dashboard/users${params}`);
    console.log('📥 Recent users response:', response.data);
    
    if (response.data.success) {
      yield put(fetchRecentUsersSuccess(response.data.data));
    } else {
      yield put(fetchRecentUsersFailure(response.data.message || 'Failed to fetch recent users'));
    }
  } catch (error: any) {
    console.error('❌ Error in fetchRecentUsersSaga:', error);
    yield put(fetchRecentUsersFailure(error.response?.data?.message || 'Failed to fetch recent users'));
  }
}

// Fetch Payments Overview Saga
function* fetchPaymentsOverviewSaga(action: any): Generator<any, void, any> {
  try {
    const { timeFrame = 'monthly' } = action.payload || {};
    
    console.log('🔄 Fetching payments overview...');
    const response = yield call(API.get, `/admin/dashboard/payments?timeFrame=${timeFrame}`);
    console.log('📥 Payments overview response:', response.data);
    
    if (response.data.success) {
      yield put(fetchPaymentsOverviewSuccess(response.data.data));
    } else {
      yield put(fetchPaymentsOverviewFailure(response.data.message || 'Failed to fetch payments overview'));
    }
  } catch (error: any) {
    console.error('❌ Error in fetchPaymentsOverviewSaga:', error);
    yield put(fetchPaymentsOverviewFailure(error.response?.data?.message || 'Failed to fetch payments overview'));
  }
}

// Fetch Weekly Profit Saga
function* fetchWeeklyProfitSaga(action: any): Generator<any, void, any> {
  try {
    const { timeFrame = 'this week' } = action.payload || {};
    
    console.log('🔄 Fetching weekly profit...');
    const response = yield call(API.get, `/admin/dashboard/weekly-profit?timeFrame=${timeFrame}`);
    console.log('📥 Weekly profit response:', response.data);
    
    if (response.data.success) {
      yield put(fetchWeeklyProfitSuccess(response.data.data));
    } else {
      yield put(fetchWeeklyProfitFailure(response.data.message || 'Failed to fetch weekly profit'));
    }
  } catch (error: any) {
    console.error('❌ Error in fetchWeeklyProfitSaga:', error);
    yield put(fetchWeeklyProfitFailure(error.response?.data?.message || 'Failed to fetch weekly profit'));
  }
}

// Fetch Device Usage Saga
function* fetchDeviceUsageSaga(action: any): Generator<any, void, any> {
  try {
    const { timeFrame = 'monthly' } = action.payload || {};
    
    console.log('🔄 Fetching device usage...');
    const response = yield call(API.get, `/admin/dashboard/device-usage?timeFrame=${timeFrame}`);
    console.log('📥 Device usage response:', response.data);
    
    if (response.data.success) {
      yield put(fetchDeviceUsageSuccess(response.data.data));
    } else {
      yield put(fetchDeviceUsageFailure(response.data.message || 'Failed to fetch device usage'));
    }
  } catch (error: any) {
    console.error('❌ Error in fetchDeviceUsageSaga:', error);
    yield put(fetchDeviceUsageFailure(error.response?.data?.message || 'Failed to fetch device usage'));
  }
}

// Fetch Campaign Visitors Saga
function* fetchCampaignVisitorsSaga(): Generator<any, void, any> {
  try {
    console.log('🔄 Fetching campaign visitors...');
    const response = yield call(API.get, '/admin/dashboard/campaign-visitors');
    console.log('📥 Campaign visitors response:', response.data);
    
    if (response.data.success) {
      yield put(fetchCampaignVisitorsSuccess(response.data.data));
    } else {
      yield put(fetchCampaignVisitorsFailure(response.data.message || 'Failed to fetch campaign visitors'));
    }
  } catch (error: any) {
    console.error('❌ Error in fetchCampaignVisitorsSaga:', error);
    yield put(fetchCampaignVisitorsFailure(error.response?.data?.message || 'Failed to fetch campaign visitors'));
  }
}

// Dashboard Saga Watcher
export function* dashboardSaga() {
  yield takeLatest(FETCH_DASHBOARD_OVERVIEW_REQUEST, fetchDashboardOverviewSaga);
  yield takeLatest(FETCH_RECENT_USERS_REQUEST, fetchRecentUsersSaga);
  yield takeLatest(FETCH_PAYMENTS_OVERVIEW_REQUEST, fetchPaymentsOverviewSaga);
  yield takeLatest(FETCH_WEEKLY_PROFIT_REQUEST, fetchWeeklyProfitSaga);
  yield takeLatest(FETCH_DEVICE_USAGE_REQUEST, fetchDeviceUsageSaga);
  yield takeLatest(FETCH_CAMPAIGN_VISITORS_REQUEST, fetchCampaignVisitorsSaga);
} 