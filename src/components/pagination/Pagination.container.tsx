import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  // Maximum number of visible pages
  const visiblePageCount = 5;

  // Calculate the range of visible pages
  const getVisiblePages = () => {
    const startPage = Math.max(
      1,
      currentPage - Math.floor(visiblePageCount / 2)
    );
    const endPage = Math.min(totalPages, startPage + visiblePageCount - 1);

    // Adjust startPage if we're close to the last page to always show 5 pages
    const adjustedStartPage = Math.max(1, endPage - visiblePageCount + 1);
    return [...Array(endPage - adjustedStartPage + 1)].map(
      (_, i) => adjustedStartPage + i
    );
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex justify-center mt-4 space-x-2">
      {/* Previous Button */}
      <button
        className={`btn btn-primary ${currentPage === 1 ? 'btn-disabled' : ''}`}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      {/* Page Numbers */}
      {visiblePages.map((page) => (
        <button
          key={page}
          className={`btn ${page === currentPage ? 'btn-active' : ''}`}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button
        className={`btn btn-primary ${currentPage === totalPages ? 'btn-disabled' : ''}`}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
