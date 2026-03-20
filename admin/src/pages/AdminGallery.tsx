import { useEffect, useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { getImageUrl } from "@/utils/utils";

type GalleryItem = {
  _id: string;
  image: string;
  title?: string;
  createdAt?: string;
};

const AdminGallery = () => {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");

  const loadImages = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/gallery");

      if (!res.ok) {
        throw new Error("Failed to load gallery images.");
      }

      const data = await res.json();
      const galleryImages: GalleryItem[] = data?.data || data || [];
      setGallery(galleryImages);
    } catch (err) {
      console.error(err);
      setError("Unable to load gallery images. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadImages();
  }, []);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null;
    setFile(selected);
    setPreviewUrl(selected ? URL.createObjectURL(selected) : "");
  };

  const handleUpload = async () => {
    if (!file) {
      toast({ title: "Please select an image file before uploading." });
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("http://localhost:5000/api/gallery", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Upload failed.");
      }

      toast({ title: "Image uploaded successfully." });
      setFile(null);
      setPreviewUrl("");
      await loadImages();
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to upload image." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: GalleryItem) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/gallery/${item._id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Delete failed");
      }

      toast({ title: "Image deleted successfully." });
      await loadImages();
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to delete image." });
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="font-display text-xl font-semibold text-primary-foreground">Gallery</h2>
          <p className="text-sm text-primary-foreground/70">Manage gallery uploads and dynamic image sources.</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="cursor-pointer px-3 py-2 rounded-lg border border-primary-foreground/20 bg-background hover:bg-primary-foreground/5 text-sm font-medium flex items-center gap-2">
            <Upload className="h-4 w-4" /> Choose Image
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
          <Button variant="gold" size="sm" onClick={handleUpload} disabled={saving || !file}>
            {saving ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </div>

      {previewUrl && (
        <div className="mb-4">
          <p className="font-body text-xs text-primary-foreground/70 mb-1">Preview:</p>
          <img src={previewUrl} alt="Preview" className="w-40 h-28 object-cover rounded-lg border border-primary-foreground/15" />
        </div>
      )}

      {error && <div className="mb-4 text-sm text-destructive">{error}</div>}

      {loading ? (
        <div className="text-sm text-primary-foreground/70">Loading images...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {gallery.map((img) => (
            <div key={`${img._id}-${img.image}`} className="relative rounded-xl overflow-hidden border border-primary-foreground/10">
              <img src={getImageUrl(img.image)} alt={img.title || "Gallery image"} className="w-full aspect-square object-cover" />
              <div className="absolute inset-0 bg-mountain/0 group-hover:bg-mountain/50 transition-all duration-300" />
              <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                <p className="text-[11px] text-primary-foreground/90 truncate">{img.title || "Gallery image"}</p>
                <button onClick={() => void handleDelete(img)} className="p-1 rounded-md bg-destructive/80 text-destructive-foreground hover:bg-destructive">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
          {gallery.length === 0 && <div className="col-span-full text-sm text-primary-foreground/70">No gallery images found.</div>}
        </div>
      )}
    </div>
  );
};

export default AdminGallery;
