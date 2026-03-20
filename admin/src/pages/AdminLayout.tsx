import { useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { Mountain, LayoutDashboard, MapPin, Package, Image, BookOpen, LogOut, Menu, X } from "lucide-react";

const sidebarLinks = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Destinations", path: "/destinations", icon: MapPin },
  { name: "Packages", path: "/packages", icon: Package },
  { name: "Gallery", path: "/gallery", icon: Image },
  { name: "Bookings", path: "/bookings", icon: BookOpen },
];

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-mountain flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-mountain border-r border-primary-foreground/10 flex flex-col transform transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-5 flex items-center gap-2 border-b border-primary-foreground/10">
          <Mountain className="h-6 w-6 text-gold" />
          <span className="font-display text-lg font-bold text-gold">Admin Panel</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {sidebarLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-body text-sm transition-colors ${
                location.pathname === link.path
                  ? "bg-gold/10 text-gold"
                  : "text-primary-foreground/50 hover:text-primary-foreground hover:bg-primary-foreground/5"
              }`}
            >
              <link.icon className="h-4 w-4" />
              {link.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-primary-foreground/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-body text-sm text-destructive hover:bg-destructive/10 w-full transition-colors"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-mountain/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 md:ml-64">
        <header className="sticky top-0 z-30 bg-mountain/95 backdrop-blur-md border-b border-primary-foreground/10 px-4 py-3 flex items-center gap-3">
          <button className="md:hidden text-gold" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <h1 className="font-display text-base font-semibold text-primary-foreground">
            {sidebarLinks.find((l) => l.path === location.pathname)?.name || "Admin"}
          </h1>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
