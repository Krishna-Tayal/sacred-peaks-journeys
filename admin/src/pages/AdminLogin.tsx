import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mountain, Lock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ADMIN_EMAIL = "admin@triptonick.com";
const ADMIN_PASS = "admin123";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
      sessionStorage.setItem("admin_auth", "true");
      navigate("/dashboard");
    } else {
      toast({ title: "Invalid Credentials", description: "Please check your email and password.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-mountain flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Mountain className="h-8 w-8 text-gold" />
            <span className="font-display text-2xl font-bold text-gold">Trip Tonick</span>
          </div>
          <p className="font-body text-primary-foreground/50 text-sm">Admin Dashboard Login</p>
        </div>
        <form onSubmit={handleLogin} className="bg-mountain-light/50 backdrop-blur-sm rounded-xl p-8 border border-primary-foreground/10 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="h-5 w-5 text-gold" />
            <h2 className="font-display text-lg text-primary-foreground">Sign In</h2>
          </div>
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-mountain border border-primary-foreground/10 font-body text-sm text-primary-foreground placeholder:text-primary-foreground/30 focus:outline-none focus:ring-2 focus:ring-gold/50"
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-mountain border border-primary-foreground/10 font-body text-sm text-primary-foreground placeholder:text-primary-foreground/30 focus:outline-none focus:ring-2 focus:ring-gold/50"
          />
          <Button variant="gold" className="w-full" type="submit">Login</Button>
          <p className="font-body text-xs text-primary-foreground/30 text-center">
            Demo: admin@triptonick.com / admin123
          </p>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
