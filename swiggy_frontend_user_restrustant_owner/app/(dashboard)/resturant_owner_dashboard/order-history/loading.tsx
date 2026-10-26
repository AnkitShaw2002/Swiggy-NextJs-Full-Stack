import { Skeleton, SkeletonList } from "@/component/common/Skeleton";

/** Streaming fallback while the server-rendered order history loads. */
export default function OrderHistoryLoading() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-5" aria-busy="true">
      {/* SUMMARY BAR */}
      <div className="bg-white p-4 rounded-md shadow-xs border border-gray-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Skeleton width={140} height={14} />
          <Skeleton width={250} height={11} className="mt-2" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton width={96} height={30} borderRadius={6} />
          <Skeleton width={116} height={30} borderRadius={6} />
          <Skeleton width={116} height={30} borderRadius={6} />
        </div>
      </div>

      {/* LIST CONTAINER */}
      <div className="bg-white rounded-md border border-gray-200 shadow-xs overflow-hidden">
        <div className="bg-[#2b323b] px-4 py-3 flex items-center gap-4 border-b border-gray-700">
          <Skeleton
            width={72}
            height={14}
            borderRadius={4}
            baseColor="#3c444d"
            highlightColor="#4b535d"
          />
          <Skeleton
            width={118}
            height={14}
            borderRadius={4}
            baseColor="#3c444d"
            highlightColor="#4b535d"
          />
          <Skeleton
            width={118}
            height={14}
            borderRadius={4}
            baseColor="#3c444d"
            highlightColor="#4b535d"
          />
        </div>

        <div className="p-4">
          <SkeletonList count={4} variant="card" className="space-y-4" />
        </div>
      </div>
    </div>
  );
}
