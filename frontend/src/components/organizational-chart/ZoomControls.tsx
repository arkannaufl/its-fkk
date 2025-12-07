import React from 'react';

interface ZoomControlsProps {
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onZoomReset,
}) => {
  return (
    <div 
      className="absolute top-4 right-4 z-50 flex flex-col gap-1.5 bg-white/95 dark:bg-gray-800/95 rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-2.5 pointer-events-auto backdrop-blur-md"
      role="toolbar"
      aria-label="Zoom controls"
    >
      <button
        onClick={onZoomIn}
        className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
        title="Zoom In"
        aria-label="Zoom in"
      >
        <svg className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
      <button
        onClick={onZoomOut}
        className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
        title="Zoom Out"
        aria-label="Zoom out"
      >
        <svg className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
        </svg>
      </button>
      <button
        onClick={onZoomReset}
        className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
        title="Reset Zoom"
        aria-label="Reset zoom"
      >
        <svg className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
      <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
      <div 
        className="text-xs font-semibold text-center text-gray-700 dark:text-gray-300 px-2 py-1.5 bg-gray-50 dark:bg-gray-700/50 rounded-md"
        aria-live="polite"
        aria-atomic="true"
      >
        {Math.round(zoomLevel * 100)}%
      </div>
    </div>
  );
};

