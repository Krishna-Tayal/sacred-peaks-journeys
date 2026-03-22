import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Clock, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getImageUrl } from "@/utils/utils";
import heroImg from "@/assets/hero-bg.jpg";

const PackagesPage = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPackages = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/packages");
      const result = await res.json();
      setPackages(result.data || result || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load packages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchPackages();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="relative h-[40vh] flex items-center justify-center">
        <img src={heroImg} alt="Himalayas" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-mountain/70" />
        <div className="relative z-10 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground">
            Travel <span className="text-gradient-gold">Packages</span>
          </h1>
          <p className="font-body text-primary-foreground/60 mt-2">Choose your perfect pilgrimage experience</p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center text-primary-foreground/70">Loading packages...</div>
          ) : error ? (
            <div className="text-center text-destructive">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {packages.map((pkg, i) => (
                <motion.div
                  key={pkg._id || pkg.id || i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card rounded-xl overflow-hidden shadow-elevated group"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={pkg?.thumbnailImage ? getImageUrl(pkg.thumbnailImage) : "https://via.placeholder.com/600x400?text=Package"}
                      alt={pkg?.name || "Package image"}
                      className="w-full h-48 object-cover rounded-lg transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 right-4 bg-gold/90 backdrop-blur-sm rounded-full px-4 py-1.5 flex items-center gap-1">
                      <IndianRupee className="h-4 w-4 text-mountain" />
                      <span className="text-lg font-bold text-mountain font-body">{Number(pkg.price || 0).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl font-semibold text-foreground">{pkg?.name || "Unnamed Package"}</h3>
                    <p className="font-body text-sm text-muted-foreground mt-1">
                      {Array.isArray(pkg?.destinations) && pkg.destinations.length > 0
                        ? pkg.destinations.join(", ")
                        : "Destination details unavailable"}
                    </p>
                    <div className="flex items-center gap-1 text-gold text-sm mt-1 mb-3">
                      <Clock className="h-4 w-4" />
                      <span className="font-body">{pkg?.duration || "Duration unavailable"}</span>
                    </div>
                    <p className="font-body text-sm text-muted-foreground mb-5 line-clamp-2">{pkg?.description || "No description available"}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Button variant="outline-gold" className="w-full" onClick={() => navigate(`/packages/${pkg._id || pkg.id}`)}>
                        View Details
                      </Button>
                      <Button
                        variant="gold"
                        className="w-full"
                        onClick={() => navigate("/booking", { state: { pkg } })}
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
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

export default PackagesPage;
