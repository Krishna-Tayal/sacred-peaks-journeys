import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mountain, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ADMIN_API_BASE = "http://localhost:5000/api/admin";

type AuthStep = "login" | "email" | "reset";

const AdminLogin = () => {
  const [step, setStep] = useState<AuthStep>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResendingOtp, setIsResendingOtp] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (resendCooldown <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleLogin = async () => {
    setLoading(true);

    try {
      console.log("Login clicked");
      console.log("Admin login request:", { email });
      const response = await fetch(`${ADMIN_API_BASE}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => null);
      console.log("Response:", data);

      if (!response.ok) {
        alert("Invalid email or password");
        return;
      }

      const token = data?.token || data?.jwt || data?.accessToken;

      if (!token) {
        localStorage.setItem("isAdmin", "true");
        navigate("/admin/dashboard");
        return;
      }

      localStorage.setItem("admin_token", token);
      localStorage.setItem("isAdmin", "true");
      sessionStorage.setItem("admin_auth", "true");
      console.log("Login success, navigating...");
      navigate("/admin/dashboard");
    } catch {
      toast({
        title: "Network Error",
        description: "Unable to reach the server. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    const submittedEmail = email.trim();
    setLoading(true);
    try {
      const response = await fetch(`${ADMIN_API_BASE}/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: submittedEmail }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        toast({
          title: "Request Failed",
          description: data?.message || "Failed to send OTP.",
          variant: "destructive",
        });
        return;
      }

      setEmail(submittedEmail);
      toast({ title: "OTP sent", description: data?.message || "Check your email for the OTP." });
      setResendCooldown(30);

      if (data?.debugOtp) {
        console.log("OTP:", data.debugOtp);
      }

      setStep("reset");
    } catch {
      toast({ title: "Network Error", description: "Unable to reach the server.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isResendingOtp) {
      return;
    }

    setIsResendingOtp(true);
    try {
      const response = await fetch(`${ADMIN_API_BASE}/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        toast({
          title: "Resend Failed",
          description: data?.message || "Failed to resend OTP.",
          variant: "destructive",
        });
        return;
      }

      toast({ title: "OTP sent", description: data?.message || "OTP resent successfully." });
      setResendCooldown(30);

      if (data?.debugOtp) {
        console.log("OTP:", data.debugOtp);
      }
    } catch {
      toast({
        title: "Network Error",
        description: "Unable to reach the server.",
        variant: "destructive",
      });
    } finally {
      setIsResendingOtp(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        title: "Reset Failed",
        description: "New password and confirm password must match.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${ADMIN_API_BASE}/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        toast({
          title: "Reset Failed",
          description: data?.message || "Unable to change password.",
          variant: "destructive",
        });
        return;
      }

      toast({ title: "Password Updated", description: data?.message || "You can now sign in." });
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
      setPassword("");
      setStep("login");
    } catch {
      toast({ title: "Network Error", description: "Unable to reach the server.", variant: "destructive" });
    } finally {
      setLoading(false);
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
          <p className="font-body text-primary-foreground/50 text-sm">
            {step === "login" ? "Admin Dashboard Login" : "Admin Password Recovery"}
          </p>
        </div>
        <form
          autoComplete="off"
          onSubmit={step === "email" ? handleSendOtp : step === "reset" ? handleChangePassword : undefined}
          className="bg-mountain-light/50 backdrop-blur-sm rounded-xl p-8 border border-primary-foreground/10 space-y-4"
        >
          <div className="flex items-center gap-2 mb-4">
            <Lock className="h-5 w-5 text-gold" />
            <h2 className="font-display text-lg text-primary-foreground">
              {step === "login" && "Sign In"}
              {step === "email" && "Enter Email"}
              {step === "reset" && "Enter OTP & New Password"}
            </h2>
          </div>

          <input
            type="email"
            autoComplete="new-email"
            name="random_email_field"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-mountain border border-primary-foreground/10 font-body text-sm text-primary-foreground placeholder:text-primary-foreground/30 focus:outline-none focus:ring-2 focus:ring-gold/50"
          />

          {step === "login" && (
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                name="random_password_field"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-lg bg-mountain border border-primary-foreground/10 font-body text-sm text-primary-foreground placeholder:text-primary-foreground/30 focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-foreground/50 hover:text-primary-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          )}

          {step === "reset" && (
            <>
              <input
                type="text"
                placeholder="OTP"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-mountain border border-primary-foreground/10 font-body text-sm text-primary-foreground placeholder:text-primary-foreground/30 focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
              <input
                type="password"
                placeholder="New Password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-mountain border border-primary-foreground/10 font-body text-sm text-primary-foreground placeholder:text-primary-foreground/30 focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-mountain border border-primary-foreground/10 font-body text-sm text-primary-foreground placeholder:text-primary-foreground/30 focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
              <button
                type="button"
                onClick={() => void handleResendOtp()}
                disabled={resendCooldown > 0 || isResendingOtp}
                className="w-full text-center font-body text-xs text-gold disabled:text-primary-foreground/30 hover:underline disabled:no-underline"
              >
                {isResendingOtp && "Resending OTP..."}
                {!isResendingOtp && resendCooldown > 0 && `Resend OTP in ${resendCooldown}s`}
                {!isResendingOtp && resendCooldown === 0 && "Resend OTP"}
              </button>
            </>
          )}

          <Button
            variant="gold"
            className="w-full"
            type={step === "login" ? "button" : "submit"}
            onClick={step === "login" ? () => void handleLogin() : undefined}
            disabled={loading}
          >
            {loading && "Please wait..."}
            {!loading && step === "login" && "Login"}
            {!loading && step === "email" && "Send OTP"}
            {!loading && step === "reset" && "Change Password"}
          </Button>

          {step === "login" && (
            <button
              type="button"
              onClick={() => setStep("email")}
              className="w-full text-center font-body text-xs text-gold hover:underline"
            >
              Forgot Password?
            </button>
          )}

          {step !== "login" && (
            <button
              type="button"
              onClick={() => setStep("login")}
              className="w-full text-center font-body text-xs text-primary-foreground/60 hover:text-primary-foreground"
            >
              Back to Login
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
