import { memo, useRef, useState, useCallback, useEffect } from "react";

interface RangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  label?: string;
  formatValue?: (value: number) => string;
}

function RangeSliderComponent({
  min,
  max,
  value,
  onChange,
  label,
  formatValue = (v) => v.toString(),
}: RangeSliderProps) {
  const [isDragging, setIsDragging] = useState<"min" | "max" | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const getPercentage = (val: number) => {
    return ((val - min) / (max - min)) * 100;
  };

  const handleMouseDown = (thumb: "min" | "max") => {
    setIsDragging(thumb);
  };

  const handleMove = useCallback(
    (clientX: number) => {
      if (!isDragging || !trackRef.current) return;

      const rect = trackRef.current.getBoundingClientRect();
      const percentage = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
      const newValue = Math.round(min + (percentage / 100) * (max - min));

      if (isDragging === "min") {
        onChange([Math.min(newValue, value[1]), value[1]]);
      } else {
        onChange([value[0], Math.max(newValue, value[0])]);
      }
    },
    [isDragging, min, max, value, onChange]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      handleMove(e.clientX);
    },
    [handleMove]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      handleMove(e.touches[0].clientX);
    },
    [handleMove]
  );

  const handleEnd = useCallback(() => {
    setIsDragging(null);
  }, []);

  // Add/remove event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleEnd);
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleEnd);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleEnd);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleEnd);
      };
    }
  }, [isDragging, handleMouseMove, handleTouchMove, handleEnd]);

  const minPercentage = getPercentage(value[0]);
  const maxPercentage = getPercentage(value[1]);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}: {formatValue(value[0])} - {formatValue(value[1])}
        </label>
      )}
      <div className="relative pt-6 pb-3">
        {/* Track */}
        <div
          ref={trackRef}
          className="relative h-2 bg-gray-200 rounded-full cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const percentage = ((e.clientX - rect.left) / rect.width) * 100;
            const clickValue = Math.round(min + (percentage / 100) * (max - min));

            // Set to nearest thumb
            const distToMin = Math.abs(clickValue - value[0]);
            const distToMax = Math.abs(clickValue - value[1]);

            if (distToMin < distToMax) {
              onChange([clickValue, value[1]]);
            } else {
              onChange([value[0], clickValue]);
            }
          }}
        >
          {/* Active range */}
          <div
            className="absolute h-full bg-blue-600 rounded-full"
            style={{
              left: `${minPercentage}%`,
              width: `${maxPercentage - minPercentage}%`,
            }}
          />

          {/* Min thumb */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-blue-600 rounded-full shadow-md cursor-grab active:cursor-grabbing transition-transform ${
              isDragging === "min" ? "scale-110" : "hover:scale-110"
            }`}
            style={{ left: `${minPercentage}%`, marginLeft: "-10px" }}
            onMouseDown={() => handleMouseDown("min")}
            onTouchStart={() => handleMouseDown("min")}
          >
            {/* Value tooltip */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              {formatValue(value[0])}
            </div>
          </div>

          {/* Max thumb */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-blue-600 rounded-full shadow-md cursor-grab active:cursor-grabbing transition-transform ${
              isDragging === "max" ? "scale-110" : "hover:scale-110"
            }`}
            style={{ left: `${maxPercentage}%`, marginLeft: "-10px" }}
            onMouseDown={() => handleMouseDown("max")}
            onTouchStart={() => handleMouseDown("max")}
          >
            {/* Value tooltip */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              {formatValue(value[1])}
            </div>
          </div>
        </div>

        {/* Min/Max labels */}
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>{formatValue(min)}</span>
          <span>{formatValue(max)}</span>
        </div>
      </div>
    </div>
  );
}

export const RangeSlider = memo(RangeSliderComponent);
