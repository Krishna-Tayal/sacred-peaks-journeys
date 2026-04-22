import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

type Review = {
  _id?: string;
  id?: string;
  name: string;
  city: string;
  rating: number;
  message: string;
  createdAt?: string;
};

const TestimonialsSection = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    rating: 5,
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    setLoadingReviews(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews`);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.message || "Failed to load reviews.");
      }
      setReviews(result?.data || []);
    } catch (error) {
      console.error(error);
      setReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    void fetchReviews();
  }, []);

  const limitedReviews = [...reviews]
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, 5);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!response.ok) {
        toast({
          title: "Review submission failed",
          description: result?.message || "Please try again.",
        });
        return;
      }

      toast({
        title: "Review submitted",
        description: "Thank you for sharing your experience.",
      });

      await fetchReviews();

      setFormData({
        name: "",
        city: "",
        rating: 5,
        message: "",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Review submission failed",
        description: "Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

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

        {loadingReviews ? (
          <div className="text-center text-primary-foreground/70">Loading reviews...</div>
        ) : limitedReviews.length === 0 ? (
          <div className="text-center text-primary-foreground/60">No reviews yet. Be the first to share your experience.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {limitedReviews.map((review, i) => (
              <motion.div
                key={review._id || review.id || `${review.name}-${i}`}
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
                      className={`h-4 w-4 ${j < review.rating ? "text-gold fill-gold" : "text-primary-foreground/20"}`}
                    />
                  ))}
                </div>
                <p className="font-body text-sm text-primary-foreground/70 mb-5 leading-relaxed italic">
                  "{review.message}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center text-mountain font-body font-bold text-sm">
                    {review.name?.slice(0, 1)?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="font-body text-sm font-semibold text-primary-foreground">{review.name}</p>
                    <p className="font-body text-xs text-primary-foreground/50">{review.city}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-14 max-w-2xl mx-auto bg-mountain-light/40 backdrop-blur-sm rounded-xl p-6 border border-primary-foreground/10"
        >
          <h3 className="font-display text-2xl font-semibold text-primary-foreground mb-4 text-center">Share Your Review</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-mountain border border-primary-foreground/10 font-body text-sm text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none focus:ring-2 focus:ring-gold/40"
              />
              <input
                type="text"
                required
                placeholder="City"
                value={formData.city}
                onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-mountain border border-primary-foreground/10 font-body text-sm text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none focus:ring-2 focus:ring-gold/40"
              />
            </div>

            <div>
              <label className="block text-xs text-primary-foreground/60 mb-1">Rating</label>
              <select
                value={formData.rating}
                onChange={(e) => setFormData((prev) => ({ ...prev, rating: Number(e.target.value) }))}
                className="w-full px-3 py-2 rounded-lg bg-mountain border border-primary-foreground/10 font-body text-sm text-primary-foreground focus:outline-none focus:ring-2 focus:ring-gold/40"
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
            </div>

            <textarea
              required
              placeholder="Message"
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-mountain border border-primary-foreground/10 font-body text-sm text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none focus:ring-2 focus:ring-gold/40 resize-none"
            />

            <Button type="submit" variant="gold" className="w-full" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Review"}
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
