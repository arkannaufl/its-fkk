import type React from "react";
import { useEffect, useRef, useState } from "react";

interface DropdownProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

const TRANSITION_DURATION = 200;

export const Dropdown: React.FC<DropdownProps> = ({
  isOpen,
  onClose,
  children,
  className = "",
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest(".dropdown-toggle")
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let frameId: number | undefined;

    if (isOpen) {
      setShouldRender(true);
      frameId = requestAnimationFrame(() => setIsVisible(true));
    } else {
      setIsVisible(false);
      timeoutId = setTimeout(() => {
        setShouldRender(false);
      }, TRANSITION_DURATION);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [isOpen]);

  if (!shouldRender) return null;

  const animationClasses = isVisible
    ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
    : "opacity-0 -translate-y-2 scale-95 pointer-events-none";

  return (
    <div
      ref={dropdownRef}
      className={`absolute z-40 right-0 mt-2 rounded-xl border border-gray-200 bg-white shadow-theme-lg transition-all duration-200 ease-out origin-top dark:border-gray-800 dark:bg-gray-dark ${animationClasses} ${className}`}
    >
      {children}
    </div>
  );
};
