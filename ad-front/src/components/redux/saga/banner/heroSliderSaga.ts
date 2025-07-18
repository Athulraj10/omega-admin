import { call, put, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import {
  fetchHeroSlidersRequest,
  fetchHeroSlidersSuccess,
  fetchHeroSlidersFailure,
  addHeroSliderRequest,
  addHeroSliderSuccess,
  addHeroSliderFailure,
  updateHeroSliderRequest,
  updateHeroSliderSuccess,
  updateHeroSliderFailure,
  deleteHeroSliderRequest,
  deleteHeroSliderSuccess,
  deleteHeroSliderFailure,
  toggleHeroSliderStatusRequest,
  toggleHeroSliderStatusSuccess,
  toggleHeroSliderStatusFailure,
  reorderHeroSlidersRequest,
  reorderHeroSlidersSuccess,
  reorderHeroSlidersFailure,
} from '../../action/banner/heroSliderAction';
import api from '../../../../utils/api';

// API functions
const heroSliderAPI = {
  getHeroSliders: () => api.get('/admin/hero-sliders'),
  addHeroSlider: (data: any) => {
    // Convert base64 image to file and send as FormData
    const formData = new FormData();
    
    console.log('📤 Original data:', data);
    
    // Add all text fields
    Object.keys(data).forEach(key => {
      if (key !== 'image') {
        formData.append(key, data[key]);
      }
    });
    
    // Convert base64 image to file
    if (data.image && data.image.startsWith('data:')) {
      try {
        const base64Data = data.image.split(',')[1];
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        
        // Determine MIME type from base64 string
        const mimeType = data.image.match(/data:([^;]+)/)?.[1] || 'image/jpeg';
        
        // Get file extension from MIME type
        const extension = mimeType.split('/')[1] || 'jpg';
        const filename = `hero-slider-image.${extension}`;
        
        // Create a File object instead of Blob to ensure proper filename
        const file = new File([byteArray], filename, { type: mimeType });
        
        formData.append('image', file);
        console.log('✅ Image converted and added to FormData:', filename, 'File size:', file.size);
      } catch (error) {
        console.error('❌ Error converting base64 to file:', error);
      }
    } else {
      console.log('⚠️ No image data found or invalid format');
    }
    
    // Log FormData contents for debugging
    for (let [key, value] of formData.entries()) {
      console.log(`📋 FormData - ${key}:`, value instanceof File ? `File: ${value.name}` : value);
    }
    
    return api.post('/admin/hero-sliders', formData);
  },
  updateHeroSlider: (id: string, data: any) => api.put(`/admin/hero-sliders/${id}`, data),
  deleteHeroSlider: (id: string) => api.delete(`/admin/hero-sliders/${id}`),
  toggleHeroSliderStatus: (id: string) => api.patch(`/admin/hero-sliders/${id}/status`),
  reorderHeroSliders: (ids: string[]) => api.post('/admin/hero-sliders/reorder', { ids }),
};

// Sagas
function* fetchHeroSlidersSaga(): Generator<any, void, any> {
  try {
    console.log('🔍 Fetching hero sliders...');
    
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      yield put(fetchHeroSlidersFailure('No authentication token found. Please log in.'));
      return;
    }
    
    const response: any = yield call(heroSliderAPI.getHeroSliders);
    console.log('📦 Hero slider response:', response);
    
    if (response.data?.meta?.code === 200 || response.data?.success) {
      yield put(fetchHeroSlidersSuccess(response.data.data));
    } else {
      yield put(fetchHeroSlidersFailure(response.data?.meta?.message || 'Failed to fetch hero sliders'));
    }
  } catch (error: any) {
    console.error('❌ Hero slider fetch error:', error);
    
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('adminData');
        window.location.href = '/sign-in';
      }
      yield put(fetchHeroSlidersFailure('Authentication required. Please log in.'));
    } else {
      yield put(fetchHeroSlidersFailure(error.response?.data?.message || error.message || 'Failed to fetch hero sliders'));
    }
  }
}

