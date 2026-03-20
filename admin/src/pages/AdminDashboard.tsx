import { useEffect, useState } from "react";
import { MapPin, Package, Image, BookOpen, TrendingUp } from "lucide-react";

const AdminDashboard = () => {
  const [totalDestinations, setTotalDestinations] = useState(0);
  const [totalPackages, setTotalPackages] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalGalleryImages, setTotalGalleryImages] = useState(0);

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
    </div>
  );
};

export default AdminDashboard;
