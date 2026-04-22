import { useEffect, useState } from "react";
import { MapPin, Package, Image, BookOpen, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const ADMIN_API_BASE = "http://localhost:5000/api/admin";

const AdminDashboard = () => {
  const [totalDestinations, setTotalDestinations] = useState(0);
  const [totalPackages, setTotalPackages] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalGalleryImages, setTotalGalleryImages] = useState(0);
  const [oldEmail, setOldEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [destRes, galleryRes, bookingRes, pkgRes] = await Promise.all([
          fetch("http://localhost:5000/api/destinations"),
          fetch("http://localhost:5000/api/gallery"),
          fetch("http://localhost:5000/api/bookings"),
          fetch("http://localhost:5000/api/packages"),
        ]);

        const destData = await destRes.json();
        const galleryData = await galleryRes.json();
        const bookingData = await bookingRes.json();
        const pkgData = await pkgRes.json();

        const destinations = destData?.data || [];
        const galleryImages = galleryData?.data || galleryData || [];
        const bookings = bookingData?.data || [];
        const packages = pkgData?.data || [];

        setTotalDestinations(destinations.length);
        setTotalGalleryImages(galleryImages.length);
        setTotalBookings(bookings.length);
        setTotalPackages(packages.length);
      } catch (error) {
        console.error("Failed to fetch admin counts", error);
      }
    };

    void fetchData();
  }, []);

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingEmail(true);

    try {
      const response = await fetch(`${ADMIN_API_BASE}/change-email`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ oldEmail, password, newEmail }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        toast({
          title: "Email Update Failed",
          description: data?.message || "Unable to update admin email.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Email Updated",
        description: data?.message || "Admin email updated successfully.",
      });
      setOldEmail("");
      setPassword("");
      setNewEmail("");
    } catch {
      toast({
        title: "Network Error",
        description: "Unable to reach the server.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const stats = [
    { label: "Destinations", value: totalDestinations, icon: MapPin, color: "text-gold" },
    { label: "Packages", value: totalPackages, icon: Package, color: "text-gold" },
    { label: "Gallery Images", value: totalGalleryImages, icon: Image, color: "text-gold" },
    { label: "Bookings", value: totalBookings, icon: BookOpen, color: "text-gold" },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-mountain-light/40 rounded-xl p-5 border border-primary-foreground/10">
            <div className="flex items-center justify-between mb-3">
              <s.icon className={`h-5 w-5 ${s.color}`} />
              <TrendingUp className="h-4 w-4 text-gold/50" />
            </div>
            <p className="font-display text-2xl font-bold text-primary-foreground">{s.value}</p>
            <p className="font-body text-xs text-primary-foreground/50">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-mountain-light/40 rounded-xl p-6 border border-primary-foreground/10">
        <h3 className="font-display text-lg font-semibold text-primary-foreground mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            "New booking for Char Dham Yatra package",
            "Gallery image uploaded for Kedarnath",
            "Package price updated: Kedarnath Solo Pilgrimage",
            "New destination inquiry received",
          ].map((activity, i) => (
            <div key={i} className="flex items-center gap-3 text-sm font-body text-primary-foreground/60 py-2 border-b border-primary-foreground/5 last:border-0">
              <div className="w-2 h-2 rounded-full bg-gold" />
              {activity}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-mountain-light/40 rounded-xl p-6 border border-primary-foreground/10 mt-8">
        <h3 className="font-display text-lg font-semibold text-primary-foreground mb-4">Change Admin Email</h3>

        <form onSubmit={handleChangeEmail} className="space-y-4">
          <input
            type="email"
            placeholder="Old Email"
            required
            value={oldEmail}
            onChange={(e) => setOldEmail(e.target.value)}
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

          <input
            type="email"
            placeholder="New Email"
            required
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-mountain border border-primary-foreground/10 font-body text-sm text-primary-foreground placeholder:text-primary-foreground/30 focus:outline-none focus:ring-2 focus:ring-gold/50"
          />

          <Button variant="gold" type="submit" disabled={isUpdatingEmail}>
            {isUpdatingEmail ? "Updating..." : "Change Email"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;
