import { useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { destinations as initialDestinations, type Destination } from "@/data/mockData";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

const AdminDestinations = () => {
  const [dests, setDests] = useState<Destination[]>(initialDestinations);
  const [editing, setEditing] = useState<Destination | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", shortDescription: "", description: "", bestTimeToVisit: "", altitude: "", thumbnailImage: "", galleryImages: [] as string[] });
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  const handleDelete = (id: string) => {
    setDests(dests.filter((d) => d.id !== id));
    toast({ title: "Destination deleted" });
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
    setThumbnailPreview(URL.createObjectURL(file));
    setForm((prev) => ({ ...prev, thumbnailImage: URL.createObjectURL(file) }));
  };

  const handleGalleryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(validateImageFile);
    if (!validFiles.length) return;
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setGalleryPreviews((prev) => [...prev, ...newPreviews]);
    setForm((prev) => ({ ...prev, galleryImages: [...prev.galleryImages, ...newPreviews] }));
  };

  const removeGalleryImage = (index: number) => {
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
    setForm((prev) => ({ ...prev, galleryImages: prev.galleryImages.filter((_, i) => i !== index) }));
  };

  const resetForm = () => {
    setForm({ name: "", slug: "", shortDescription: "", description: "", bestTimeToVisit: "", altitude: "", thumbnailImage: "", galleryImages: [] });
    setThumbnailPreview("");
    setGalleryPreviews([]);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.slug.trim() || !form.shortDescription.trim()) {
      toast({ title: "Please fill in name, slug, and short description" });
      return;
    }
    if (!thumbnailPreview) {
      toast({ title: "Please upload a thumbnail image" });
      return;
    }

    if (editing) {
      setDests(dests.map((d) =>
        d.id === editing.id
          ? {
              ...d,
              ...form,
              image: thumbnailPreview,
              thumbnailImage: thumbnailPreview,
              gallery: galleryPreviews,
              galleryImages: galleryPreviews,
            }
          : d
      ));
      toast({ title: "Destination updated" });
    } else {
      const newDest: Destination = {
        id: Date.now().toString(),
        name: form.name,
        slug: form.slug,
        shortDescription: form.shortDescription,
        description: form.description,
        image: thumbnailPreview,
        thumbnailImage: thumbnailPreview,
        bestTimeToVisit: form.bestTimeToVisit,
        altitude: form.altitude,
        gallery: galleryPreviews.length > 0 ? galleryPreviews : [thumbnailPreview],
        galleryImages: galleryPreviews.length > 0 ? galleryPreviews : [thumbnailPreview],
      };
      setDests([...dests, newDest]);
      toast({ title: "Destination added" });
    }

    setShowForm(false);
    setEditing(null);
    resetForm();
  };

  const startEdit = (d: Destination) => {
    setEditing(d);
    setForm({
      name: d.name,
      slug: d.slug,
      shortDescription: d.shortDescription,
      description: d.description,
      bestTimeToVisit: d.bestTimeToVisit,
      altitude: d.altitude,
      thumbnailImage: d.thumbnailImage || d.image,
      galleryImages: d.galleryImages?.length ? d.galleryImages : d.gallery,
    });
    setThumbnailPreview(d.thumbnailImage || d.image);
    setGalleryPreviews(d.galleryImages?.length ? d.galleryImages : d.gallery);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-semibold text-primary-foreground">Destinations</h2>
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

      {showForm && (
        <div className="bg-mountain-light/40 rounded-xl p-6 border border-primary-foreground/10 mb-6 space-y-3">
          <h3 className="font-display text-base text-primary-foreground">{editing ? "Edit" : "Add"} Destination</h3>

          {(["name", "slug", "shortDescription", "bestTimeToVisit", "altitude"] as const).map((field) => (
            <input
              key={field}
              placeholder={field.replace(/([A-Z])/g, " $1").trim()}
              value={(form as any)[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
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
            <Button variant="gold" size="sm" onClick={handleSave}>Save</Button>
            <Button variant="ghost" size="sm" onClick={() => { setShowForm(false); setEditing(null); resetForm(); }} className="text-primary-foreground/50">Cancel</Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {dests.map((d) => (
          <div key={d.id} className="bg-mountain-light/40 rounded-xl p-4 border border-primary-foreground/10 flex items-center gap-4">
            <img src={d.thumbnailImage || d.image} alt={d.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h4 className="font-display text-sm font-semibold text-primary-foreground">{d.name}</h4>
              <p className="font-body text-xs text-primary-foreground/50 truncate">{d.shortDescription}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => startEdit(d)} className="p-2 rounded-lg hover:bg-primary-foreground/5 text-gold transition-colors"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => handleDelete(d.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDestinations;
