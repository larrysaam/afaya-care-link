import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Hospitals from "./pages/Hospitals";
import HospitalProfile from "./pages/HospitalProfile";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import ConsultationRequest from "./pages/ConsultationRequest";
import MyConsultations from "./pages/MyConsultations";
import ConsultationDetails from "./pages/ConsultationDetails";
import AdminConsultations from "./pages/AdminConsultations";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminHospitals from "./pages/AdminHospitals";
import AdminSpecialists from "./pages/AdminSpecialists";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>            <Route path="/" element={<Index />} />
            <Route path="/hospitals" element={<Hospitals />} />
            <Route path="/hospitals/:id" element={<HospitalProfile />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/consultation/:hospitalId" element={<ConsultationRequest />} />
            <Route path="/my-consultations" element={<MyConsultations />} />
            <Route path="/consultation-details/:id" element={<ConsultationDetails />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/consultations" element={<AdminConsultations />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/hospitals" element={<AdminHospitals />} />
            <Route path="/admin/hospitals/:hospitalId/specialists" element={<AdminSpecialists />} />
            <Route path="/profile" element={<Profile />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
