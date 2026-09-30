interface CataloguePaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}


function CataloguePagination({
  page,
  totalPages,
  onPageChange,
}: CataloguePaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      className="pagination"
      aria-label="Pagination du catalogue"
    >
      <button
        type="button"
        className="pagination-arrow"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Page précédente"
      >
        ←
      </button>

      <div className="pagination-pages">
        {Array.from(
          { length: totalPages },
          (_, index) => index + 1,
        ).map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            className={
              pageNumber === page
                ? "pagination-page pagination-page-active"
                : "pagination-page"
            }
            onClick={() => onPageChange(pageNumber)}
            aria-label={`Aller à la page ${pageNumber}`}
            aria-current={
              pageNumber === page ? "page" : undefined
            }
          >
            {pageNumber}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="pagination-arrow"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Page suivante"
      >
        →
      </button>
    </nav>
  );
}


export default CataloguePagination;