import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Users, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "@/hooks/use-toast";

const BookingPage = () => {
  const location = useLocation();
  const packageData = location.state?.pkg;
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    travelDate: "",
    travelers: 1,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        package: packageData?.name || "",
        travelers: form.travelers,
        date: form.travelDate,
      };

      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) {
        toast({
          title: "Booking Failed",
          description: result?.message || "Could not submit your booking. Please try again.",
        });
        return;
      }

      toast({
        title: "Booking Submitted! 🙏",
        description: "We'll contact you within 24 hours to confirm your pilgrimage.",
      });
      setForm({ name: "", email: "", phone: "", travelDate: "", travelers: 1 });
    } catch (err) {
      console.error(err);
      toast({
        title: "Booking Failed",
        description: "Could not submit your booking. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!packageData) {
    return <p>Package not found</p>;
  }

  const heroImagePath = (packageData.thumbnailImage || packageData.image || "") as string;
  const heroImageUrl = `http://localhost:5000/${heroImagePath.replace(/\\/g, "/").replace(/^\/+/, "")}`;

  return (
    <div className="min-h-screen">
      <Navbar />
      <section
        className="relative h-[35vh] flex items-end"
        style={{
          backgroundImage: `url(${heroImageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-mountain/70" />
        <div className="relative z-10 container mx-auto px-4 pb-8">
          <Link to="/packages" className="inline-flex items-center gap-1 text-gold text-sm font-body mb-2 hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to Packages
          </Link>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">Booking {packageData.name}</h1>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Package Summary */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="md:col-span-2 bg-card rounded-xl p-6 shadow-elevated h-fit"
            >
              <h3 className="font-display text-lg font-semibold text-foreground mb-3">Package Summary</h3>
              <div className="space-y-3 font-body text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Package</span>
                  <span className="text-foreground font-medium">{packageData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="text-foreground">{packageData.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price/person</span>
                  <span className="text-gold font-bold">₹{Number(packageData.price || 0).toLocaleString()}</span>
                </div>
                <hr className="border-border" />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Travelers</span>
                  <span className="text-foreground">{form.travelers}</span>
                </div>
                <div className="flex justify-between font-semibold text-base">
                  <span className="text-foreground">Total</span>
                  <span className="text-gold">₹{(Number(packageData.price || 0) * form.travelers).toLocaleString()}</span>
                </div>
              </div>
            </motion.div>

            {/* Booking Form */}
            <motion.form
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleSubmit}
              className="md:col-span-3 space-y-4"
            >
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">Your Details</h3>
              {[
                { name: "name" as const, placeholder: "Full Name", type: "text", icon: null },
                { name: "email" as const, placeholder: "Email Address", type: "email", icon: null },
                { name: "phone" as const, placeholder: "Phone Number", type: "tel", icon: null },
              ].map((field) => (
                <input
                  key={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  required
                  value={form[field.name]}
                  onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-card border border-border font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              ))}
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="date"
                    required
                    value={form.travelDate}
                    onChange={(e) => setForm({ ...form, travelDate: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-card border border-border font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50"
                  />
                </div>
                <div className="relative">
                  <Users className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="number"
                    min={1}
                    max={20}
                    required
                    value={form.travelers}
                    onChange={(e) => setForm({ ...form, travelers: parseInt(e.target.value) || 1 })}
                    placeholder="Travelers"
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-card border border-border font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50"
                  />
                </div>
              </div>
              <Button variant="gold" size="lg" className="w-full" type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Confirm Booking"}
              </Button>
              <p className="font-body text-xs text-muted-foreground text-center">
                No payment required now. We'll confirm your booking via phone/email.
              </p>
            </motion.form>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default BookingPage;
