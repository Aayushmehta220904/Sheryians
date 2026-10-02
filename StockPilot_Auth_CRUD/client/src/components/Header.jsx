import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <header className="site-header">
      <div className="shell nav-wrap">
        <Link className="brand" to="/" aria-label="StockPilot home">
          <span className="brand-mark">SP</span>
          <span>
            <strong>StockPilot</strong>
            <small>Product catalog control</small>
          </span>
        </Link>

        <nav className="nav-links" aria-label="Primary navigation">
          <NavLink to="/" end>Catalog</NavLink>
          {isAuthenticated && <NavLink to="/dashboard">Dashboard</NavLink>}
        </nav>

        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              <div className="user-chip" title={user.email}>
                <span>{user.name?.charAt(0)?.toUpperCase()}</span>
                <div><strong>{user.name}</strong><small>Authenticated</small></div>
              </div>
              <button className="button button-ghost compact" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link className="button button-ghost compact" to="/login">Login</Link>
              <Link className="button button-primary compact" to="/register">Create account</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
