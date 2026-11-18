import { useLoaderData, useLocation, useNavigate } from 'react-router';

const PaginationContainer = () => {
  const { search, pathname } = useLocation();
  const navigate = useNavigate();

  const data = useLoaderData() as any;
  const meta = data?.meta;

  if (!meta || !meta.totalPages || meta.totalPages < 1) return null;

  const { totalPages, number } = meta;
  const pageNumber = number + 1; // Convert 0-based page number to 1-based for UI

  const handlePageChange = (page: number) => {
    const zeroBasedPage = page - 1;
    const searchParams = new URLSearchParams(search);
    searchParams.set('page', zeroBasedPage.toString());
    navigate(`${pathname}?${searchParams.toString()}`);
  };

  const renderPageButtons = () => {
    const pageButtons: JSX.Element[] = [];

    const addPageButton = (page: number, active: boolean) => {
      pageButtons.push(
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`btn btn-xs sm:btn-md border-none join-item ${active ? 'bg-base-300 border-base-300 font-bold' : ''
            }`}
        >
          {page}
        </button>
      );
    };

    const addEllipsis = (key: string) => {
      pageButtons.push(
        <button
          key={key}
          className="join-item btn btn-xs sm:btn-md btn-disabled cursor-default opacity-50"
        >
          ...
        </button>
      );
    };

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        addPageButton(i, i === pageNumber);
      }
      return pageButtons;
    }

    addPageButton(1, pageNumber === 1);

    if (pageNumber > 3) {
      addEllipsis('dots-1');
    }

    if (pageNumber !== 1 && pageNumber !== totalPages) {
      if (pageNumber > 2 && pageNumber < totalPages - 1) {
        addPageButton(pageNumber - 1, false);
        addPageButton(pageNumber, true);
        addPageButton(pageNumber + 1, false);
      } else if (pageNumber <= 2) {
        addPageButton(2, pageNumber === 2);
        addPageButton(3, pageNumber === 3);
      } else if (pageNumber >= totalPages - 1) {
        addPageButton(totalPages - 2, pageNumber === totalPages - 2);
        addPageButton(totalPages - 1, pageNumber === totalPages - 1);
      }
    } else {
      if (pageNumber === 1) {
        addPageButton(2, false);
        addPageButton(3, false);
      } else if (pageNumber === totalPages) {
        addPageButton(totalPages - 2, false);
        addPageButton(totalPages - 1, false);
      }
    }

    if (pageNumber < totalPages - 2) {
      addEllipsis('dots-2');
    }

    addPageButton(totalPages, pageNumber === totalPages);

    return pageButtons;
  };

  return (
    <div className="mt-16 flex justify-end">
      <div className="join">
        <button
          className="btn btn-xs sm:btn-md join-item"
          onClick={() => {
            let prevPage = number;
            if (prevPage === 0) {
              prevPage = totalPages - 1;
            } else {
              prevPage -= 1;
            }
            handlePageChange(prevPage + 1);
          }}
        >
          Prev
        </button>
        {renderPageButtons()}
        <button
          className="btn btn-xs sm:btn-md join-item"
          onClick={() => {
            let nextPage = number;
            if (nextPage === totalPages - 1) {
              nextPage = 0;
            } else {
              nextPage += 1;
            }
            handlePageChange(nextPage + 1);
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PaginationContainer;

