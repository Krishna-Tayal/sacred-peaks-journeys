import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

const BACKEND_URL = "http://localhost:5000";

const getDestinationImageSrc = (path?: string) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const normalizedPath = path.replace(/\\/g, "/").replace(/^\/+/, "");
  return `${BACKEND_URL}/${normalizedPath}`;
};

const DestinationsSection = () => {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDestinations = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/destinations");
        const data = await res.json();
        setDestinations(data.data || data || []);
      } catch (err) {
        console.error(err);
        setError("Unable to load destinations right now.");
      } finally {
        setLoading(false);
      }
    };
    void fetchDestinations();
  }, []);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="font-body text-gold text-sm tracking-[0.2em] uppercase mb-2">Explore</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Sacred <span className="text-gradient-gold">Char Dham</span> Destinations
          </h2>
        </motion.div>

        {loading ? (
          <div className="text-center col-span-full text-primary-foreground/70">Loading destinations...</div>
        ) : error ? (
          <div className="text-center col-span-full text-destructive">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.slice(0, 4).map((dest, i) => (
              <motion.div
                key={dest._id || dest.id || i}
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
                    <div className="absolute inset-0 bg-gradient-to-t from-mountain/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 text-primary-foreground">
                      <MapPin className="h-3.5 w-3.5 text-gold" />
                      <span className="text-xs font-body">{dest.altitude}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg font-semibold text-foreground mb-1">{dest.name}</h3>
                    <p className="font-body text-sm text-muted-foreground line-clamp-2">{dest.shortDescription}</p>
                    <span className="inline-block mt-3 text-gold text-sm font-medium font-body group-hover:underline">
                      View Packages →
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Button variant="outline-gold" size="lg" asChild>
            <Link to="/destinations">All Destinations</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DestinationsSection;
