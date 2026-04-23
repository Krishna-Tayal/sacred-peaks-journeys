import { useState, useEffect, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { type Destination } from "@/data/mockData";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { getImageUrl } from "@/utils/utils";
console.log("API URL:", import.meta.env.VITE_API_URL);
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

const AdminDestinations = () => {
  const [dests, setDests] = useState<Destination[]>([]);
  const [editing, setEditing] = useState<Destination | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [form, setForm] = useState({ name: "", shortDescription: "", description: "", bestTimeToVisit: "", altitude: "", thumbnailImage: "", galleryImages: [] as string[] });
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDestinations = async () => {
    setFetching(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/destinations`);
      const data = await response.json();
      setDests(data?.data || []);
    } catch (error) {
      console.error("Error fetching destinations", error);
      toast({ title: "Failed to load destinations" });
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    void fetchDestinations();
  }, []);

  const handleDelete = async (destination: Destination) => {
    const destinationName = destination.name || "this destination";
    const destinationId = (destination as any)._id || destination.id;
    if (!window.confirm(`Are you sure you want to delete ${destinationName}?`)) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/destinations/${destinationId}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        toast({ title: data?.message || "Failed to delete destination" });
        return;
      }

      toast({ title: "Destination deleted" });
      await fetchDestinations();
    } catch (error) {
      console.error("Error deleting destination", error);
      toast({ title: "Error deleting destination" });
    }
  };

  const validateImageFile = (file: File) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast({ title: "Only JPG, PNG, or WEBP images are allowed" });
      return false;
    }
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      toast({ title: "Maximum image size is 5MB" });
      return false;
    }
    return true;
  };

  const handleThumbnailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!validateImageFile(file)) return;
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
    setForm((prev) => ({ ...prev, thumbnailImage: "" }));
  };

  const handleGalleryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(validateImageFile);
    if (!validFiles.length) return;
    setGalleryFiles((prev) => [...prev, ...validFiles]);
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setGalleryPreviews((prev) => [...prev, ...newPreviews]);
    setForm((prev) => ({ ...prev, galleryImages: [] }));
  };

  const removeGalleryImage = (index: number) => {
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setForm((prev) => ({ ...prev, galleryImages: prev.galleryImages.filter((_, i) => i !== index) }));
  };

  const resetForm = () => {
    setForm({ name: "", shortDescription: "", description: "", bestTimeToVisit: "", altitude: "", thumbnailImage: "", galleryImages: [] });
    setThumbnailPreview("");
    setGalleryPreviews([]);
    setThumbnailFile(null);
    setGalleryFiles([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    alert("SUBMIT WORKING");
    e.preventDefault();
    console.log("FORM SUBMITTED");

    if (!form.name.trim() || !form.shortDescription.trim()) {
      toast({ title: "Please fill in name and short description" });
      return;
    }
    if (!form.description.trim()) {
      toast({ title: "Please add full description" });
      return;
    }
    if (!form.bestTimeToVisit.trim() || !form.altitude.trim()) {
      toast({ title: "Please add best time and altitude" });
      return;
    }
    if (!thumbnailFile && !thumbnailPreview) {
      toast({ title: "Please upload a thumbnail image" });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("shortDescription", form.shortDescription);
      formData.append("description", form.description);
      formData.append("bestTimeToVisit", form.bestTimeToVisit);
      formData.append("bestTime", form.bestTimeToVisit);
      formData.append("altitude", form.altitude);

      if (thumbnailFile) {
        formData.append("thumbnailImage", thumbnailFile);
      }
      galleryFiles.forEach((file) => {
        formData.append("galleryImages", file);
      });

      console.log("Submitting form...");
      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const destinationId = editing ? (editing as any)._id || editing.id : null;
      const response = await fetch(
        destinationId
          ? `${import.meta.env.VITE_API_URL}/api/destinations/${destinationId}`
          : `${import.meta.env.VITE_API_URL}/api/destinations`,
        {
          method: destinationId ? "PUT" : "POST",
          body: formData,
        }
      );
      const data = await response.json();
      console.log("Response:", data);

      if (!response.ok) {
        toast({ title: data?.message || "Failed to create destination" });
        return;
      }

      await fetchDestinations();
      toast({ title: editing ? "Destination updated" : "Destination added successfully" });
      setShowForm(false);
      setEditing(null);
      resetForm();
    } catch (error) {
      console.error("Error saving destination", error);
      toast({ title: "Error saving destination" });
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (d: Destination) => {
    setEditing(d);
    const gallerySource = d.galleryImages?.length ? d.galleryImages : d.gallery || [];
    setForm({
      name: d.name,
      shortDescription: d.shortDescription,
      description: d.description,
      bestTimeToVisit: d.bestTimeToVisit,
      altitude: d.altitude,
      thumbnailImage: d.thumbnailImage || d.image,
      galleryImages: gallerySource,
    });
    setThumbnailPreview(getImageUrl(d.thumbnailImage || d.image));
    setGalleryPreviews(gallerySource.map(getImageUrl));
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-semibold text-primary-foreground">Destinations</h2>
        <div className="flex items-center gap-2">
          {fetching && <span className="text-xs text-primary-foreground/70">Loading...</span>}
          <Button
            variant="gold"
            size="sm"
            onClick={() => {
              setShowForm(true);
              setEditing(null);
              resetForm();
            }}
          >
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-mountain-light/40 rounded-xl p-6 border border-primary-foreground/10 mb-6 space-y-3"
        >
          <h3 className="font-display text-base text-primary-foreground">{editing ? "Edit" : "Add"} Destination</h3>

          {(["name", "shortDescription", "bestTimeToVisit", "altitude"] as const).map((field) => (
            <input
              key={field}
              placeholder={field.replace(/([A-Z])/g, " $1").trim()}
              value={(form as any)[field]}
              onChange={(e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-mountain border border-primary-foreground/10 font-body text-sm text-primary-foreground placeholder:text-primary-foreground/30 focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
          ))}

          <textarea
            placeholder="Full Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 rounded-lg bg-mountain border border-primary-foreground/10 font-body text-sm text-primary-foreground placeholder:text-primary-foreground/30 focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none"
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary-foreground">Thumbnail Image (JPG, PNG, WEBP)</label>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={handleThumbnailChange}
              className="w-full text-sm"
            />
            {thumbnailPreview && (
              <div className="relative w-36 h-24 mt-2 rounded-lg overflow-hidden border border-primary-foreground/10">
                <img src={thumbnailPreview} alt="thumbnail preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary-foreground">Gallery Images (multiple)</label>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              multiple
              onChange={handleGalleryChange}
              className="w-full text-sm"
            />
            {galleryPreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                {galleryPreviews.map((img, i) => (
                  <div key={`${img}-${i}`} className="relative rounded-lg overflow-hidden border border-primary-foreground/10">
                    <img src={img} alt={`gallery ${i + 1}`} className="w-full h-20 object-cover" />
                    <button
                      onClick={() => removeGalleryImage(i)}
                      className="absolute top-1 right-1 z-10 rounded-full bg-mountain/80 p-1 text-primary-foreground hover:bg-destructive"
                      type="button"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-gold text-mountain-dark hover:bg-gold/90 h-9 px-4 py-2"
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <Button type="button" variant="ghost" size="sm" onClick={() => { setShowForm(false); setEditing(null); resetForm(); }} className="text-primary-foreground/50">Cancel</Button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {fetching && dests.length === 0 ? (
          <div className="text-sm text-primary-foreground/60">Loading destinations...</div>
        ) : (
          dests.map((d) => (
            <div key={d.id} className="bg-mountain-light/40 rounded-xl p-4 border border-primary-foreground/10 flex items-center gap-4">
              <img src={getImageUrl(d.thumbnailImage || d.image)} alt={d.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="font-display text-sm font-semibold text-primary-foreground">{d.name}</h4>
                <p className="font-body text-xs text-primary-foreground/50 truncate">{d.shortDescription}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => startEdit(d)} className="p-2 rounded-lg hover:bg-primary-foreground/5 text-gold transition-colors"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => void handleDelete(d)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminDestinations;
