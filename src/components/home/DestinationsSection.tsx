import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { destinations } from "@/data/mockData";
import { MapPin } from "lucide-react";

const DestinationsSection = () => {
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((dest, i) => (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={`/destinations/${dest.slug}`}
                className="group block rounded-xl overflow-hidden bg-card shadow-elevated hover:shadow-lg transition-all duration-500"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
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
                    View Details →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

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
