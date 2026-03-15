import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DestinationsPage from "./pages/DestinationsPage";
import DestinationDetailPage from "./pages/DestinationDetailPage";
import PackagesPage from "./pages/PackagesPage";
import BookingPage from "./pages/BookingPage";
import GalleryPage from "./pages/GalleryPage";
import ContactPage from "./pages/ContactPage";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminDestinations from "./pages/admin/AdminDestinations";
import AdminPackages from "./pages/admin/AdminPackages";
import AdminGallery from "./pages/admin/AdminGallery";
import AdminBookings from "./pages/admin/AdminBookings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/destinations" element={<DestinationsPage />} />
          <Route path="/destinations/:slug" element={<DestinationDetailPage />} />
          <Route path="/packages" element={<PackagesPage />} />
          <Route path="/booking/:packageId" element={<BookingPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="destinations" element={<AdminDestinations />} />
            <Route path="packages" element={<AdminPackages />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="bookings" element={<AdminBookings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
