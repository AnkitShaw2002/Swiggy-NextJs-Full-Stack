"use client";

import { Skeleton, SkeletonList } from "@/component/common/Skeleton";
import { ORDERS_SKELETON_COUNT } from "./OrdersView";

export default function OrdersSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50" aria-busy="true" aria-label="Loading orders">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
          <Skeleton width={150} height={16} />
          <Skeleton width={230} height={40} className="mt-4" />
          <Skeleton width={270} height={16} className="mt-3" />
        </div>
      </div>

      {/* Tabs + order cards */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 -mt-6 relative z-10 pb-16">
        <div className="flex items-center gap-2 pb-4">
          <Skeleton width={104} height={38} borderRadius={999} />
          <Skeleton width={78} height={38} borderRadius={999} />
          <Skeleton width={100} height={38} borderRadius={999} />
          <Skeleton width={104} height={38} borderRadius={999} />
        </div>

        <SkeletonList count={ORDERS_SKELETON_COUNT} variant="card" className="space-y-4" />
      </div>
    </div>
  );
}
