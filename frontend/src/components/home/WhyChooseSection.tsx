import { motion } from "framer-motion";
import { Shield, Heart, Users, Headphones } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Safe & Secure",
    description: "Licensed guides, insured travels, and 24/7 emergency support throughout your sacred journey.",
  },
  {
    icon: Heart,
    title: "Spiritual Guidance",
    description: "Expert pandits and knowledgeable guides ensure an authentic and meaningful pilgrimage experience.",
  },
  {
    icon: Users,
    title: "Small Groups",
    description: "Intimate group sizes for a personal, comfortable experience with fellow devotees.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Round-the-clock customer support to assist you before, during, and after your journey.",
  },
];

const WhyChooseSection = () => {
  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="font-body text-gold text-sm tracking-[0.2em] uppercase mb-2">Why Us</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Why Choose <span className="text-gradient-gold">Trip Tonick</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-6 rounded-xl hover:bg-background transition-colors duration-300"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-gold flex items-center justify-center">
                <f.icon className="h-6 w-6 text-mountain" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="font-body text-sm text-muted-foreground">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
