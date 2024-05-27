import { useEffect, useState } from 'react';
import cn from 'classnames';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from './Context';
import filledFavoriteImage from '../img/favourites-filled.svg';
import { LikesModel } from './LikesModel';

/* eslint-disable */
interface Product {
  id: string;
  namespaceId: string;
  name: string;
  capacityAvailable: string[];
  capacity: string;
  priceRegular: number;
  priceDiscount: number;
  colorsAvailable: string[];
  color: string;
  images: string[];
  description: Description[];
  screen: string;
  resolution: string;
  processor: string;
  ram: string;
  camera: string;
  zoom: string;
  cell: string[];
}

interface Description {
  title: string;
  text: string[];
}

export const ProductPage = () => {
  const COLOR_HEX: any = {
    black: '#1F2020',
    white: '#f5f5f5',
    coral: '#EE7762',
    yellow: '#ffe88a',
    spacegray: '#717378',
    silver: '#e9e9e9',
    gold: '#fddfc7',
    red: '#cb2537',
    purple: '#ea87f8',
    rosegold: '#fbd4cf',
    green: '#a9ded3',
    midnightgreen: '#386a61',
  };
  const { selectedProduct, setSelectedProduct } = useAppContext();
  const [gotProduct, setGotProduct] = useState<Product | undefined>();
  const [errorMessage, setErrorMessage] = useState('');
  const { favoritePhones, setFavoritePhones } = useAppContext();
  const { prevFavoriteArr, setPrevFavoriteArr } = useAppContext();
  // eslint-disable-next-line max-len
  const [previewSelected, setPreviewSelected] = useState<string | undefined>('');
  const [colorSelected, setColorSelected] = useState('');
  const [memorySelected, setMemorySelected] = useState('');
  const url = `https://mate-academy.github.io/react_phone-catalog/_new/products/${selectedProduct}.json`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data = await response.json();

        setGotProduct(data);
      } catch (error) {
        setErrorMessage(`Error during fetch: ${errorMessage}`);
      }
    };

    fetchData();
    window.scrollTo(0, 0)
  }, [url]);

  useEffect(() => {
    if (gotProduct && gotProduct.images.length > 0) {
      setPreviewSelected(gotProduct.images[0]);
      setColorSelected(gotProduct.color);
      setMemorySelected(gotProduct.capacity);
    }
  }, [gotProduct]);
  const navigate = useNavigate();

  const handleChengeColor = (color: any) => {
    if (selectedProduct) {
      const splitString = selectedProduct.split('-');
      splitString[splitString.length - 1] = color;
      const newSelectProduct = splitString.join('-');
      setSelectedProduct(newSelectProduct);
      navigate(`/phones/${newSelectProduct}`)
    }
  }

  const handleChengeCapacity = (capacity: any) => {
    if (selectedProduct) {
      const splitString = selectedProduct.split('-');
      splitString[splitString.length - 2] = capacity.toLowerCase();
      const newSelectProduct = splitString.join('-');
      setSelectedProduct(newSelectProduct);
      navigate(`/phones/${newSelectProduct}`)
    }
  }

  const { cartPhones, setCartPhones } = useAppContext();
  const { prevCartPhonesArr, setPrevCartPhonesArr } = useAppContext();
  const [price, setPrice] = useState<number>(0);

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
    }``
    setFavoritePhones(''); 
  }, [favoritePhones, prevFavoriteArr]);

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

  return (
    <section className="product__wrapper">
      <div className="product__content">
        <div className="product__main">
          <h2 className="product__main__title">{gotProduct?.name}</h2>
          <div className="product__main__cards">
            <div className="product__main__cards__preview">
              {gotProduct?.images.map((imgUrl) => (
                <img
                  key={imgUrl}
                  className={cn(
                    'product__main__cards__preview__img',
                    // eslint-disable-next-line max-len
                    { 'product__main__cards__preview__img--active': imgUrl === previewSelected },
                  )}
                  src={`https://mate-academy.github.io/react_phone-catalog/_new/${imgUrl}`}
                  alt="product img"
                  onClick={() => setPreviewSelected(imgUrl)}
                />
              ))}
            </div>
            <div className="product__main__cards__preview__selected">
              <img
                className="product__main__cards__preview__selected__img" 
                src={`https://mate-academy.github.io/react_phone-catalog/_new/${previewSelected}`}
                alt="selected image"
              />
            </div>
            <div className="product__main__cards__preview__characteristics">
              <h4 className="product__main__cards__preview__characteristics__title">
                Available colors
              </h4>
              <ul className="product__main__cards__preview__characteristics__colors">
                {gotProduct?.colorsAvailable.map((color) => (
                  // <NavLink to={`/phones/${selectedProduct}`}>
                  <li
                    key={color}
                    onClick={() => handleChengeColor(color)}
                    className={cn(
                      'product__main__cards__preview__characteristics__colors__circle',
                      {'product__main__cards__preview__characteristics__colors__circle--active': color === colorSelected}
                    )}
                  >
                    <div
                      key={color}
                      className="product__main__cards__preview__characteristics__colors__circle__background"
                      style={{backgroundColor: COLOR_HEX[color]}}
                    />
                  </li>
                  // </NavLink>
                ))}
              </ul>
              <h4 className="product__main__cards__preview__characteristics__title">
                Select capacity
              </h4>
              <ul className="product__main__cards__preview__characteristics__memory">
                {gotProduct?.capacityAvailable.map((memory) => (
                  <li
                    onClick={() => handleChengeCapacity(memory)}
                    className={cn(
                      "product__main__cards__preview__characteristics__memory__li",
                      {"product__main__cards__preview__characteristics__memory__li--active": memorySelected === memory}
                    )}
                    key={memory}
                  >
                    {memory}
                  </li>
                ))}
              </ul>
              <div className="product__main__cards__preview__characteristics__card-buy">
                <div className="product__main__cards__preview__characteristics__card-buy__prices">
                  <span className="product__main__cards__preview__characteristics__card-buy__prices__valid">{`$${gotProduct?.priceDiscount}`}</span>
                  <span className="product__main__cards__preview__characteristics__card-buy__prices__not-valid">{`$${gotProduct?.priceRegular}`}</span>
                </div>
                <div  
                  className="product__main__cards__preview__characteristics__card-buy__buttons"
                >
                  <div
                    onClick={() => { selectedProduct && setCartPhones(selectedProduct), setPrice(gotProduct?.priceDiscount || 0)}}
                    className={prevCartPhonesArr && prevCartPhonesArr.some(elem => elem.id === selectedProduct)
                      ? 'product__main__cards__preview__characteristics__card-buy__buttons__cart--added' 
                      : "product__main__cards__preview__characteristics__card-buy__buttons__cart"}
                  >
                    {prevCartPhonesArr && prevCartPhonesArr.some(elem => elem.id === selectedProduct) ? 'Added to cart' : 'Add to cart'}
                  </div>
                  <div
                    className="product__main__cards__preview__characteristics__card-buy__buttons__favorite"
                    style={prevFavoriteArr && selectedProduct && prevFavoriteArr.includes(selectedProduct) ? {backgroundImage: `url(${filledFavoriteImage})`} : undefined}
                    onClick={() => {selectedProduct && setFavoritePhones(selectedProduct)}}
                  />
                </div>
                <div className="product__main__cards__preview__characteristics__card-buy__info">
                  <div className="product__main__cards__preview__characteristics__card-buy__info__name">Screen</div>
                  <div className="product__main__cards__preview__characteristics__card-buy__info__param">{gotProduct?.screen}</div>
                </div>
                <div className="product__main__cards__preview__characteristics__card-buy__info">
                  <div className="product__main__cards__preview__characteristics__card-buy__info__name">Resolution</div>
                  <div className="product__main__cards__preview__characteristics__card-buy__info__param">{gotProduct?.resolution}</div>
                </div>
                <div className="product__main__cards__preview__characteristics__card-buy__info">
                  <div className="product__main__cards__preview__characteristics__card-buy__info__name">Processor</div>
                  <div className="product__main__cards__preview__characteristics__card-buy__info__param">{gotProduct?.processor}</div>
                </div>
                <div className="product__main__cards__preview__characteristics__card-buy__info">
                  <div className="product__main__cards__preview__characteristics__card-buy__info__name">RAM</div>
                  <div className="product__main__cards__preview__characteristics__card-buy__info__param">{gotProduct?.ram}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="product__main__info">
            <section className="product__main__info__about">
              <h3 className="product__main__info__about__title">
                About
              </h3>
              {gotProduct?.description.map((item, index) => (
                <div className="product__main__info__about__block" key={index}>
                  <h3 className="product__main__info__about__block__title">{item.title}</h3>
                  {item.text.map((paragraph) => (
                    <p className="product__main__info__about__block__paragraph">{paragraph}</p>
                  ))}
                </div>
              ))}
            </section>
            <section className="product__main__info__specs">
              <h3 className="product__main__info__specs__title">
                Tech specs
              </h3>
              <div className="product__main__info__specs__card">
                <div className="product__main__info__specs__card__row">
                  <span className="product__main__info__specs__card__row__name">Screen</span>
                  <span className="product__main__info__specs__card__row__param">{gotProduct?.screen}</span>
                </div>
                <div className="product__main__info__specs__card__row">
                  <span className="product__main__info__specs__card__row__name">Resolution</span>
                  <span className="product__main__info__specs__card__row__param">{gotProduct?.resolution}</span>
                </div>
                <div className="product__main__info__specs__card__row">
                  <span className="product__main__info__specs__card__row__name">Processor</span>
                  <span className="product__main__info__specs__card__row__param">{gotProduct?.processor}</span>
                </div>
                <div className="product__main__info__specs__card__row">
                  <span className="product__main__info__specs__card__row__name">RAM</span>
                  <span className="product__main__info__specs__card__row__param">{gotProduct?.ram}</span>
                </div>
                
                <div className="product__main__info__specs__card__row">
                  <span className="product__main__info__specs__card__row__name">Built in memory</span>
                  <span className="product__main__info__specs__card__row__param">{gotProduct?.capacity}</span>
                </div>
                <div className="product__main__info__specs__card__row">
                  <span className="product__main__info__specs__card__row__name">Camera</span>
                  <span className="product__main__info__specs__card__row__param">{gotProduct?.camera}</span>
                </div>
                <div className="product__main__info__specs__card__row">
                  <span className="product__main__info__specs__card__row__name">Zoom</span>
                  <span className="product__main__info__specs__card__row__param">{gotProduct?.zoom}</span>
                </div>
                <div className="product__main__info__specs__card__row">
                  <span className="product__main__info__specs__card__row__name">Cell</span>
                  <div className="product__main__info__specs__card__row__param">
                    {gotProduct?.cell.map((item) => (
                      <span className="product__main__info__specs__card__row__param__text">{`${item}, `}</span> 
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
        <LikesModel />
      </div>
    </section>
  );
};
