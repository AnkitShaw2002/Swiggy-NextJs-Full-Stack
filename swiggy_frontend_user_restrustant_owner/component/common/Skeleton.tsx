"use client";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export { Skeleton };

export type SkeletonVariant = "row" | "card";

/** Food-menu style row: thumbnail, text lines, action button. */
function RowSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="flex items-center gap-4 p-4">
        <Skeleton width={112} height={112} borderRadius={12} className="shrink-0" />
        <div className="flex-1 min-w-0">
          <Skeleton width="45%" height={16} />
          <Skeleton width="85%" height={12} className="mt-2" />
          <Skeleton width="30%" height={14} className="mt-3" />
        </div>
        <Skeleton width={84} height={38} borderRadius={12} />
      </div>
    </div>
  );
}

/** Order-card style row: icon block, text lines, status pill, footer. */
function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="p-5 pb-0">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Skeleton width={40} height={40} borderRadius={12} />
            <div>
              <Skeleton width={110} height={14} />
              <Skeleton width={70} height={11} className="mt-1.5" />
            </div>
          </div>
          <Skeleton width={96} height={26} borderRadius={999} />
        </div>
        <Skeleton width="60%" height={14} />
        <Skeleton width="40%" height={12} className="mt-2" />
      </div>
      <div className="px-5 pb-4 pt-3">
        <Skeleton width="100%" height={8} borderRadius={999} />
      </div>
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton width={70} height={20} borderRadius={999} />
          <Skeleton width={48} height={12} />
        </div>
        <Skeleton width={72} height={18} />
      </div>
    </div>
  );
}

export interface SkeletonListProps {
  /** How many placeholder cards to render - set per page. */
  count?: number;
  variant?: SkeletonVariant;
  className?: string;
}

/**
 * Shared react-loading-skeleton list. Every page passes its own `count` so
 * one screen can flash 4 cards while another flashes 6.
 */
export default function SkeletonList({
  count = 4,
  variant = "row",
  className = "space-y-3",
}: SkeletonListProps) {
  const Card = variant === "card" ? CardSkeleton : RowSkeleton;
  const total = Math.max(0, count);

  return (
    <div className={className} aria-busy="true" aria-label="Loading list">
      {Array.from({ length: total }, (_, index) => (
        <Card key={index} />
      ))}
    </div>
  );
}

// Also available as a named import: { SkeletonList }
export { SkeletonList };
