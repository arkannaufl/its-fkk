import { useEffect, useState, useRef } from "react";
import { ArrowUpIcon, ArrowDownIcon } from "../../icons";
import Badge from "../ui/badge/Badge";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

// Constants untuk animation
const ANIMATION_DURATION = 1500; // 1.5 seconds
const ANIMATION_STEPS = 60;

export default function MetricCard({
  title,
  value,
  icon,
  trend,
  className = "",
}: MetricCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Check if value is numeric
  const isNumeric = typeof value === "number";

  useEffect(() => {
    // Intersection Observer untuk trigger animation saat card masuk viewport
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

    const currentRef = cardRef.current;
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
    if (isVisible && isNumeric) {
      const targetValue = value as number;
      const increment = targetValue / ANIMATION_STEPS;
      const stepDuration = ANIMATION_DURATION / ANIMATION_STEPS;

      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= targetValue) {
          setDisplayValue(targetValue);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, stepDuration);

      return () => clearInterval(timer);
    } else if (isVisible && !isNumeric) {
      // For non-numeric values, display as string (handled in render)
      // No need to set displayValue for non-numeric
    }
  }, [isVisible, value, isNumeric]);

  return (
    <div
      ref={cardRef}
      className={`rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/5 md:p-6 ${className}`}
    >
      <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800 transition-transform duration-300 hover:scale-110">
        <span className="text-gray-800 dark:text-white/90">{icon}</span>
      </div>

      <div className="flex items-end justify-between mt-5">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {title}
          </span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90 tabular-nums">
            {isNumeric ? displayValue : value}
          </h4>
        </div>
        {trend && (
          <Badge color={trend.isPositive ? "success" : "error"}>
            {trend.isPositive ? <ArrowUpIcon /> : <ArrowDownIcon />}
            {Math.abs(trend.value).toFixed(1)}%
          </Badge>
        )}
      </div>
    </div>
  );
}
