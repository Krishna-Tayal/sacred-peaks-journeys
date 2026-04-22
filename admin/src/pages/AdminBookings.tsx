import { useEffect, useState } from "react";

type BookingStatus = "pending" | "confirmed" | "completed";

type Booking = {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  phone: string;
  package: string;
  travelers: number;
  date: string;
  status: BookingStatus;
};

const statusColors = {
  pending: "bg-saffron/20 text-saffron",
  confirmed: "bg-gold/20 text-gold",
  completed: "bg-emerald-500/20 text-emerald-400",
};

const AdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string>("");

  const fetchBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings`);
      const result = await response.json();
      if (!response.ok) {
        setError(result?.message || "Failed to load bookings.");
        return;
      }
      setBookings(result?.data || []);
    } catch (fetchError) {
      console.error("Error fetching bookings", fetchError);
      setError("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: BookingStatus) => {
    setUpdatingId(id);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const result = await response.json();
        setError(result?.message || "Failed to update booking status.");
        return;
      }

      await fetchBookings();
    } catch (updateError) {
      console.error("Error updating booking status", updateError);
      setError("Failed to update booking status.");
    } finally {
      setUpdatingId("");
    }
  };

  useEffect(() => {
    void fetchBookings();
  }, []);

  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-primary-foreground mb-6">Bookings</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-primary-foreground/10">
              {["Name", "Package", "Date", "Travelers", "Status"].map((h) => (
                <th key={h} className="text-left py-3 px-4 font-body text-xs text-primary-foreground/40 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="py-6 px-4 text-center font-body text-sm text-primary-foreground/60">
                  Loading bookings...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className="py-6 px-4 text-center font-body text-sm text-destructive">
                  {error}
                </td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-6 px-4 text-center font-body text-sm text-primary-foreground/60">
                  No bookings found.
                </td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr key={b._id || b.id || `${b.email}-${b.date}`} className="border-b border-primary-foreground/5 hover:bg-primary-foreground/5 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-body text-sm text-primary-foreground">{b.name}</p>
                    <p className="font-body text-xs text-primary-foreground/40">{b.email}</p>
                  </td>
                  <td className="py-3 px-4 font-body text-sm text-primary-foreground/70">{b.package || "N/A"}</td>
                  <td className="py-3 px-4 font-body text-sm text-primary-foreground/70">{b.date ? new Date(b.date).toLocaleDateString() : "-"}</td>
                  <td className="py-3 px-4 font-body text-sm text-primary-foreground/70">{b.travelers}</td>
                  <td className="py-3 px-4">
                    <select
                      value={b.status}
                      onChange={(e) => void updateStatus(b._id || b.id || "", e.target.value as BookingStatus)}
                      disabled={!b._id && !b.id || updatingId === (b._id || b.id || "")}
                      className={`px-2 py-1 rounded-full text-xs font-body font-medium bg-transparent border border-primary-foreground/15 focus:outline-none ${statusColors[b.status]}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBookings;
