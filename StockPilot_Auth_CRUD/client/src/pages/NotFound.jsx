import { Link } from "react-router-dom";
export default function NotFound() { return <main className="not-found shell"><span>404</span><h1>Page not found.</h1><p>The route you requested does not exist in StockPilot.</p><Link className="button button-primary" to="/">Return to catalog</Link></main>; }
