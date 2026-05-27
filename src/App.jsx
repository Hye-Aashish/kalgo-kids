import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Contact from './pages/Contact';
import Orders from './pages/Orders';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import BottomNav from './components/BottomNav';
import './index.css';

function App() {
  return (
    <ShopProvider>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
          <BottomNav />
        </div>
      </Router>
    </ShopProvider>
  );
}

export default App;

