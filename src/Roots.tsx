import {
  Route,
  HashRouter as Router,
  Routes,
} from 'react-router-dom';
import App from './App';
import { Bunner } from './components/Bunner';
import { HotPrices } from './components/HotPrices';
import { Categories } from './components/Categories';
import { NewModel } from './components/NewModel';
import { ProductList } from './components/ProductList';
import { AppProvider } from './components/Context';
import { Tablets } from './components/Tablets';
import { Accessories } from './components/Accessories';
import { ProductPage } from './components/Product';
import { Cart } from './components/Cart';
import { Favorite } from './components/Favorite';

export const Roots = () => (

  <Router>
    <AppProvider>
      <Routes>
        <Route path="/" element={<App />}>
          <Route
            index
            element={(
              <>
                <Bunner />
                <HotPrices />
                <Categories />
                <NewModel />
              </>
            )}
          />
          <Route path="phones">
            <Route index element={<ProductList />} />
            <Route path=":productId" element={<ProductPage />} />
          </Route>
          <Route path="phones/:productId" element={<ProductPage />} />
          <Route path="tablets" element={<Tablets />} />
          <Route path="accessories" element={<Accessories />} />
          <Route path="cart" element={<Cart />} />
          <Route path="favorite" element={<Favorite />} />
        </Route>
      </Routes>
    </AppProvider>
  </Router>
);