function* addHeroSliderSaga(action: ReturnType<typeof addHeroSliderRequest>): Generator<any, void, any> {
  try {
    console.log('📤 Sending hero slider data:', action.payload);
    const response: any = yield call(heroSliderAPI.addHeroSlider, action.payload);
    console.log('📥 Hero slider response:', response);
    
    if (response.data?.meta?.code === 200 || response.data?.success) {
      yield put(addHeroSliderSuccess(response.data.data));
      toast.success('Hero slider added successfully');
    } else {
      yield put(addHeroSliderFailure(response.data?.meta?.message || 'Failed to add hero slider'));
      toast.error(response.data?.meta?.message || 'Failed to add hero slider');
    }
  } catch (error: any) {
    console.error('❌ Hero slider creation error:', error);
    const errorMessage = error.response?.data?.message || 'Failed to add hero slider';
    yield put(addHeroSliderFailure(errorMessage));
    toast.error(errorMessage);
  }
}

function* updateHeroSliderSaga(action: ReturnType<typeof updateHeroSliderRequest>): Generator<any, void, any> {
  try {
    const { id, ...data } = action.payload;
    const response: any = yield call(heroSliderAPI.updateHeroSlider, id, data);
    if (response.data?.meta?.code === 200 || response.data?.success) {
      yield put(updateHeroSliderSuccess(response.data.data));
      toast.success('Hero slider updated successfully');
    } else {
      yield put(updateHeroSliderFailure(response.data?.meta?.message || 'Failed to update hero slider'));
      toast.error(response.data?.meta?.message || 'Failed to update hero slider');
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to update hero slider';
    yield put(updateHeroSliderFailure(errorMessage));
    toast.error(errorMessage);
  }
}

function* deleteHeroSliderSaga(action: ReturnType<typeof deleteHeroSliderRequest>): Generator<any, void, any> {
  try {
    const response: any = yield call(heroSliderAPI.deleteHeroSlider, action.payload);
    if (response.data?.meta?.code === 200 || response.data?.success) {
      yield put(deleteHeroSliderSuccess(action.payload));
      toast.success('Hero slider deleted successfully');
    } else {
      yield put(deleteHeroSliderFailure(response.data?.meta?.message || 'Failed to delete hero slider'));
      toast.error(response.data?.meta?.message || 'Failed to delete hero slider');
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to delete hero slider';
    yield put(deleteHeroSliderFailure(errorMessage));
    toast.error(errorMessage);
  }
}

function* toggleHeroSliderStatusSaga(action: ReturnType<typeof toggleHeroSliderStatusRequest>): Generator<any, void, any> {
  try {
    const response: any = yield call(heroSliderAPI.toggleHeroSliderStatus, action.payload);
    if (response.data?.meta?.code === 200 || response.data?.success) {
      yield put(toggleHeroSliderStatusSuccess({ id: action.payload, status: response.data.data.status }));
      toast.success('Hero slider status updated successfully');
    } else {
      yield put(toggleHeroSliderStatusFailure(response.data?.meta?.message || 'Failed to update hero slider status'));
      toast.error(response.data?.meta?.message || 'Failed to update hero slider status');
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to update hero slider status';
    yield put(toggleHeroSliderStatusFailure(errorMessage));
    toast.error(errorMessage);
  }
}

function* reorderHeroSlidersSaga(action: ReturnType<typeof reorderHeroSlidersRequest>): Generator<any, void, any> {
  try {
    const response: any = yield call(heroSliderAPI.reorderHeroSliders, action.payload);
    if (response.data.success) {
      yield put(reorderHeroSlidersSuccess(response.data.data));
      toast.success('Hero sliders reordered successfully');
    } else {
      yield put(reorderHeroSlidersFailure(response.data.message || 'Failed to reorder hero sliders'));
      toast.error(response.data.message || 'Failed to reorder hero sliders');
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to reorder hero sliders';
    yield put(reorderHeroSlidersFailure(errorMessage));
    toast.error(errorMessage);
  }
}

// Root saga
export function* heroSliderSaga() {
  yield takeLatest(fetchHeroSlidersRequest.type, fetchHeroSlidersSaga);
  yield takeLatest(addHeroSliderRequest.type, addHeroSliderSaga);
  yield takeLatest(updateHeroSliderRequest.type, updateHeroSliderSaga);
  yield takeLatest(deleteHeroSliderRequest.type, deleteHeroSliderSaga);
  yield takeLatest(toggleHeroSliderStatusRequest.type, toggleHeroSliderStatusSaga);
  yield takeLatest(reorderHeroSlidersRequest.type, reorderHeroSlidersSaga);
} 