import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import RequireAuth from "./components/RequireAuth";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <div className="app-shell">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <footer className="site-footer"><div className="shell"><p><strong>StockPilot</strong> · Authentication & Product CRUD APIs</p><p>Built by <span>Aayush Mehta</span> · Sheryians Coding School assignment</p></div></footer>
    </div>
  );
}
