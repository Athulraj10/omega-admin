import { createAction } from '@reduxjs/toolkit';

// Hero Slider Types
export interface HeroSlider {
  _id: string;
  titleLine1: string;
  titleLine2?: string;
  offerText?: string;
  offerHighlight?: string;
  buttonText?: string;
  buttonLink?: string;
  device: string;
  type?: string;
  status: boolean;
  isDefault?: boolean;
  image: string;
  imageUrl?: string;
  sortOrder?: number;
  backgroundColor?: string;
  textColor?: string;
  animation?: string;
  autoplayDelay?: number;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHeroSliderData {
  title?: string; // Backend expects this field
  titleLine1: string;
  titleLine2?: string;
  offerText?: string;
  offerHighlight?: string;
  buttonText?: string;
  buttonLink?: string;
  image: string;
  device?: string;
  backgroundColor?: string;
  textColor?: string;
  animation?: string;
  autoplayDelay?: number;
  sortOrder?: number;
  status?: boolean;
}

export interface UpdateHeroSliderData extends Partial<CreateHeroSliderData> {
  id: string;
}

// Actions
export const fetchHeroSlidersRequest = createAction('heroSlider/fetchHeroSlidersRequest');
export const fetchHeroSlidersSuccess = createAction<HeroSlider[]>('heroSlider/fetchHeroSlidersSuccess');
export const fetchHeroSlidersFailure = createAction<string>('heroSlider/fetchHeroSlidersFailure');

export const addHeroSliderRequest = createAction<CreateHeroSliderData>('heroSlider/addHeroSliderRequest');
export const addHeroSliderSuccess = createAction<HeroSlider>('heroSlider/addHeroSliderSuccess');
export const addHeroSliderFailure = createAction<string>('heroSlider/addHeroSliderFailure');

export const updateHeroSliderRequest = createAction<UpdateHeroSliderData>('heroSlider/updateHeroSliderRequest');
export const updateHeroSliderSuccess = createAction<HeroSlider>('heroSlider/updateHeroSliderSuccess');
export const updateHeroSliderFailure = createAction<string>('heroSlider/updateHeroSliderFailure');

export const deleteHeroSliderRequest = createAction<string>('heroSlider/deleteHeroSliderRequest');
export const deleteHeroSliderSuccess = createAction<string>('heroSlider/deleteHeroSliderSuccess');
export const deleteHeroSliderFailure = createAction<string>('heroSlider/deleteHeroSliderFailure');

export const toggleHeroSliderStatusRequest = createAction<string>('heroSlider/toggleHeroSliderStatusRequest');
export const toggleHeroSliderStatusSuccess = createAction<{ id: string; status: boolean }>('heroSlider/toggleHeroSliderStatusSuccess');
export const toggleHeroSliderStatusFailure = createAction<string>('heroSlider/toggleHeroSliderStatusFailure');

export const reorderHeroSlidersRequest = createAction<string[]>('heroSlider/reorderHeroSlidersRequest');
export const reorderHeroSlidersSuccess = createAction<HeroSlider[]>('heroSlider/reorderHeroSlidersSuccess');
export const reorderHeroSlidersFailure = createAction<string>('heroSlider/reorderHeroSlidersFailure'); 