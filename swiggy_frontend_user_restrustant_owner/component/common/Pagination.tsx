"use client";

import ReactPaginate from "react-paginate";

/**
 * Shared react-paginate widget. Pages own their own page size (items per
 * page) - this component only renders the controls for the page count the
 * caller worked out.
 */
export interface PaginationProps {
  pageCount: number;
  /** 0-based page index currently shown. */
  currentPage: number;
  onPageChange: (page: number) => void;
  /** Extra classes for the wrapper (spacing lives with the caller). */
  className?: string;
  pageRangeDisplayed?: number;
  marginPagesDisplayed?: number;
}

export default function Pagination({
  pageCount,
  currentPage,
  onPageChange,
  className = "",
  pageRangeDisplayed = 2,
  marginPagesDisplayed = 1,
}: PaginationProps) {
  const linkClass =
    "block px-3.5 py-2 rounded-xl text-xs font-bold text-gray-600 bg-white border border-gray-200 hover:border-[#fc8019] hover:text-[#fc8019] transition";

  return pageCount <= 1 ? null : (
    <nav className={`flex justify-center ${className}`} aria-label="Pagination">
      <ReactPaginate
        pageCount={pageCount}
        forcePage={currentPage}
        pageRangeDisplayed={pageRangeDisplayed}
        marginPagesDisplayed={marginPagesDisplayed}
        breakLabel="…"
        previousLabel="‹ Prev"
        nextLabel="Next ›"
        onPageChange={({ selected }) => onPageChange(selected)}
        containerClassName="app-pagination flex items-center gap-1.5"
        pageLinkClassName={linkClass}
        activeClassName="is-active"
        previousClassName="block"
        nextClassName="block"
        previousLinkClassName={linkClass}
        nextLinkClassName={linkClass}
        disabledClassName="opacity-40 pointer-events-none"
        breakClassName="px-2 text-xs text-gray-400"
      />
    </nav>
  );
}
