import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./pages/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminDestinations from "./pages/AdminDestinations";
import AdminPackages from "./pages/AdminPackages";
import AdminGallery from "./pages/AdminGallery";
import AdminBookings from "./pages/AdminBookings";
import NotFound from "./pages/NotFound";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="destinations" element={<AdminDestinations />} />
        <Route path="packages" element={<AdminPackages />} />
        <Route path="gallery" element={<AdminGallery />} />
        <Route path="bookings" element={<AdminBookings />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
