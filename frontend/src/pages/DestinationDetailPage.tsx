import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getImageUrl } from "@/utils/utils";

const DestinationDetailPage = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [destination, setDestination] = useState<any>(null);
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [destRes, pkgRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/destinations`),
        fetch(`${import.meta.env.VITE_API_URL}/api/packages`),
      ]);
      if (!destRes.ok || !pkgRes.ok) {
        throw new Error("Failed to load data.");
      }
      const destData = await destRes.json();
      const pkgData = await pkgRes.json();
      const destList = destData.data || destData || [];
      const pkgList = pkgData.data || pkgData || [];
      setPackages(pkgList);
      const selected = destList.find((d: any) => d.slug === slug);
      setDestination(selected || null);
    } catch (err) {
      console.error(err);
      setError("Failed to load destination details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-destructive">{error}</div>;
  }

  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-foreground">Destination not found</h1>
          <Button variant="gold" className="mt-4" asChild>
            <Link to="/destinations">Back to Destinations</Link>
          </Button>
        </div>
      </div>
    );
  }

  const relatedPackages = packages.filter(
    (p) => Array.isArray(p.destinations) && destination?.slug && p.destinations.includes(destination.slug)
  );

  return (
    <div className="min-h-screen">
      <Navbar />
      {/* Hero */}
      <section className="relative h-[50vh] flex items-end">
        <img src={getImageUrl(destination.thumbnailImage || destination.image)} alt={destination.name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-mountain/80 via-mountain/30 to-transparent" />
        <div className="relative z-10 container mx-auto px-4 pb-10">
          <Link to="/destinations" className="inline-flex items-center gap-1 text-gold text-sm font-body mb-3 hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to Destinations
          </Link>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground">{destination.name}</h1>
          <div className="flex flex-wrap gap-4 mt-3">
            <span className="flex items-center gap-1 text-gold text-sm font-body">
              <MapPin className="h-4 w-4" /> {destination.altitude}
            </span>
            <span className="flex items-center gap-1 text-primary-foreground/60 text-sm font-body">
              <Calendar className="h-4 w-4" /> {destination.bestTimeToVisit}
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="font-display text-2xl font-bold text-foreground mb-4">About {destination.name}</h2>
            <p className="font-body text-muted-foreground leading-relaxed">{destination.description}</p>
          </motion.div>

          {/* Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12"
          >
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(destination.galleryImages?.length ? destination.galleryImages : destination.gallery).map((img, i) => (
                <div key={i} className="rounded-lg overflow-hidden aspect-video">
                  <img src={getImageUrl(img)} alt={`${destination.name} ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Related Packages */}
          {relatedPackages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-12"
            >
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">Available Packages</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedPackages.map((pkg) => (
                  <div key={pkg._id || pkg.id} className="bg-card rounded-xl p-6 shadow-elevated">
                    <h3 className="font-display text-lg font-semibold text-foreground">{pkg.name}</h3>
                    <p className="font-body text-sm text-muted-foreground mt-1">{pkg.duration}</p>
                    <p className="font-display text-2xl font-bold text-gold mt-2">₹{Number(pkg.price || 0).toLocaleString()}</p>
                    <Button
                      variant="gold"
                      className="w-full mt-4"
                      onClick={() => navigate("/booking", { state: { pkg } })}
                    >
                      Book Now
                    </Button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default DestinationDetailPage;
