import { createReducer } from '@reduxjs/toolkit';
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
  HeroSlider,
} from '../../action/banner/heroSliderAction';

interface HeroSliderState {
  heroSliders: HeroSlider[];
  loading: boolean;
  error: string | null;
}

const initialState: HeroSliderState = {
  heroSliders: [],
  loading: false,
  error: null,
};

export const heroSliderReducer = createReducer(initialState, (builder) => {
  builder
    // Fetch Hero Sliders
    .addCase(fetchHeroSlidersRequest, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchHeroSlidersSuccess, (state, action) => {
      state.loading = false;
      state.heroSliders = action.payload;
      state.error = null;
    })
    .addCase(fetchHeroSlidersFailure, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    
    // Add Hero Slider
    .addCase(addHeroSliderRequest, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(addHeroSliderSuccess, (state, action) => {
      state.loading = false;
      state.heroSliders.push(action.payload);
      state.error = null;
    })
    .addCase(addHeroSliderFailure, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    
    // Update Hero Slider
    .addCase(updateHeroSliderRequest, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateHeroSliderSuccess, (state, action) => {
      state.loading = false;
      const index = state.heroSliders.findIndex(slider => slider._id === action.payload._id);
      if (index !== -1) {
        state.heroSliders[index] = action.payload;
      }
      state.error = null;
    })
    .addCase(updateHeroSliderFailure, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    
    // Delete Hero Slider
    .addCase(deleteHeroSliderRequest, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(deleteHeroSliderSuccess, (state, action) => {
      state.loading = false;
      state.heroSliders = state.heroSliders.filter(slider => slider._id !== action.payload);
      state.error = null;
    })
    .addCase(deleteHeroSliderFailure, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    
    // Toggle Hero Slider Status
    .addCase(toggleHeroSliderStatusRequest, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(toggleHeroSliderStatusSuccess, (state, action) => {
      state.loading = false;
      const slider = state.heroSliders.find(s => s._id === action.payload.id);
      if (slider) {
        slider.status = action.payload.status;
      }
      state.error = null;
    })
    .addCase(toggleHeroSliderStatusFailure, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    
    // Reorder Hero Sliders
    .addCase(reorderHeroSlidersRequest, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(reorderHeroSlidersSuccess, (state, action) => {
      state.loading = false;
      state.heroSliders = action.payload;
      state.error = null;
    })
    .addCase(reorderHeroSlidersFailure, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
}); 