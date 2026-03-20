import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type GalleryImage = {
  _id: string;
  image: string;
};

const GallerySection = () => {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGallery = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/gallery");
      const result = await res.json();
      setGalleryImages(result.data || result || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchGallery();
  }, []);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="font-body text-gold text-sm tracking-[0.2em] uppercase mb-2">Gallery</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Moments from the <span className="text-gradient-gold">Himalayas</span>
          </h2>
        </motion.div>

        {loading ? (
          <p className="text-center text-primary-foreground/70">Loading...</p>
        ) : galleryImages.length === 0 ? (
          <p className="text-center text-primary-foreground/70">No gallery images found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {galleryImages.map((item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-lg overflow-hidden"
              >
                <img
                  src={`http://localhost:5000/${item.image}`}
                  alt="gallery"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default GallerySection;
