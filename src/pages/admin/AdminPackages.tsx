import { useState } from "react";
import { Button } from "@/components/ui/button";
import { packages as initialPackages, type TravelPackage } from "@/data/mockData";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const AdminPackages = () => {
  const [pkgs, setPkgs] = useState<TravelPackage[]>(initialPackages);
  const [editing, setEditing] = useState<TravelPackage | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", price: "", duration: "", description: "", facilities: "" });

  const handleDelete = (id: string) => {
    setPkgs(pkgs.filter((p) => p.id !== id));
    toast({ title: "Package deleted" });
  };

  const handleSave = () => {
    if (editing) {
      setPkgs(pkgs.map((p) => (p.id === editing.id ? { ...p, name: form.name, price: Number(form.price), duration: form.duration, description: form.description, facilities: form.facilities.split(",").map((f) => f.trim()) } : p)));
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
        image: initialPackages[0].image,
      };
      setPkgs([...pkgs, newPkg]);
      toast({ title: "Package added" });
    }
    setShowForm(false);
    setEditing(null);
  };

  const startEdit = (p: TravelPackage) => {
    setEditing(p);
    setForm({ name: p.name, price: String(p.price), duration: p.duration, description: p.description, facilities: p.facilities.join(", ") });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-semibold text-primary-foreground">Packages</h2>
        <Button variant="gold" size="sm" onClick={() => { setShowForm(true); setEditing(null); setForm({ name: "", price: "", duration: "", description: "", facilities: "" }); }}>
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>

      {showForm && (
        <div className="bg-mountain-light/40 rounded-xl p-6 border border-primary-foreground/10 mb-6 space-y-3">
          <h3 className="font-display text-base text-primary-foreground">{editing ? "Edit" : "Add"} Package</h3>
          <input placeholder="Package Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-mountain border border-primary-foreground/10 font-body text-sm text-primary-foreground placeholder:text-primary-foreground/30 focus:outline-none focus:ring-2 focus:ring-gold/50" />
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Price (₹)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-mountain border border-primary-foreground/10 font-body text-sm text-primary-foreground placeholder:text-primary-foreground/30 focus:outline-none focus:ring-2 focus:ring-gold/50" />
            <input placeholder="Duration" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-mountain border border-primary-foreground/10 font-body text-sm text-primary-foreground placeholder:text-primary-foreground/30 focus:outline-none focus:ring-2 focus:ring-gold/50" />
          </div>
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg bg-mountain border border-primary-foreground/10 font-body text-sm text-primary-foreground placeholder:text-primary-foreground/30 focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none" />
          <input placeholder="Facilities (comma separated)" value={form.facilities} onChange={(e) => setForm({ ...form, facilities: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-mountain border border-primary-foreground/10 font-body text-sm text-primary-foreground placeholder:text-primary-foreground/30 focus:outline-none focus:ring-2 focus:ring-gold/50" />
          <div className="flex gap-2">
            <Button variant="gold" size="sm" onClick={handleSave}>Save</Button>
            <Button variant="ghost" size="sm" onClick={() => { setShowForm(false); setEditing(null); }} className="text-primary-foreground/50">Cancel</Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {pkgs.map((p) => (
          <div key={p.id} className="bg-mountain-light/40 rounded-xl p-4 border border-primary-foreground/10 flex items-center gap-4">
            <img src={p.image} alt={p.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
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
