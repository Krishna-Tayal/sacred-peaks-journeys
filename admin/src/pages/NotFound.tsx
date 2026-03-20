import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="min-h-screen bg-mountain text-primary-foreground flex items-center justify-center px-4">
    <div className="max-w-md text-center rounded-xl bg-mountain-light/50 border border-primary-foreground/20 p-8">
      <h1 className="font-display text-3xl font-bold text-gold mb-3">404</h1>
      <p className="font-body text-sm text-primary-foreground/80 mb-6">Page not found. Please go back to admin login.</p>
      <Link to="/login" className="inline-flex items-center justify-center rounded-lg bg-gold px-4 py-2 text-sm font-medium text-mountain">Back to login</Link>
    </div>
  </div>
);

export default NotFound;
