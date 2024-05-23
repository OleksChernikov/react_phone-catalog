import { useEffect, useRef, useState } from 'react';
import { NavLink, useSearchParams } from 'react-router-dom';
import { ClockLoader } from 'react-spinners';
import { useAppContext } from './Context';
import ArrowDown from '../img/arrow-down.svg';
import ArrowUp from '../img/arrow-up.svg';
// import FavoriteAdded from '../img/favourites filled.svg';
import filledFavoriteImage from '../img/favourites-filled.svg';
import { Pagination } from './Pagination';
// import { set } from 'cypress/types/lodash';
// import { getSearchWith } from './until/Helper';
// import { SearchLink } from '../components/SearchLink';

// import cn from 'classnames';
/* eslint-disable */
interface ProductList {
  id: string;
  category: string;
  phoneId: string;
  itemId: string;
  name: string;
  fullPrice: number;
  price: number;
  screen: string;
  capacity: string;
  color: string;
  ram: string;
  year: number;
  image: string;
}

export const ProductList = () => {
  // const { page, perPage, sortParam } = useParams();
  const { itemsOnPage, setItemsOnPage } = useAppContext();
  const { sortParam, setSortParam } = useAppContext();
  const [changeSort, setChangeSort] = useState<boolean>(false);
  const { favoritePhones, setFavoritePhones } = useAppContext();
  const { prevFavoriteArr, setPrevFavoriteArr } = useAppContext();
  const { cartPhones, setCartPhones } = useAppContext();
  const { prevCartPhonesArr, setPrevCartPhonesArr } = useAppContext();
  const { setCurrentPage } = useAppContext();
  const { getPhone, setGetPhone } = useAppContext();
  const  { visibleElems } = useAppContext();
  const { setSelectedProduct } = useAppContext();
  const { setSortedPhones } = useAppContext();
  const { query } = useAppContext();
  // const { query, setQuery } = useAppContext();
  const [searchParams, setSearchParams] = useSearchParams();

  const [errorMessage, setErrorMessage] = useState('');
  const [changeItemsOnPage, setChangeItemsOnPage] = useState<boolean>(false);
  const [price, setPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  // eslint-disable-next-line max-len
  const url = 'https://mate-academy.github.io/react_phone-catalog/_new/products.json';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data = await response.json();

        const sorted = [...data];
        sorted.sort((phoneA, phoneB) => phoneB.year - phoneA.year);
        setSortedPhones(sorted);

        setGetPhone(data);
        setItemsOnPage(data.length)
        setLoading(false);
        const perPage = searchParams.get("perPage");
        if (!perPage || perPage === null) {
          setItemsOnPage(data.length)
        }
      } catch (error) {
        setErrorMessage('Error during fetch:');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const blockItemsRef = useRef<HTMLDivElement>(null);
  const blockSortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (blockItemsRef.current && !blockItemsRef.current.contains(event.target as Node)) {
        setChangeItemsOnPage(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (blockSortRef.current && !blockSortRef.current.contains(event.target as Node)) {
        setChangeSort(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChangeItems = () => {
    if (!changeItemsOnPage) {
      setChangeItemsOnPage(true);
    } else {
      setChangeItemsOnPage(false);
    }
  };

  const handleSort = (sotr: string) => {
    handleChangeSort()
      const params = new URLSearchParams(searchParams);

      if (sotr === "Newest") {
        params.set('sortBy', sotr);
      }

      if (sotr === "Alphabetically") {
        params.set('sortBy', sotr);
      }

      if (sotr === "Cheapest") {
        params.set('sortBy', sotr);
      }
      setSearchParams(params)
      setSortParam(sotr)
  }

  const handleChangeSort = () => {
    if (!changeSort) {
      setChangeSort(true);
    } else {
      setChangeSort(false);
    }
  };

  useEffect(() => {
    if(prevCartPhonesArr) {
      localStorage.setItem('savedCartName',  JSON.stringify(prevCartPhonesArr));
    }
  }, [prevCartPhonesArr]);

  useEffect(() => {
    const savedValue = localStorage.getItem('savedCartName');
    if (savedValue) {
      setPrevCartPhonesArr(JSON.parse(savedValue));
    }
  }, []);
  
  
  useEffect(() => {
    let newProductInCart = { id: cartPhones, count: 1, fullPrice: price };
    if (cartPhones.trim() !== "") {
      if (prevCartPhonesArr?.some(elem => elem.id === cartPhones)) {
        setPrevCartPhonesArr(prevCartPhonesArr => prevCartPhonesArr?.filter(phone => phone.id !== cartPhones));
      } else {
        setPrevCartPhonesArr(prevCartPhonesArr => prevCartPhonesArr ? [...prevCartPhonesArr, newProductInCart] : [newProductInCart]);
      }
    }
    setCartPhones('');
    setPrice(0);
}, [cartPhones, prevCartPhonesArr]);

  useEffect(() => {
    if (favoritePhones.trim() !== "") {
      if (prevFavoriteArr?.includes(favoritePhones)) {
        setPrevFavoriteArr(prevFavoriteArr => prevFavoriteArr?.filter(phone => phone !== favoritePhones));
      } else {
        setPrevFavoriteArr(prevFavoriteArr => (prevFavoriteArr ? [...prevFavoriteArr, favoritePhones] : [favoritePhones]));
      }
    }
    setFavoritePhones(''); 
  }, [favoritePhones, prevFavoriteArr]);

  errorMessage;

  useEffect(() => {
    const page = searchParams.get("page");
    const perPage = searchParams.get("perPage");
    if(page !== null && page) {
      setCurrentPage(+page)
    }

    if(perPage !== null && perPage !== 'all') {
      setItemsOnPage(+perPage)
    }

    if(perPage === 'all') {
      setItemsOnPage(getPhone?.length)
    }
  },[searchParams])

  useEffect(() => {
    if (getPhone) {
      let sortedPhones = [...getPhone];
      const sortBy = searchParams.get("sortBy");

      if (!sortBy || sortBy === null && sortParam){
        setSortParam("Newest")
      } 

      if(sortBy) {
        setSortParam(sortBy)
      }
        if (sortBy === "Newest") {
          sortedPhones = sortedPhones.sort((phoneA, phoneB) => phoneB.year - phoneA.year);
        }
    
        if (sortBy === "Alphabetically") {
          sortedPhones = sortedPhones.sort((phoneA, phoneB) => phoneA.name.localeCompare(phoneB.name))
        }

        if (sortBy === "Cheapest") {
          sortedPhones = sortedPhones.sort((phoneA, phoneB) => phoneA.price - phoneB.price)
        }
        setSortedPhones(sortedPhones)
    }
  }, [searchParams])

  const change = (param: number | undefined) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", `1`);
    params.set("perPage", `${param === getPhone?.length ? "all" : param}`);

    setSearchParams(params);
  }

  return (
    <>
    <section className="phones__wrapper" data-cy="productList">
      <div className="phones__content">
        {loading && (
          <div className="clockLoader__wrapper">
            <ClockLoader size={40} loading={loading} className="clockLoader__content"/>
          </div>
        )}
        {!loading && (
        <>
        <div className="phones__header">
          <h3 className="phones__header__title">Mobile phones</h3>
          {!query ? (
            <p className="phones__header__paragraph">
              {`${getPhone?.length} models`}
            </p>
          ): 
            <p className="phones__header__paragraph">
              {`Search result - ${visibleElems?.length}`}
            </p>
          }

          {!query && <div className="phones__header__buttons">
            <div className="phones__header__buttons__sort" ref={blockSortRef}>
              <h5 className="phones__header__buttons__sort__title">Sort by</h5>
              <button className="phones__header__buttons__sort__button" onClick={handleChangeSort}>
                <span className="phones__header__buttons__sort__button__text">{sortParam}</span>
                <img className="phones__header__buttons__sort__button__img" src={changeSort ? ArrowUp : ArrowDown} alt="" />
              </button>
              {changeSort
                && (
                  <div className="phones__header__buttons__sort__select">
                    <span
                      className="phones__header__buttons__sort__select__option"
                      onClick={() => {
                        // setSortParam('Newest');
                        //  handleChangeSort();
                        handleSort('Newest')
                      }}
                    >
                      Newest
                    </span>
                    <span
                      className="phones__header__buttons__sort__select__option"
                      onClick={() => {
                        // setSortParam('Alphabetically');
                        //  handleChangeSort();
                        handleSort('Alphabetically');
                      }}
                    >
                      Alphabetically
                    </span>
                    <span
                      className="phones__header__buttons__sort__select__option"
                      onClick={() => {
                        // setSortParam('Cheapest');
                        //  handleChangeSort();
                        handleSort('Cheapest');
                      }}
                    >
                      Cheapest
                    </span>
                  </div>
                )}
            </div>
            <div className="phones__header__buttons__amount" ref={blockItemsRef}>
              <h5 className="phones__header__buttons__amount__title">Items on page</h5>
              <button className="phones__header__buttons__amount__button" onClick={handleChangeItems}>
                <span className="phones__header__buttons__amount__button__text">{itemsOnPage !== getPhone?.length ? itemsOnPage : "all"}</span>
                <img className="phones__header__buttons__amount__button__img" src={changeItemsOnPage ? ArrowUp : ArrowDown} alt="arrow" />
              </button>
              {changeItemsOnPage
                && (
                  <div className="phones__header__buttons__amount__select">
                    <span
                      className="phones__header__buttons__amount__select__option"
                      onClick={() => {
                        handleChangeItems(); setCurrentPage(1); change(4);
                      }}
                    >
                      4
                    </span>
                    <span
                      className="phones__header__buttons__amount__select__option"
                      onClick={() => {
                        handleChangeItems(); setCurrentPage(1); change(8);
                      }}
                    >
                      8
                    </span>
                    <span
                      className="phones__header__buttons__amount__select__option"
                      onClick={() => {
                        handleChangeItems(); setCurrentPage(1); change(16);
                      }}
                    >
                      16
                    </span>
                    <span
                      className="phones__header__buttons__amount__select__option"
                      onClick={() => {
                        handleChangeItems(); setCurrentPage(1); change(getPhone?.length);
                      }}
                    >
                      all
                    </span>
                  </div>
                )}
            </div>
          </div>}
        </div>
        <div className="phones__goods">
          <div className="phones__goods__cards">
            {!!visibleElems && visibleElems.map((phone) => (
              <div className="hot-prices__goods__cards__good-card">
                {/* <p>{phone.itemId}</p> */}
                <NavLink
                  to={`/phones/${phone.itemId}`}
                  onClick={() =>setSelectedProduct(phone.itemId)}
                >
                  <img
                    src={`https://mate-academy.github.io/react_phone-catalog/_new/${phone.image}`}
                    alt=""
                    className="hot-prices__goods__cards__good-card__img"
                  />
                </NavLink>
                
                <div className="hot-prices__goods__cards__good-card__header">
                  
                  <NavLink
                    to={`/phones/${phone.itemId}`}
                    onClick={() =>setSelectedProduct(phone.itemId)}
                    className="hot-prices__goods__cards__good-card__header__name"
                  >
                    {phone.name}
                  </NavLink>
                  <div className="hot-prices__goods__cards__good-card__header__prace">
                    <p className="hot-prices__goods__cards__good-card__header__prace__new">
                      {`$${phone.price}`}
                    </p>
                  </div>
                  <div className="hot-prices__goods__cards__good-card__header__line" />
                  <div className="hot-prices__goods__cards__good-card__main">
                    <div className="hot-prices__goods__cards__good-card__main__titles">
                      <h5 className="hot-prices__goods__cards__good-card__main__titles__title">
                        Screen
                      </h5>
                      <h5 className="hot-prices__goods__cards__good-card__main__titles__title">
                        Capacity
                      </h5>
                      <h5 className="hot-prices__goods__cards__good-card__main__titles__title">
                        RAM
                      </h5>
                    </div>
                    <div className="hot-prices__goods__cards__good-card__main__info">
                      <h5 className="hot-prices__goods__cards__good-card__main__info__title">
                        {phone.screen}
                      </h5>
                      <h5 className="hot-prices__goods__cards__good-card__main__info__title">
                        {phone.capacity}
                      </h5>
                      <h5 className="hot-prices__goods__cards__good-card__main__info__title">
                        {phone.ram}
                        {' '}
                      </h5>
                    </div>
                  </div>
                  <div className="hot-prices__goods__cards__good-card__buttons">

                    <button
                      type="button"
                      className={prevCartPhonesArr && prevCartPhonesArr.some(elem => elem.id === phone.itemId) ? 'hot-prices__goods__cards__good-card__buttons__cart--added' : 'hot-prices__goods__cards__good-card__buttons__cart'}
                      tabIndex={0}
                      aria-label="Previous Image"
                      onClick={() => {setCartPhones(phone.itemId), setPrice(phone.price)}}
                    >
                      {prevCartPhonesArr && prevCartPhonesArr.some(elem => elem.id === phone.itemId) ? 'Added to cart' : 'Add to cart'}
                    </button>
                    <button
                      type="button"
                      className="hot-prices__goods__cards__good-card__buttons__favorite"
                      style={prevFavoriteArr && prevFavoriteArr.includes(phone.itemId) ? {backgroundImage: `url(${filledFavoriteImage})`} : undefined}
                      tabIndex={0}
                      aria-label="Previous Image"
                      onClick={() => setFavoritePhones(phone.itemId)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        </>
        )}
        {!query &&
          <Pagination /> 
        }
      </div>
    </section>
    </>
  );
};
