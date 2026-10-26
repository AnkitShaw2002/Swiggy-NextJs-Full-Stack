type SkeletonProps = {
    className?: string;
};

export function Skeleton({ className = "" }: SkeletonProps) {
    return <div className={`animate-pulse rounded-md bg-gray-200 ${className}`} />;
}

export function SkeletonCard({ className = "" }: SkeletonProps) {
    return (
        <div className={`rounded-xl border border-black/5 bg-white p-5 ${className}`}>
            <Skeleton className="h-3 w-28" />
            <Skeleton className="mt-3 h-7 w-16" />
        </div>
    );
}

const COLUMN_WIDTHS = ["w-24", "w-32", "w-28", "w-20", "w-36", "w-24", "w-32", "w-28"];

export function TableSkeleton({
    rows = 6,
    columns = 6,
}: {
    rows?: number;
    columns?: number;
}) {
    return (
        <>
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <tr key={rowIndex} className="border-b border-black/5 last:border-0">
                    {Array.from({ length: columns }).map((__, colIndex) => (
                        <td key={colIndex} className="px-5 py-4">
                            <Skeleton
                                className={`h-3.5 ${COLUMN_WIDTHS[colIndex % COLUMN_WIDTHS.length]}`}
                            />
                        </td>
                    ))}
                </tr>
            ))}
        </>
    );
}

export function PageSkeleton({
    title = true,
    cards = 3,
    columns = 6,
    rows = 6,
}: {
    title?: boolean;
    cards?: number;
    columns?: number;
    rows?: number;
}) {
    return (
        <div className="flex min-h-screen bg-[#F7F7F5] text-[#282C3F]">
            <div className="flex-1 md:ml-64">
                <header className="sticky top-0 z-10 flex items-center justify-between border-b border-black/5 bg-white/90 px-8 py-4 backdrop-blur">
                    <div>
                        {title && <Skeleton className="h-5 w-44" />}
                        <Skeleton className="mt-2 h-3 w-60" />
                    </div>
                    <Skeleton className="h-9 w-9 rounded-full" />
                </header>

                <main className="px-8 py-6">
                    <div className="mb-6 grid gap-4 sm:grid-cols-3">
                        {Array.from({ length: cards }).map((_, index) => (
                            <SkeletonCard key={index} />
                        ))}
                    </div>

                    <div className="overflow-hidden rounded-xl border border-black/5 bg-white">
                        <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-9 w-72 rounded-lg" />
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-black/5 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                                        {Array.from({ length: columns }).map((_, index) => (
                                            <th key={index} className="px-5 py-3">
                                                <Skeleton className="h-3 w-20" />
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    <TableSkeleton rows={rows} columns={columns} />
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default PageSkeleton;
