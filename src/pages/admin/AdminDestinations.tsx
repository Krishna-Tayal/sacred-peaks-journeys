import { useState } from "react";
import { Button } from "@/components/ui/button";
import { destinations as initialDestinations, type Destination } from "@/data/mockData";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const AdminDestinations = () => {
  const [dests, setDests] = useState<Destination[]>(initialDestinations);
  const [editing, setEditing] = useState<Destination | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", shortDescription: "", description: "", bestTimeToVisit: "", altitude: "" });

  const handleDelete = (id: string) => {
    setDests(dests.filter((d) => d.id !== id));
    toast({ title: "Destination deleted" });
  };

  const handleSave = () => {
    if (editing) {
      setDests(dests.map((d) => (d.id === editing.id ? { ...d, ...form } : d)));
      toast({ title: "Destination updated" });
    } else {
      const newDest: Destination = {
        id: Date.now().toString(),
        ...form,
        image: initialDestinations[0].image,
        gallery: [],
      };
      setDests([...dests, newDest]);
      toast({ title: "Destination added" });
    }
    setShowForm(false);
    setEditing(null);
    setForm({ name: "", slug: "", shortDescription: "", description: "", bestTimeToVisit: "", altitude: "" });
  };

  const startEdit = (d: Destination) => {
    setEditing(d);
    setForm({ name: d.name, slug: d.slug, shortDescription: d.shortDescription, description: d.description, bestTimeToVisit: d.bestTimeToVisit, altitude: d.altitude });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-semibold text-primary-foreground">Destinations</h2>
        <Button variant="gold" size="sm" onClick={() => { setShowForm(true); setEditing(null); setForm({ name: "", slug: "", shortDescription: "", description: "", bestTimeToVisit: "", altitude: "" }); }}>
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
          <div className="flex gap-2">
            <Button variant="gold" size="sm" onClick={handleSave}>Save</Button>
            <Button variant="ghost" size="sm" onClick={() => { setShowForm(false); setEditing(null); }} className="text-primary-foreground/50">Cancel</Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {dests.map((d) => (
          <div key={d.id} className="bg-mountain-light/40 rounded-xl p-4 border border-primary-foreground/10 flex items-center gap-4">
            <img src={d.image} alt={d.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h4 className="font-display text-sm font-semibold text-primary-foreground">{d.name}</h4>
              <p className="font-body text-xs text-primary-foreground/50 truncate">{d.shortDescription}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => startEdit(d)} className="p-2 rounded-lg hover:bg-primary-foreground/5 text-gold transition-colors">
                <Pencil className="h-4 w-4" />
              </button>
              <button onClick={() => handleDelete(d.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDestinations;
