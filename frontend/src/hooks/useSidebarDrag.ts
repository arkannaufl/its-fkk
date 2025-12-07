import { useState, useEffect, useRef, RefObject } from 'react';

interface SidebarPosition {
  x: number;
  y: number;
}

interface UseSidebarDragProps {
  isLocked: boolean;
  zoomLevel: number;
  containerRef: RefObject<HTMLDivElement | null>;
  zoomContainerRef?: RefObject<HTMLDivElement | null>;
  initialX?: number;
  initialY?: number;
}

interface UseSidebarDragReturn {
  sidebarPosition: SidebarPosition;
  isDragging: boolean;
  handleMouseDown: (e: React.MouseEvent) => void;
  sidebarRef: RefObject<HTMLDivElement | null>;
}

export const useSidebarDrag = ({
  isLocked,
  zoomLevel,
  containerRef,
  zoomContainerRef,
  initialX = 0,
  initialY = 0,
}: UseSidebarDragProps): UseSidebarDragReturn => {
  const [sidebarPosition, setSidebarPosition] = useState<SidebarPosition>({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef({ x: 0, y: 0, containerLeft: 0, containerTop: 0 });
  const [sidebarInitialized, setSidebarInitialized] = useState(false);

  // Initialize sidebar position on mount and update when zoom changes
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Use scroll container's scrollWidth to get actual available space
    const scrollContainer = containerRef.current;
    const scrollWidth = scrollContainer.scrollWidth;
    const actualZoomWidth = scrollWidth / zoomLevel;
    
    // Only initialize position on first mount, but allow updates when zoom changes significantly
    if (!sidebarInitialized) {
      setSidebarPosition({
        x: actualZoomWidth - 320 - 32 - 20, // 320px (w-80) + 32px padding + 20px margin
        y: 0,
      });
      setSidebarInitialized(true);
    } else {
      // Update position to stay within bounds when zoom changes
      setSidebarPosition((prev) => {
        const maxX = actualZoomWidth - 320 - 32 - 20;
        return {
          x: Math.min(prev.x, maxX),
          y: prev.y,
        };
      });
    }
  }, [sidebarInitialized, zoomLevel, containerRef]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isLocked || !containerRef.current) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    
    const zoomContainer = zoomContainerRef?.current || containerRef.current.querySelector('[style*="transform: scale"]') as HTMLElement;
    if (!zoomContainer) return;
    
    const zoomContainerRect = zoomContainer.getBoundingClientRect();
    
    // Calculate position in zoom container coordinates
    const zoomContainerX = (e.clientX - zoomContainerRect.left) / zoomLevel;
    const zoomContainerY = (e.clientY - zoomContainerRect.top) / zoomLevel;
    
    dragStartPos.current = {
      x: zoomContainerX - sidebarPosition.x,
      y: zoomContainerY - sidebarPosition.y,
      containerLeft: zoomContainerRect.left,
      containerTop: zoomContainerRect.top,
    };
  };

  useEffect(() => {
    if (!isDragging || isLocked) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      // Get the zoom container element
      const zoomContainer = zoomContainerRef?.current || containerRef.current.querySelector('[style*="transform: scale"]') as HTMLElement;
      if (!zoomContainer) return;
      
      const zoomContainerRect = zoomContainer.getBoundingClientRect();
      const sidebarWidth = 320; // w-80 = 320px
      const sidebarHeight = 400; // approximate height
      
      // Calculate new position relative to zoom container (in zoom container coordinates)
      const zoomContainerX = (e.clientX - zoomContainerRect.left) / zoomLevel;
      const zoomContainerY = (e.clientY - zoomContainerRect.top) / zoomLevel;
      
      let newX = zoomContainerX - dragStartPos.current.x;
      let newY = zoomContainerY - dragStartPos.current.y;
      
      // Get the actual available space in zoom container coordinates
      // The scroll container (containerRef) has scrollWidth/scrollHeight that represents
      // the total scrollable area. We need to convert this to zoom container coordinates.
      // When zoomed out (zoomLevel < 1), the zoom container is larger than viewport
      // because of minWidth: ${100 / zoomLevel}% and minHeight: ${100 / zoomLevel}%
      const scrollContainer = containerRef.current;
      const scrollWidth = scrollContainer.scrollWidth;
      const scrollHeight = scrollContainer.scrollHeight;
      
      // Convert scroll dimensions to zoom container coordinates
      // The scroll container's scrollWidth/scrollHeight is in viewport pixels
      // We need to convert to zoom container coordinates (which are scaled)
      const actualZoomWidth = scrollWidth / zoomLevel;
      const actualZoomHeight = scrollHeight / zoomLevel;
      
      // Constrain to actual zoom container bounds (accounting for padding)
      const padding = 32; // p-8 = 32px
      const margin = 20;
      const maxX = actualZoomWidth - sidebarWidth - padding - margin;
      const maxY = actualZoomHeight - sidebarHeight - padding - margin;
      
      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));
      
      setSidebarPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isLocked, zoomLevel]);

  return {
    sidebarPosition,
    isDragging,
    handleMouseDown,
    sidebarRef,
  };
};

