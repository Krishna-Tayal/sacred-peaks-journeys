import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/utils/utils";
import { Clock, Check, IndianRupee } from "lucide-react";

const PackagesSection = () => {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/packages");
        const data = await res.json();
        setPackages(data.data || data || []);
      } catch (err) {
        console.error(err);
        setError("Unable to load featured packages.");
      } finally {
        setLoading(false);
      }
    };
    void fetchPackages();
  }, []);

  return (
    <section className="py-20 bg-mountain">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="font-body text-gold text-sm tracking-[0.2em] uppercase mb-2">Curated</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">
            Featured <span className="text-gradient-gold">Packages</span>
          </h2>
        </motion.div>

        {loading ? (
          <div className="text-center text-primary-foreground/70">Loading featured packages...</div>
        ) : error ? (
          <div className="text-center text-destructive">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.slice(0, 3).map((pkg, i) => (
              <motion.div
                key={pkg._id || pkg.id || i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-mountain-light/50 backdrop-blur-sm rounded-xl overflow-hidden border border-primary-foreground/10 hover:border-gold/30 transition-all duration-500 group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={getImageUrl(pkg.thumbnailImage || pkg.image)}
                    alt={pkg.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 bg-gold/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                    <IndianRupee className="h-3 w-3 text-mountain" />
                    <span className="text-sm font-bold text-mountain font-body">{Number(pkg.price || 0).toLocaleString()}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-lg font-semibold text-primary-foreground mb-2">{pkg.name}</h3>
                  <div className="flex items-center gap-1 text-gold-light text-sm mb-3">
                    <Clock className="h-3.5 w-3.5" />
                    <span className="font-body">{pkg.duration}</span>
                  </div>
                  <p className="font-body text-sm text-primary-foreground/60 mb-4 line-clamp-2">{pkg.description}</p>
                  <div className="space-y-1.5 mb-5">
                    {(pkg.facilities || []).slice(0, 4).map((f: string) => (
                      <div key={f} className="flex items-center gap-2 text-xs text-primary-foreground/50 font-body">
                        <Check className="h-3 w-3 text-gold" />
                        {f}
                      </div>
                    ))}
                  </div>
                  <Button variant="gold" className="w-full" asChild>
                    <Link to={`/booking`}>Book Now</Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Button variant="outline-gold" size="lg" asChild>
            <Link to="/packages">View All Packages</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PackagesSection;
