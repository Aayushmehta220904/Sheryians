import { Navigate, Route, Routes } from 'react-router';
import { useStore } from './context/StoreContext';
import Layout from './components/Layout';
import Login from './pages/Login'; import Signup from './pages/Signup'; import Home from './pages/Home'; import Shop from './pages/Shop'; import ProductDetails from './pages/ProductDetails'; import Cart from './pages/Cart'; import Wishlist from './pages/Wishlist'; import About from './pages/About'; import NotFound from './pages/NotFound';
function Protected({children}){const {user}=useStore(); return user?children:<Navigate to="/login" replace/>}
export default function App(){return <Routes>
<Route path="/login" element={<Login/>}/><Route path="/signup" element={<Signup/>}/>
<Route element={<Protected><Layout/></Protected>}>
<Route index element={<Home/>}/><Route path="shop" element={<Shop/>}/><Route path="products/:id" element={<ProductDetails/>}/><Route path="cart" element={<Cart/>}/><Route path="wishlist" element={<Wishlist/>}/><Route path="about" element={<About/>}/><Route path="*" element={<NotFound/>}/>
</Route></Routes>}
