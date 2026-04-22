import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Clock, IndianRupee, MapPin, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const BACKEND_URL = "${import.meta.env.VITE_API_URL}";

const getBackendImageUrl = (path?: string) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const normalized = path.replace(/\\/g, "/").replace(/^\/+/, "");
  return `${BACKEND_URL}/${normalized}`;
};

const PackageDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/packages`);
        const result = await response.json();
        if (!response.ok) {
          setError(result?.message || "Failed to load package details.");
          return;
        }
        setPackages(result?.data || []);
      } catch (fetchError) {
        console.error(fetchError);
        setError("Failed to load package details.");
      } finally {
        setLoading(false);
      }
    };

    void fetchPackages();
  }, []);

  const pkg = useMemo(() => packages.find((p) => p._id === id || p.id === id), [packages, id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading package details...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-destructive">{error}</div>;
  }

  if (!pkg) {
    return <p>Package not found</p>;
  }

  const imageUrl = getBackendImageUrl(pkg.thumbnailImage);

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="relative h-[40vh] flex items-end" style={{ backgroundImage: `url(${imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="absolute inset-0 bg-mountain/70" />
        <div className="relative z-10 container mx-auto px-4 pb-8">
          <Link to="/packages" className="inline-flex items-center gap-1 text-gold text-sm font-body mb-2 hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to Packages
          </Link>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">{pkg.name}</h1>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-xl overflow-hidden border border-border bg-card">
              <img src={imageUrl} alt={pkg.name} className="w-full h-72 object-cover" />
            </div>

            <div className="space-y-4">
              <h2 className="font-display text-2xl font-bold text-foreground">{pkg.name}</h2>

              <div className="flex items-center gap-2 text-gold">
                <IndianRupee className="h-5 w-5" />
                <span className="font-display text-2xl font-bold">{Number(pkg.price || 0).toLocaleString()}</span>
              </div>

              <p className="font-body text-sm text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" /> {pkg.duration || "Duration unavailable"}
              </p>

              <p className="font-body text-sm text-muted-foreground flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5" />
                {Array.isArray(pkg.destinations) && pkg.destinations.length > 0 ? pkg.destinations.join(", ") : "Destination details unavailable"}
              </p>

              <p className="font-body text-base text-foreground/80">{pkg.description || "No description available"}</p>

              <Button variant="gold" size="lg" className="w-full" onClick={() => navigate("/booking", { state: { pkg } })}>
                Book Now
              </Button>
            </div>
          </div>

          <div className="mt-10 bg-card rounded-xl p-6 border border-border">
            <h3 className="font-display text-xl font-semibold text-foreground mb-4">Facilities</h3>
            {Array.isArray(pkg.facilities) && pkg.facilities.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pkg.facilities.map((feature: string) => (
                  <div key={feature} className="flex items-center gap-2 text-sm text-muted-foreground font-body">
                    <Check className="h-4 w-4 text-gold" />
                    {feature}
                  </div>
                ))}
              </div>
            ) : Array.isArray(pkg.features) && pkg.features.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pkg.features.map((feature: string) => (
                  <div key={feature} className="flex items-center gap-2 text-sm text-muted-foreground font-body">
                    <Check className="h-4 w-4 text-gold" />
                    {feature}
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-body text-sm text-muted-foreground">No facilities listed.</p>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PackageDetailsPage;