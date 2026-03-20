import { packages } from "@/data/mockData";

const mockBookings = [
  { id: "1", name: "Rajesh Sharma", email: "rajesh@email.com", phone: "+91 98765 43210", travelDate: "2026-05-15", travelers: 4, packageId: "1", status: "confirmed" as const, createdAt: "2026-03-10" },
  { id: "2", name: "Priya Patel", email: "priya@email.com", phone: "+91 87654 32109", travelDate: "2026-06-01", travelers: 2, packageId: "2", status: "pending" as const, createdAt: "2026-03-12" },
  { id: "3", name: "Amit Kumar", email: "amit@email.com", phone: "+91 76543 21098", travelDate: "2026-05-20", travelers: 6, packageId: "1", status: "pending" as const, createdAt: "2026-03-14" },
];

const statusColors = {
  pending: "bg-saffron/20 text-saffron",
  confirmed: "bg-gold/20 text-gold",
  cancelled: "bg-destructive/20 text-destructive",
};

const AdminBookings = () => {
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
            {mockBookings.map((b) => {
              const pkg = packages.find((p) => p.id === b.packageId);
              return (
                <tr key={b.id} className="border-b border-primary-foreground/5 hover:bg-primary-foreground/5 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-body text-sm text-primary-foreground">{b.name}</p>
                    <p className="font-body text-xs text-primary-foreground/40">{b.email}</p>
                  </td>
                  <td className="py-3 px-4 font-body text-sm text-primary-foreground/70">{pkg?.name || "N/A"}</td>
                  <td className="py-3 px-4 font-body text-sm text-primary-foreground/70">{b.travelDate}</td>
                  <td className="py-3 px-4 font-body text-sm text-primary-foreground/70">{b.travelers}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-body font-medium ${statusColors[b.status]}`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBookings;
