"use client";

import { Skeleton, SkeletonList } from "@/component/common/Skeleton";

/** Placeholder food cards drawn while the menu loads - change it here. */
export const RESTAURANT_SKELETON_COUNT = 4;

export default function RestaurantDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50" aria-busy="true" aria-label="Loading restaurant">
      {/* Hero */}
      <div className="h-64 sm:h-80 overflow-hidden">
        <Skeleton height="100%" borderRadius={0} />
      </div>

      {/* Info bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4">
          <div className="flex items-center gap-6">
            <Skeleton width={90} height={36} />
            <Skeleton width={90} height={36} />
            <Skeleton width={90} height={36} />
          </div>
        </div>
      </div>

      {/* Category chips */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex items-center gap-2 py-3">
            <Skeleton width={72} height={34} borderRadius={999} />
            <Skeleton width={96} height={34} borderRadius={999} />
            <Skeleton width={84} height={34} borderRadius={999} />
            <Skeleton width={110} height={34} borderRadius={999} />
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 pb-32">
        <div className="mb-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div>
              <Skeleton width={90} height={22} />
              <Skeleton width={180} height={14} className="mt-2" />
            </div>
            <Skeleton width={240} height={40} borderRadius={12} />
          </div>
          <Skeleton height={64} borderRadius={16} />
        </div>

        <SkeletonList count={RESTAURANT_SKELETON_COUNT} variant="row" />

        <div className="mt-8 flex justify-center gap-2">
          <Skeleton width={86} height={36} borderRadius={12} />
          <Skeleton width={36} height={36} borderRadius={12} />
          <Skeleton width={36} height={36} borderRadius={12} />
          <Skeleton width={86} height={36} borderRadius={12} />
        </div>
      </div>
    </div>
  );
}
