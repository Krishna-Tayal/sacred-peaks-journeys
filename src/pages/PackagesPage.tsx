import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Clock, Check, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { packages } from "@/data/mockData";
import heroImg from "@/assets/hero-bg.jpg";

const PackagesPage = () => {
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {packages.map((pkg, i) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl overflow-hidden shadow-elevated group"
              >
                <div className="relative h-56 overflow-hidden">
                  <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute top-4 right-4 bg-gold/90 backdrop-blur-sm rounded-full px-4 py-1.5 flex items-center gap-1">
                    <IndianRupee className="h-4 w-4 text-mountain" />
                    <span className="text-lg font-bold text-mountain font-body">{pkg.price.toLocaleString()}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-semibold text-foreground">{pkg.name}</h3>
                  <div className="flex items-center gap-1 text-gold text-sm mt-1 mb-3">
                    <Clock className="h-4 w-4" />
                    <span className="font-body">{pkg.duration}</span>
                  </div>
                  <p className="font-body text-sm text-muted-foreground mb-4">{pkg.description}</p>
                  <div className="grid grid-cols-2 gap-2 mb-5">
                    {pkg.facilities.map((f) => (
                      <div key={f} className="flex items-center gap-1.5 text-xs text-muted-foreground font-body">
                        <Check className="h-3 w-3 text-gold flex-shrink-0" /> {f}
                      </div>
                    ))}
                  </div>
                  <Button variant="gold" className="w-full" asChild>
                    <Link to={`/booking/${pkg.id}`}>Book Now</Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default PackagesPage;
