"use client";
import React from 'react';

interface HeroSliderPreviewProps {
  image?: string;
  titleLine1?: string;
  titleLine2?: string;
  offerText?: string;
  offerHighlight?: string;
  buttonText?: string;
  backgroundColor?: string;
  textColor?: string;
  animation?: string;
}

const HeroSliderPreview: React.FC<HeroSliderPreviewProps> = ({
  image,
  titleLine1,
  titleLine2,
  offerText,
  offerHighlight,
  buttonText,
  backgroundColor = '#ffffff',
  textColor = '#000000',
  animation = 'fade'
}) => {
  return (
    <div className="sticky top-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Hero Slider Preview</h3>
      </div>
      
      {/* Preview Container */}
      <div 
        className="relative w-full h-64 rounded-lg overflow-hidden shadow-lg"
        style={{ backgroundColor }}
      >
        {/* Background Image */}
        {image ? (
          <img
            src={image}
            alt="Hero Slider Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <div className="text-gray-400 text-center">
              <svg className="mx-auto h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm">No image selected</p>
            </div>
          </div>
        )}
        
        {/* Content Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center">
          <div className="px-8 text-white">
            {/* Title Lines */}
            {titleLine1 && (
              <h2 className="text-3xl font-bold mb-2" style={{ color: textColor }}>
                {titleLine1}
              </h2>
            )}
            {titleLine2 && (
              <h3 className="text-xl font-semibold mb-3" style={{ color: textColor }}>
                {titleLine2}
              </h3>
            )}
            
            {/* Offer Text */}
            {(offerText || offerHighlight) && (
              <div className="mb-4">
                {offerText && (
                  <span className="text-lg" style={{ color: textColor }}>
                    {offerText}
                  </span>
                )}
                {offerHighlight && (
                  <span className="text-2xl font-bold ml-1" style={{ color: textColor }}>
                    {offerHighlight}
                  </span>
                )}
              </div>
            )}
            
            {/* Button */}
            {buttonText && (
              <button 
                className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-md font-medium transition-colors"
                style={{ color: textColor }}
              >
                {buttonText}
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Preview Settings */}
      <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center justify-between">
          <span>Animation:</span>
          <span className="font-medium capitalize">{animation}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Background:</span>
          <div className="flex items-center space-x-2">
            <div 
              className="w-4 h-4 rounded border"
              style={{ backgroundColor }}
            />
            <span className="font-mono">{backgroundColor}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span>Text Color:</span>
          <div className="flex items-center space-x-2">
            <div 
              className="w-4 h-4 rounded border"
              style={{ backgroundColor: textColor }}
            />
            <span className="font-mono">{textColor}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSliderPreview; 