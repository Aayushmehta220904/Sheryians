import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import FieldErrors from "../components/FieldErrors";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setErrors([]); setMessage(""); setBusy(true);
    try {
      await login(form);
      navigate(location.state?.from || "/dashboard", { replace: true });
    } catch (error) {
      setErrors(error.details || []);
      setMessage(error.message);
    } finally { setBusy(false); }
  }

  return (
    <main className="auth-page shell">
      <section className="auth-copy"><span className="eyebrow">Welcome back</span><h1>Resume your secure session.</h1><p>Login issues a short-lived access token and stores the refresh token in an httpOnly cookie so the browser can renew access without exposing the refresh credential to JavaScript.</p><div className="auth-points"><span>✓ Generic invalid-credential errors</span><span>✓ bcrypt password verification</span><span>✓ Refresh-token rotation</span></div></section>
      <section className="auth-card"><div><span className="eyebrow">Account access</span><h2>Login</h2><p>Use the account you created in StockPilot.</p></div>{location.state?.registered && !message && <div className="notice success">Account created. Login to continue.</div>}{message && <div className="notice error">{message}</div>}<form onSubmit={handleSubmit}><label className="field"><span>Email</span><input type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" required /><FieldErrors errors={errors} field="email" /></label><label className="field"><span>Password</span><input type="password" autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Your password" required /><FieldErrors errors={errors} field="password" /></label><button className="button button-primary full-button" disabled={busy}>{busy ? "Signing in..." : "Login securely"}</button></form><p className="auth-switch">New here? <Link to="/register">Create an account</Link></p></section>
    </main>
  );
}
