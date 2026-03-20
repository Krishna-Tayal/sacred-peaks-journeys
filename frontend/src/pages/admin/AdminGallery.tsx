import { galleryImages } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

const AdminGallery = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-semibold text-primary-foreground">Gallery</h2>
        <Button variant="gold" size="sm"><Plus className="h-4 w-4" /> Upload</Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {galleryImages.map((img) => (
          <div key={img.id} className="relative group rounded-xl overflow-hidden">
            <img src={img.src} alt={img.alt} className="w-full aspect-square object-cover" />
            <div className="absolute inset-0 bg-mountain/0 group-hover:bg-mountain/50 transition-all duration-300 flex items-center justify-center">
              <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-destructive rounded-lg text-destructive-foreground">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <p className="absolute bottom-2 left-2 font-body text-xs text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity">{img.alt}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminGallery;
