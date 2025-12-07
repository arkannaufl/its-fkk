import { useState, useCallback } from 'react';

interface UseZoomControlsReturn {
  zoomLevel: number;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleZoomReset: () => void;
}

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.1;

export const useZoomControls = (initialZoom: number = 1): UseZoomControlsReturn => {
  const [zoomLevel, setZoomLevel] = useState(initialZoom);

  const handleZoomIn = useCallback(() => {
    setZoomLevel((prev) => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel((prev) => Math.max(prev - ZOOM_STEP, MIN_ZOOM));
  }, []);

  const handleZoomReset = useCallback(() => {
    setZoomLevel(initialZoom);
  }, [initialZoom]);

  return {
    zoomLevel,
    handleZoomIn,
    handleZoomOut,
    handleZoomReset,
  };
};

