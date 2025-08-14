import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  const generatePageNumbers = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(
          1,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
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
      <nav className="flex items-center gap-2 bg-white/90 backdrop-blur-sm p-2 rounded-2xl shadow-md border border-gray-100">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className={`group  relative h-12 w-12 flex items-center justify-center rounded-xl font-medium transition-all duration-200 ${currentPage === 1
              ? "text-warm-gray/30 cursor-not-allowed"
              : "text-warm-gray/70 cursor-pointer bg-cold-gray/50 hover:text-warm-gray shadow-lg transform hover:scale-105"
            }`}
          aria-label={t("components.pagination.previousPage")}
        >
          <FaChevronLeft size={16} />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1.5">
          {generatePageNumbers().map((page, index) =>
            page === "..." ? (
              <span
                key={`ellipsis-${index}`}
                className="h-12 w-12 flex items-center justify-center text-gray-400 select-none font-bold"
              >
                ⋯
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(Number(page))}
                className={`relative cursor-pointer h-12 min-w-[48px] px-3 flex items-center justify-center rounded-xl font-bold text-sm transition-all duration-200 transform hover:scale-105 ${currentPage === page
                    ? "bg-warm-gray text-off-white"
                    : "text-off-black bg-cold-gray/50 "
                  }`}
                aria-label={`${t("components.pagination.goToPage")} ${page}`}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </button>
            )
          )}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`group relative h-12 w-12 flex items-center justify-center rounded-xl font-medium transition-all duration-200 ${currentPage === totalPages
              ? "text-warm-gray/30 cursor-not-allowed"
              : "text-warm-gray/70 cursor-pointer bg-cold-gray/50 hover:text-warm-gray shadow-lg transform hover:scale-105"
            }`}
          aria-label={t("components.pagination.nextPage")}
        >
          <FaChevronRight size={16} />
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
