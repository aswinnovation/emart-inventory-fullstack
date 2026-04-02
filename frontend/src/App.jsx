import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { InventoryProvider } from "./contexts/InventoryContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import InventoryUpload from "./pages/InventoryUpload";
import MovementPage from "./pages/MovementPage";
import BarcodePage from "./pages/BarcodePage";
import InvoicePage from "./pages/InvoicePage";
import AlertsPage from "./pages/AlertsPage";
import ProductPage from "./pages/ProductPage"; // ✅ ADD THIS
import Layout from "./components/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <InventoryProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="inventory-upload" element={<InventoryUpload />} />
                <Route path="movement" element={<MovementPage />} />
                <Route path="barcode" element={<BarcodePage />} />
                <Route path="invoice" element={<InvoicePage />} />
                <Route path="alerts" element={<AlertsPage />} />
                <Route path="products" element={<ProductPage />} /> 
              </Route>
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </BrowserRouter>
        </InventoryProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
