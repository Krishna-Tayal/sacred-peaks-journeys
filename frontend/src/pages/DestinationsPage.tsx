import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import heroImg from "@/assets/hero-bg.jpg";

const BACKEND_URL = "http://localhost:5000";

const getDestinationImageSrc = (path?: string) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const normalizedPath = path.replace(/\\/g, "/").replace(/^\/+/, "");
  return `${BACKEND_URL}/${normalizedPath}`;
};

const DestinationsPage = () => {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDestinations = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/destinations");
      const result = await res.json();
      setDestinations(result.data || result || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load destinations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchDestinations();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      {/* Hero */}
      <section className="relative h-[40vh] flex items-center justify-center">
        <img src={heroImg} alt="Himalayas" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-mountain/70" />
        <div className="relative z-10 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground">
            Our <span className="text-gradient-gold">Destinations</span>
          </h1>
          <p className="font-body text-primary-foreground/60 mt-2">Explore the sacred Char Dham pilgrimage sites</p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center text-primary-foreground/70">Loading destinations...</div>
          ) : error ? (
            <div className="text-center text-destructive">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {destinations.map((dest, i) => (
                <motion.div
                  key={dest._id || dest.id || `${dest.slug}-${i}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={`/packages?destination=${dest.slug}`}
                    className="group block rounded-xl overflow-hidden bg-card shadow-elevated hover:shadow-lg transition-all duration-500"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={getDestinationImageSrc(dest.thumbnailImage || dest.image)}
                        alt={dest.name}
                        className="w-full h-64 object-cover rounded-lg transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-mountain/70 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <h3 className="font-display text-2xl font-bold text-primary-foreground">{dest.name}</h3>
                        <div className="flex items-center gap-1 text-gold text-sm mt-1">
                          <MapPin className="h-3.5 w-3.5" />
                          <span className="font-body">{dest.altitude}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="font-body text-sm text-muted-foreground mb-2">{dest.shortDescription}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-body text-xs text-gold">Best: {dest.bestTimeToVisit}</span>
                        <span className="text-gold text-sm font-medium font-body group-hover:underline">View Packages →</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default DestinationsPage;
