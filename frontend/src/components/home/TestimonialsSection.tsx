import { motion } from "framer-motion";
import { testimonials } from "@/data/mockData";
import { Star } from "lucide-react";

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-mountain">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="font-body text-gold text-sm tracking-[0.2em] uppercase mb-2">Testimonials</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">
            What Our <span className="text-gradient-gold">Pilgrims</span> Say
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-mountain-light/40 backdrop-blur-sm rounded-xl p-6 border border-primary-foreground/10"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star
                    key={j}
                    className={`h-4 w-4 ${j < t.rating ? "text-gold fill-gold" : "text-primary-foreground/20"}`}
                  />
                ))}
              </div>
              <p className="font-body text-sm text-primary-foreground/70 mb-5 leading-relaxed italic">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center text-mountain font-body font-bold text-sm">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-body text-sm font-semibold text-primary-foreground">{t.name}</p>
                  <p className="font-body text-xs text-primary-foreground/50">{t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
