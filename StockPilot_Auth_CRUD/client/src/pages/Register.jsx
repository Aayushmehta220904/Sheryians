import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import FieldErrors from "../components/FieldErrors";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setErrors([]); setMessage(""); setBusy(true);
    try {
      await register(form);
      navigate("/login", { replace: true, state: { registered: true } });
    } catch (error) {
      setErrors(error.details || []);
      setMessage(error.message);
    } finally { setBusy(false); }
  }

  return (
    <main className="auth-page shell">
      <section className="auth-copy"><span className="eyebrow">Create your account</span><h1>Start with security built in.</h1><p>Registration validates every field, blocks duplicate email addresses, hashes passwords before storage, and deliberately does not issue authentication tokens until a successful login.</p><div className="auth-points"><span>✓ Password never returned by the API</span><span>✓ Duplicate email returns 409</span><span>✓ confirmPassword validated server-side</span></div></section>
      <section className="auth-card"><div><span className="eyebrow">New account</span><h2>Register</h2><p>Password: 8+ characters with uppercase, lowercase and a number.</p></div>{message && <div className="notice error">{message}</div>}<form onSubmit={handleSubmit}><label className="field"><span>Name</span><input autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Aayush Mehta" required /><FieldErrors errors={errors} field="name" /></label><label className="field"><span>Email</span><input type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" required /><FieldErrors errors={errors} field="email" /></label><label className="field"><span>Password</span><input type="password" autoComplete="new-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Create a strong password" required /><FieldErrors errors={errors} field="password" /></label><label className="field"><span>Confirm password</span><input type="password" autoComplete="new-password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} placeholder="Repeat your password" required /><FieldErrors errors={errors} field="confirmPassword" /></label><button className="button button-primary full-button" disabled={busy}>{busy ? "Creating account..." : "Create account"}</button></form><p className="auth-switch">Already registered? <Link to="/login">Login</Link></p></section>
    </main>
  );
}
