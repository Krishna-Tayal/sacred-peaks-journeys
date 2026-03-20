import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const ContactSection = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Message Sent!", description: "We'll get back to you within 24 hours." });
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <section className="py-20 bg-card" id="contact">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="font-body text-gold text-sm tracking-[0.2em] uppercase mb-2">Get in Touch</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Contact <span className="text-gradient-gold">Us</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="font-display text-xl font-semibold text-foreground">
              Ready to start your sacred journey?
            </h3>
            <p className="font-body text-muted-foreground">
              Reach out to us for custom packages, group bookings, or any queries about your Char Dham pilgrimage.
            </p>
            {[
              { icon: Phone, label: "+91 98765 43210" },
              { icon: Mail, label: "info@triptonick.com" },
              { icon: MapPin, label: "Rishikesh, Uttarakhand, India" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center">
                  <item.icon className="h-4 w-4 text-mountain" />
                </div>
                <span className="font-body text-sm text-foreground">{item.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {[
              { name: "name" as const, placeholder: "Your Name", type: "text" },
              { name: "email" as const, placeholder: "Your Email", type: "email" },
              { name: "phone" as const, placeholder: "Phone Number", type: "tel" },
            ].map((field) => (
              <input
                key={field.name}
                type={field.type}
                placeholder={field.placeholder}
                required
                value={formData[field.name]}
                onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
              />
            ))}
            <textarea
              placeholder="Your Message"
              rows={4}
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all resize-none"
            />
            <Button variant="gold" size="lg" className="w-full" type="submit">
              <Send className="h-4 w-4" /> Send Message
            </Button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
