import { useLoaderData } from 'react-router';
import { useLocation, useNavigate } from 'react-router';

const PaginationContainer = () => {
  const { search, pathname } = useLocation();
  const navigate = useNavigate();

  const { meta } = useLoaderData();
  const { totalPages, number } = meta ?? {};

  const pages = Array.from({ length: totalPages }, (_, index) => {
    return index + 1; // Generate one-based page numbers for display
  });

  const handlePageChange = (pageNumber: number) => {
    // Convert one-based page number to zero-based for navigation
    const zeroBasedPage = pageNumber - 1;
    const searchParams = new URLSearchParams(search);
    console.log('insdi handle change', zeroBasedPage);
    searchParams.set('page', zeroBasedPage.toString());
    navigate(`${pathname}?${searchParams.toString()}`);
  };

  return (
    <div className="mt-16 flex justify-end">
      <div className="join">
        <button
          className="btn btn-xs sm:btn-md join-item"
          onClick={() => {
            // Adjust `number` to be one-based for display logic
            let prevPage = number; // Zero-based current page
            if (prevPage === 0)
              prevPage = totalPages - 1; // Wrap around to last page
            else prevPage -= 1;
            handlePageChange(prevPage + 1); // Convert to one-based
          }}
        >
          Prev
        </button>
        {pages.map((currentPageNumber) => {
          return (
            <button
              key={currentPageNumber}
              onClick={() => handlePageChange(currentPageNumber)}
              className={`btn btn-xs sm:btn-md border-none join-item ${
                currentPageNumber === number + 1 // Compare one-based to UI numbers
                  ? 'bg-base-300 border-base-300 '
                  : ''
              }`}
            >
              {currentPageNumber}
            </button>
          );
        })}
        <button
          className="btn btn-xs sm:btn-md join-item"
          onClick={() => {
            // Adjust `number` to be one-based for display logic
            let nextPage = number; // Zero-based current page
            if (nextPage === totalPages - 1)
              nextPage = 0; // Wrap around to first page
            else nextPage += 1;
            handlePageChange(nextPage + 1); // Convert to one-based
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PaginationContainer;
