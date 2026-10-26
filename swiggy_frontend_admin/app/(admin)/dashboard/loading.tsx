import { PageSkeleton } from "@/component/common/skeleton";

export default function Loading() {
    return <PageSkeleton cards={4} columns={5} rows={5} />;
}
