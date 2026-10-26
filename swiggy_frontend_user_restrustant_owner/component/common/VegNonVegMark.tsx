export const VEG_COLOR = "#0a8c3a";
export const NON_VEG_COLOR = "#8b4513";

type VegNonVegMarkProps = {
  isVeg?: boolean | null;
  size?: number;
  className?: string;
  showLabel?: boolean;
};

export default function VegNonVegMark({
  isVeg,
  size = 16,
  className = "",
  showLabel = false,
}: VegNonVegMarkProps) {
  const valid = typeof isVeg === "boolean";
  const color = isVeg ? VEG_COLOR : NON_VEG_COLOR;

  const mark = valid ? (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      role="img"
      aria-label={isVeg ? "Vegetarian" : "Non-Vegetarian"}
      className={`shrink-0 ${className}`}
    >
      <rect
        x="1.4"
        y="1.4"
        width="13.2"
        height="13.2"
        rx="1.8"
        fill="#ffffff"
        stroke={color}
        strokeWidth="1.7"
      />
      {isVeg ? (
        <circle cx="8" cy="8" r="3.9" fill={color} />
      ) : (
        <path
          d="M8 4.1 L12.1 11.6 H3.9 Z"
          fill={color}
          stroke={color}
          strokeWidth="1"
          strokeLinejoin="round"
        />
      )}
    </svg>
  ) : null;

  return !mark ? null : showLabel ? (
    <span
      className="inline-flex items-center gap-1.5"
      style={{ color }}
      title={isVeg ? "Vegetarian" : "Non-Vegetarian"}
    >
      {mark}
      <span className="text-[10px] font-bold uppercase tracking-wide">
        {isVeg ? "Veg" : "Non-Veg"}
      </span>
    </span>
  ) : mark;
}

export function VegNonVegLegend({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-center gap-4 text-[11px] font-semibold text-gray-500 ${className}`}
    >
      <span className="flex items-center gap-1.5" title="Vegetarian">
        <VegNonVegMark isVeg size={14} />
        Veg
      </span>
      <span className="flex items-center gap-1.5" title="Non-Vegetarian">
        <VegNonVegMark isVeg={false} size={14} />
        Non-Veg
      </span>
    </div>
  );
}
