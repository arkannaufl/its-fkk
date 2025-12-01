import { useEffect, useState, useRef } from "react";

interface ProgressBarProps {
  label: string;
  value: number; // 0-100
  sublabel?: string;
  color?: "brand" | "success" | "warning" | "error" | "info";
  showPercentage?: boolean;
  className?: string;
}

// Constants untuk animation
const ANIMATION_DURATION = 1500; // 1.5 seconds
const ANIMATION_STEPS = 60;

const colorClasses = {
  brand: "bg-brand-500",
  success: "bg-success-500",
  warning: "bg-warning-500",
  error: "bg-error-500",
  info: "bg-blue-light-500",
};

export default function ProgressBar({
  label,
  value,
  sublabel,
  color = "brand",
  showPercentage = true,
  className = "",
}: ProgressBarProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const clampedValue = Math.min(100, Math.max(0, value));

  useEffect(() => {
    // Intersection Observer untuk trigger animation saat progress bar masuk viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    const currentRef = progressRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const increment = clampedValue / ANIMATION_STEPS;
      const stepDuration = ANIMATION_DURATION / ANIMATION_STEPS;

      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= clampedValue) {
          setAnimatedValue(clampedValue);
          setIsAnimating(false);
          clearInterval(timer);
        } else {
          setAnimatedValue(current);
        }
      }, stepDuration);

      return () => clearInterval(timer);
    }
  }, [isVisible, clampedValue]);

  return (
    <div
      ref={progressRef}
      className={`flex items-center justify-between ${className}`}
    >
      <div className="flex items-center gap-3">
        <div>
          <p className="font-semibold text-gray-800 text-theme-sm dark:text-white/90">
            {label}
          </p>
          {sublabel && (
            <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
              {sublabel}
            </span>
          )}
        </div>
      </div>

      <div className="flex w-full max-w-[140px] items-center gap-3">
        <div className="relative block h-2 w-full max-w-[100px] rounded-sm bg-gray-200 dark:bg-gray-800 overflow-hidden">
          <div
            className={`absolute left-0 top-0 flex h-full items-center justify-center rounded-sm ${colorClasses[color]} text-xs font-medium text-white transition-all duration-1000 ease-out`}
            style={{
              width: `${animatedValue}%`,
            }}
          >
            {/* Shimmer effect - only show during animation */}
            {isAnimating && (
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
            )}
          </div>
        </div>
        {showPercentage && (
          <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90 tabular-nums min-w-12">
            {Math.round(animatedValue)}%
          </p>
        )}
      </div>
    </div>
  );
}
