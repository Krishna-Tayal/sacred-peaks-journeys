import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import heroImg from "@/assets/hero-bg.jpg";

type GalleryImage = {
  _id: string;
  image: string;
};

const GalleryPage = () => {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGallery = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/gallery");
      const result = await res.json();
      setGalleryImages(result.data || result || []);
    } catch (error) {
      console.error("Gallery fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchGallery();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="relative h-[40vh] flex items-center justify-center">
        <img src={heroImg} alt="Himalayas" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-mountain/70" />
        <div className="relative z-10 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground">
            Photo <span className="text-gradient-gold">Gallery</span>
          </h1>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center text-sm text-primary-foreground/70">Loading gallery...</div>
          ) : galleryImages.length === 0 ? (
            <p className="text-center text-primary-foreground/70">No gallery images found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {galleryImages.map((item) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="rounded-xl overflow-hidden"
                >
                  <img
                    src={`http://localhost:5000/${item.image}`}
                    alt="gallery"
                    className="w-full h-64 object-cover rounded-lg transition-transform duration-700 hover:scale-105"
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default GalleryPage;
