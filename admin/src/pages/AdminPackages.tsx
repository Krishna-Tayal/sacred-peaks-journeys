import { useState, useEffect, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { type TravelPackage } from "@/data/mockData";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { getImageUrl } from "@/utils/utils";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

const AdminPackages = () => {
  const [pkgs, setPkgs] = useState<TravelPackage[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [editing, setEditing] = useState<TravelPackage | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [form, setForm] = useState({ name: "", price: "", duration: "", description: "", facilities: "" });
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const fetchPackages = async () => {
    setFetching(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/packages`);
      const data = await res.json();
      setPkgs(data?.data || []);
    } catch (error) {
      console.error("Error fetching packages", error);
      toast({ title: "Failed to load packages" });
    } finally {
      setFetching(false);
    }
  };

  const fetchDestinations = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/destinations`);
      const data = await res.json();
      setDestinations(data?.data || data || []);
    } catch (error) {
      console.error("Error fetching destinations", error);
    }
  };

  useEffect(() => {
    void fetchPackages();
    void fetchDestinations();
  }, []);

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
  };

  const handleDelete = async (pkg: TravelPackage) => {
    if (!window.confirm("Are you sure you want to delete this package?")) return;
    try {
      const id = (pkg as any)._id || pkg.id;
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/packages/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        toast({ title: data?.message || "Failed to delete package" });
        return;
      }
      toast({ title: "Package deleted" });
      await fetchPackages();
    } catch (error) {
      console.error("Error deleting package", error);
      toast({ title: "Error deleting package" });
    }
  };

  const resetForm = () => {
    setForm({ name: "", price: "", duration: "", description: "", facilities: "" });
    setSelectedDestinations([]);
    setThumbnailFile(null);
    setThumbnailPreview("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || selectedDestinations.length === 0 || !form.price.trim() || !form.duration.trim()) {
      toast({ title: "Please fill all required fields" });
      return;
    }
    if (!editing && !thumbnailFile) {
      toast({ title: "Please upload a thumbnail image" });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("destinations", selectedDestinations.join(","));
      formData.append("price", form.price);
      formData.append("duration", form.duration);
      formData.append("description", form.description);
      const facilitiesArray = form.facilities.split(",").map((f) => f.trim()).filter(Boolean);
      formData.append("facilities", JSON.stringify(facilitiesArray));
      if (thumbnailFile) formData.append("thumbnailImage", thumbnailFile);

      console.log("Submitting form...");
      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }

      let res;
      if (editing) {
        const id = (editing as any)._id || editing.id;
        res = await fetch(`${import.meta.env.VITE_API_URL}/api/packages/${id}`, { method: "PUT", body: formData });
      } else {
        res = await fetch(`${import.meta.env.VITE_API_URL}/api/packages`, { method: "POST", body: formData });
      }
      const data = await res.json();
      if (!res.ok) {
        toast({ title: data?.message || "Failed to save package" });
        return;
      }
      toast({ title: editing ? "Package updated" : "Package added" });
      setShowForm(false);
      setEditing(null);
      resetForm();
      await fetchPackages();
    } catch (error) {
      console.error("Error saving package", error);
      toast({ title: "Error saving package" });
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (p: TravelPackage) => {
    setEditing(p);
    const pkgDestinations = Array.isArray((p as any).destinations)
      ? (p as any).destinations
      : (p as any).destination
      ? [(p as any).destination]
      : [];
    setForm({
      name: p.name,
      price: String(p.price),
      duration: p.duration,
      description: p.description || "",
      facilities: Array.isArray(p.facilities) ? p.facilities.join(", ") : String(p.facilities || ""),
    });
    setSelectedDestinations(pkgDestinations.map((item: string) => String(item)));
    const thumb = (p as any).thumbnailImage || p.thumbnailImage || p.image;
    setThumbnailPreview(getImageUrl(thumb));
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-semibold text-primary-foreground">Packages</h2>
        <div className="flex items-center gap-2">
          {fetching && <span className="text-xs text-primary-foreground/70">Loading...</span>}
          <Button variant="gold" size="sm" onClick={() => { setShowForm(true); setEditing(null); resetForm(); }}>
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-mountain-light/40 rounded-xl p-6 border border-primary-foreground/10 mb-6 space-y-3"
        >
          <h3 className="font-display text-base text-primary-foreground">{editing ? "Edit" : "Add"} Package</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input placeholder="Package Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-mountain border border-primary-foreground/10 text-primary-foreground" />
            <input placeholder="Price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-mountain border border-primary-foreground/10 text-primary-foreground" />
            <input placeholder="Duration" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-mountain border border-primary-foreground/10 text-primary-foreground" />
          </div>
          <div className="rounded-lg bg-mountain border border-primary-foreground/10 p-3">
            <p className="text-sm font-medium text-primary-foreground mb-2">Select Destinations</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {destinations.map((d) => {
                const slug = String((d as any).slug || "");
                if (!slug) return null;
                return (
                  <label key={(d as any)._id || d.id || slug} className="flex items-center gap-2 text-sm text-primary-foreground/80">
                    <input
                      type="checkbox"
                      value={slug}
                      checked={selectedDestinations.includes(slug)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedDestinations((prev) => [...prev, slug]);
                        } else {
                          setSelectedDestinations((prev) => prev.filter((item) => item !== slug));
                        }
                      }}
                    />
                    {d.name}
                  </label>
                );
              })}
            </div>
          </div>
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg bg-mountain border border-primary-foreground/10 text-primary-foreground" />
          <input placeholder="Facilities (comma separated)" value={form.facilities} onChange={(e) => setForm({ ...form, facilities: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-mountain border border-primary-foreground/10 text-primary-foreground" />
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary-foreground">Thumbnail Image</label>
            <input type="file" accept=".jpg,.jpeg,.png,.webp" onChange={handleThumbnailChange} className="w-full text-sm" />
            {thumbnailPreview && <img src={thumbnailPreview} alt="Thumbnail" className="w-36 h-24 rounded-lg object-cover mt-2" />}
          </div>
          <div className="flex gap-2">
            <Button variant="gold" size="sm" type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => { setShowForm(false); setEditing(null); resetForm(); }} className="text-primary-foreground/50">Cancel</Button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {pkgs.map((p) => (
          <div key={(p as any)._id || p.id} className="bg-mountain-light/40 rounded-xl p-4 border border-primary-foreground/10 flex items-center gap-4">
            <img src={p.thumbnailImage ? getImageUrl(p.thumbnailImage) : "https://via.placeholder.com/64"} alt={p.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h4 className="font-display text-sm font-semibold text-primary-foreground">{p.name}</h4>
              <p className="font-body text-xs text-primary-foreground/50">
                {Array.isArray((p as any).destinations) && (p as any).destinations.length > 0
                  ? (p as any).destinations.join(", ")
                  : (p as any).destination || "Unknown destination"} · ₹{p.price} · {p.duration}
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => startEdit(p)} className="p-2 rounded-lg hover:bg-primary-foreground/5 text-gold transition-colors"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => void handleDelete(p)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPackages;
