import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const generatePageNumbers = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center">
      <nav className="flex items-center gap-1 py-1.5 bg-off-black rounded-xl shadow-sm">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="group relative h-9 w-9 flex items-center justify-center rounded-lg text-off-black transition-all duration-200 bg-off-white hover:bg-cold-gray disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent cursor-pointer"
          aria-label="Previous page"
        >
          <FaChevronLeft />
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-off-black text-off-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Previous
          </div>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1 px-1">
          {generatePageNumbers().map((page, index) =>
            page === "..." ? (
              <span
                key={`ellipsis-${index}`}
                className="h-9 w-9 flex items-center justify-center text-cold-gray/70 select-none"
              >
                ⋯
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(Number(page))}
                className={`relative cursor-pointer h-9 min-w-[36px] px-2 flex items-center justify-center rounded-lg font-medium text-sm transition-all duration-200 ${
                  currentPage === page
                    ? "bg-off-white text-off-black shadow-md shadow-blue-600/25"
                    : "text-cold-gray/70 hover:bg-cold-gray hover:text-warm-gray/80"
                }`}
                aria-label={`Go to page ${page}`}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
                {currentPage === page && (
                  <div className="absolute inset-0 rounded-lg opacity-10 animate-pulse"></div>
                )}
              </button>
            )
          )}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="group relative h-9 w-9 flex items-center justify-center rounded-lg text-off-black transition-all duration-200 bg-off-white hover:bg-cold-gray disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent cursor-pointer"
          aria-label="Next page"
        >
          <FaChevronRight />
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-off-black text-off-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Next
          </div>
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
