"use client";

import ReactPaginate from "react-paginate";

type PaginationProps = {
    pageCount: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    className?: string;
};

export default function Pagination({
    pageCount,
    currentPage,
    onPageChange,
    className = "",
}: PaginationProps) {
    if (pageCount <= 1) return null;

    return (
        <div
            className={`flex items-center justify-end border-t border-black/5 px-5 py-3 ${className}`}
        >
            <ReactPaginate
                pageCount={pageCount}
                forcePage={Math.min(currentPage, pageCount) - 1}
                onPageChange={({ selected }) => onPageChange(selected + 1)}
                pageRangeDisplayed={3}
                marginPagesDisplayed={1}
                breakLabel="..."
                previousLabel="Prev"
                nextLabel="Next"
                containerClassName="flex items-center gap-1.5"
                pageClassName=""
                pageLinkClassName="flex h-8 min-w-8 items-center justify-center rounded-lg border border-gray-200 px-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                activeClassName="page-active"
                activeLinkClassName="border-[#FC8019] bg-orange-50 text-[#FC8019]"
                breakClassName=""
                breakLinkClassName="flex h-8 min-w-8 items-center justify-center text-sm text-gray-400"
                previousClassName=""
                previousLinkClassName="flex h-8 items-center rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                nextClassName=""
                nextLinkClassName="flex h-8 items-center rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                disabledClassName="pointer-events-none opacity-40"
            />
        </div>
    );
}
