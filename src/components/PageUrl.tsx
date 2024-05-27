/* eslint-disable */
import { NavLink, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAppContext } from './Context';
import homeImg from '../img/home.svg';
import arrowRight from '../img/Chevron-ArrowRight.svg';
import arrowLeft from '../img/Chevron-Arrow-Left.svg';

export const PageUrl = () => {
  const { urlState, setUrlState } = useAppContext();
  const [allUrl, setAllUrl] = useState<string[] | undefined>();
  const { selectedProduct, setSelectedProduct } = useAppContext();

  const clearUrl = () => {
    setUrlState(undefined);
  };

  const clearSelected = () => {
    setSelectedProduct('');
  };

  const goBack = () => {
    history.back();
    setSelectedProduct('');
  };

  const location = useLocation();

  useEffect(() => {
    const currentURL = location.pathname;
    const substrings = currentURL.split('/').filter(Boolean);

    setAllUrl(substrings);

    if (currentURL === '/') {
      setUrlState('home');
    } else {
      setUrlState(substrings[0] || 'home');
    }
  }, [location, setUrlState]);

  return (urlState && urlState !== 'home' && urlState !== 'cart'
    ? (
      <section className="page-url__wrapper">
        <div className="page-url__content">
          <div className="page-url__content__string">
            <NavLink to="/" onClick={clearUrl} className="page-url__content__link">
              <div className="page-url__content__link__images">
                <img src={homeImg} alt="home-img" className="page-url__content__link__img" />
                <img src={arrowRight} alt="arrow-right" className="page-url__content__link__img" />
              </div>
            </NavLink>

            {allUrl && allUrl[-1] !== selectedProduct && selectedProduct ? (
              <>
                <NavLink to={`/${urlState}`} onClick={clearSelected} className="page-url__content__link">
                  <span className="page-url__content__string__text">{urlState}</span>
                  <img src={arrowRight} alt="arrow-right" />
                </NavLink>
                <span className="page-url__content__string__text-id">{selectedProduct.split("-").join(" ")}</span>
              </>
            ) : (
              <span className="page-url__content__string__text-id">{urlState}</span>
            )}
          </div>
          {selectedProduct && (
            <div className="page-url__content__back" onClick={goBack}>
              <img src={arrowLeft} alt="arrow-right" />
              <span className="page-url__content__string__text-id">Back</span>
            </div>
          )}
        </div>
      </section>
    ) : null
  );
};
