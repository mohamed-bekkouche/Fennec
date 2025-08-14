import React from "react";
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

// Demo Component
function PaginationDemo() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const totalPages = 25;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Modern Pagination Component
          </h1>
          <p className="text-gray-600 text-lg">
            A sleek, accessible pagination with smooth animations and modern
            design
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-blue-700 font-medium">
              <span>Current Page:</span>
              <span className="font-bold">{currentPage}</span>
              <span>of</span>
              <span className="font-bold">{totalPages}</span>
            </div>
          </div>

          <div className="flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">
              ✨ Modern Design
            </h3>
            <p className="text-gray-600 text-sm">
              Clean, minimalist design with subtle shadows and smooth
              transitions
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">🎯 Accessible</h3>
            <p className="text-gray-600 text-sm">
              Full keyboard navigation, ARIA labels, and screen reader support
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">🚀 Interactive</h3>
            <p className="text-gray-600 text-sm">
              Hover tooltips, smooth animations, and visual feedback
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pagination;
