// import React from 'react';
/* eslint-disable */
import {
  // NavLink,
  useSearchParams,
} from 'react-router-dom';
import { useAppContext } from './Context';
// import { useEffect } from 'react';

export const Pagination = () => {
  const { getPhone } = useAppContext();
  const { itemsOnPage } = useAppContext();
  const { currentPage, setCurrentPage } = useAppContext();
  setCurrentPage
  let totalPageCount = 0;

  if (getPhone && itemsOnPage) {
    totalPageCount = Math.ceil(getPhone.length / itemsOnPage);
  }

  const pageNumber: number[] = [];

  for (let i = 1; i <= totalPageCount; i += 1) {
    pageNumber.push(i);
  }

  const onNext = () => {
    const page = searchParams.get("page");
    if (currentPage !== (pageNumber.length) && page) {
      setSearchParams({page: `${+page + 1}`, perPage: `${itemsOnPage}`})
      // setCurrentPage(currentPage + 1);
    }
  };

  const onPrevious = () => {
    const page = searchParams.get("page");
    if (currentPage > 1 && page) {
      setSearchParams({page: `${+page - 1}`, perPage: `${itemsOnPage}`})
      // setCurrentPage(currentPage - 1);
    }
  };

  const [searchParams, setSearchParams] = useSearchParams();

  searchParams; // щоб не було помилки
  const changePage = (page: number) => {
    // const perPage = searchParams.get("perPage");
    setSearchParams({ page: `${page}`, perPage: `${itemsOnPage}` });
  };

  return pageNumber.length > 1 ? (
    <>
      <ul className="pagination">
        <li className={`pagination__page-item ${currentPage === pageNumber[0] && 'disabled'}`}>
          <a
            className="pagination__page-item__link"
            // // href="#prev"
            // aria-disabled={
            //   currentPage === 1
            // }
            onClick={onPrevious}
          >
            «
          </a>
        </li>

        {pageNumber.map(number => (
          <li className="pagination__page-item" key={number}>
            {/* <NavLink  */}
            <div
              key={number}
              className={`pagination__page-item__link ${currentPage === number && 'pagination__page-item__link--active'}`}

              onClick={() => changePage(number)}
            >
              {number}
            </div>
            {/* </NavLink> */}
          </li>
        ))}

        <li className={`pagination__page-item ${currentPage === pageNumber.length && 'disabled'}`}>
          <a
            className="pagination__page-item__link"
            // href="#next"
            // aria-disabled={
            //   currentPage === (pageNumber.length - 1)
            // }
            onClick={() => onNext()}
          >
            »
          </a>
        </li>
      </ul>
    </>
  ) : null;
};
