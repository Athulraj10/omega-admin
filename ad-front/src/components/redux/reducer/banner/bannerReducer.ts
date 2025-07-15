import { createReducer } from '@reduxjs/toolkit';
import {
  fetchBannersRequest,
  fetchBannersSuccess,
  fetchBannersFailure,
  addBannerRequest,
  addBannerSuccess,
  addBannerFailure,
  updateBannerRequest,
  updateBannerSuccess,
  updateBannerFailure,
  deleteBannerRequest,
  deleteBannerSuccess,
  deleteBannerFailure,
  updateBannerStatusRequest,
  updateBannerStatusSuccess,
  updateBannerStatusFailure,
  setDefaultBannerRequest,
  setDefaultBannerSuccess,
  setDefaultBannerFailure,
  Banner,
} from '../../action/banner/bannerAction';

interface BannerState {
  banners: Banner[];
  loading: boolean;
  error: string | null;
  success: string | null;
}

const initialState: BannerState = {
  banners: [],
  loading: false,
  error: null,
  success: null,
};

const bannerReducer = createReducer(initialState, (builder) => {
  builder
    // Fetch Banners
    .addCase(fetchBannersRequest, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchBannersSuccess, (state, action) => {
      state.loading = false;
      state.banners = action.payload;
      state.error = null;
    })
    .addCase(fetchBannersFailure, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    
    // Add Banner
    .addCase(addBannerRequest, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    })
    .addCase(addBannerSuccess, (state, action) => {
      state.loading = false;
      state.banners.unshift(action.payload);
      state.success = 'Banner added successfully';
      state.error = null;
    })
    .addCase(addBannerFailure, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = null;
    })
    
    // Update Banner
    .addCase(updateBannerRequest, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    })
    .addCase(updateBannerSuccess, (state, action) => {
      state.loading = false;
      const index = state.banners.findIndex(banner => banner._id === action.payload._id);
      if (index !== -1) {
        state.banners[index] = action.payload;
      }
      state.success = 'Banner updated successfully';
      state.error = null;
    })
    .addCase(updateBannerFailure, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = null;
    })
    
    // Delete Banner
    .addCase(deleteBannerRequest, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    })
    .addCase(deleteBannerSuccess, (state, action) => {
      state.loading = false;
      state.banners = state.banners.filter(banner => banner._id !== action.payload);
      state.success = 'Banner deleted successfully';
      state.error = null;
    })
    .addCase(deleteBannerFailure, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = null;
    })
    
    // Update Banner Status
    .addCase(updateBannerStatusRequest, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    })
    .addCase(updateBannerStatusSuccess, (state, action) => {
      state.loading = false;
      const index = state.banners.findIndex(banner => banner._id === action.payload.id);
      if (index !== -1) {
        state.banners[index].status = action.payload.status;
      }
      state.success = 'Banner status updated successfully';
      state.error = null;
    })
    .addCase(updateBannerStatusFailure, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = null;
    })
    
    // Set Default Banner
    .addCase(setDefaultBannerRequest, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    })
    .addCase(setDefaultBannerSuccess, (state, action) => {
      state.loading = false;
      // Reset all banners to non-default
      state.banners.forEach(banner => {
        banner.isDefault = false;
      });
      // Set the selected banner as default
      const index = state.banners.findIndex(banner => banner._id === action.payload);
      if (index !== -1) {
        state.banners[index].isDefault = true;
      }
      state.success = 'Default banner updated successfully';
      state.error = null;
    })
    .addCase(setDefaultBannerFailure, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = null;
    });
});

export default bannerReducer; 