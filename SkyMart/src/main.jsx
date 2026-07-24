import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/index.css';
import App from './App';
import { StoreProvider } from './context/StoreContext';
createRoot(document.getElementById('root')).render(
  <BrowserRouter><StoreProvider><App/><ToastContainer position="top-right" autoClose={2200} theme="dark"/></StoreProvider></BrowserRouter>
);
