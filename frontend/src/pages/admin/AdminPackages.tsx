import { useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { packages as initialPackages, type TravelPackage } from "@/data/mockData";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

const AdminPackages = () => {
  const [pkgs, setPkgs] = useState<TravelPackage[]>(initialPackages);
  const [editing, setEditing] = useState<TravelPackage | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", price: "", duration: "", description: "", facilities: "", thumbnailImage: "" });
  const [thumbnailPreview, setThumbnailPreview] = useState("");

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
    const objectUrl = URL.createObjectURL(file);
    setThumbnailPreview(objectUrl);
    setForm((prev) => ({ ...prev, thumbnailImage: objectUrl }));
  };

  const handleDelete = (id: string) => {
    setPkgs(pkgs.filter((p) => p.id !== id));
    toast({ title: "Package deleted" });
  };

  const resetForm = () => {
    setForm({ name: "", price: "", duration: "", description: "", facilities: "", thumbnailImage: "" });
    setThumbnailPreview("");
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.duration.trim() || !form.price.trim()) {
      toast({ title: "Please fill package name, duration, and price" });
      return;
    }
    if (!thumbnailPreview) {
      toast({ title: "Please upload a package thumbnail" });
      return;
    }
    if (editing) {
      setPkgs(pkgs.map((p) =>
        p.id === editing.id
          ? {
              ...p,
              name: form.name,
              price: Number(form.price),
              duration: form.duration,
              description: form.description,
              facilities: form.facilities.split(",").map((f) => f.trim()),
              thumbnailImage: thumbnailPreview,
              image: thumbnailPreview,
            }
          : p
      ));
      toast({ title: "Package updated" });
    } else {
      const newPkg: TravelPackage = {
        id: Date.now().toString(),
        name: form.name,
        price: Number(form.price),
        duration: form.duration,
        description: form.description,
        facilities: form.facilities.split(",").map((f) => f.trim()),
        destinationIds: [],
        thumbnailImage: thumbnailPreview,
        image: thumbnailPreview,
      };
      setPkgs([...pkgs, newPkg]);
      toast({ title: "Package added" });
    }
    setShowForm(false);
    setEditing(null);
    resetForm();
  };

  const startEdit = (p: TravelPackage) => {
    setEditing(p);
    setForm({
      name: p.name,
      price: String(p.price),
      duration: p.duration,
      description: p.description,
      facilities: p.facilities.join(", "),
      thumbnailImage: p.thumbnailImage || p.image,
    });
    setThumbnailPreview(p.thumbnailImage || p.image);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-semibold text-primary-foreground">Packages</h2>
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
          <h3 className="font-display text-base text-primary-foreground">{editing ? "Edit" : "Add"} Package</h3>
          <input
            placeholder="Package Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-mountain border border-primary-foreground/10 font-body text-sm text-primary-foreground placeholder:text-primary-foreground/30 focus:outline-none focus:ring-2 focus:ring-gold/50"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="Price (₹)"
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-mountain border border-primary-foreground/10 font-body text-sm text-primary-foreground placeholder:text-primary-foreground/30 focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
            <input
              placeholder="Duration"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-mountain border border-primary-foreground/10 font-body text-sm text-primary-foreground placeholder:text-primary-foreground/30 focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
          </div>
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 rounded-lg bg-mountain border border-primary-foreground/10 font-body text-sm text-primary-foreground placeholder:text-primary-foreground/30 focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none"
          />
          <input
            placeholder="Facilities (comma separated)"
            value={form.facilities}
            onChange={(e) => setForm({ ...form, facilities: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-mountain border border-primary-foreground/10 font-body text-sm text-primary-foreground placeholder:text-primary-foreground/30 focus:outline-none focus:ring-2 focus:ring-gold/50"
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary-foreground">Thumbnail Image (JPG, PNG, WEBP)</label>
            <input type="file" accept=".jpg,.jpeg,.png,.webp" onChange={handleThumbnailChange} className="w-full text-sm" />
            {thumbnailPreview && (
              <div className="w-36 h-24 rounded-lg overflow-hidden border border-primary-foreground/10 mt-2">
                <img src={thumbnailPreview} alt="Package Thumbnail" className="w-full h-full object-cover" />
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
        {pkgs.map((p) => (
          <div key={p.id} className="bg-mountain-light/40 rounded-xl p-4 border border-primary-foreground/10 flex items-center gap-4">
            <img src={p.thumbnailImage || p.image} alt={p.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h4 className="font-display text-sm font-semibold text-primary-foreground">{p.name}</h4>
              <p className="font-body text-xs text-primary-foreground/50">{p.duration} · ₹{p.price.toLocaleString()}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => startEdit(p)} className="p-2 rounded-lg hover:bg-primary-foreground/5 text-gold transition-colors"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPackages;
