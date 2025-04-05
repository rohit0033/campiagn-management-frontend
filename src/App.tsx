
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CampaignProvider } from "@/context/CampaignContext";
import NotFound from "./pages/NotFound";
import { AppLayout } from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import CampaignsList from "./pages/CampaignsList";
import CampaignForm from "./pages/CampaignForm";
import MessageGenerator from "./pages/MessageGenerator";
import Settings from "./pages/Settings";
import LeadsList from "./pages/LeadsList";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CampaignProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              }
            />
            <Route
              path="/campaigns"
              element={
                <AppLayout>
                  <CampaignsList />
                </AppLayout>
              }
            />
            <Route
              path="/campaigns/new"
              element={
                <AppLayout>
                  <CampaignForm />
                </AppLayout>
              }
            />
            <Route
              path="/campaigns/edit/:id"
              element={
                <AppLayout>
                  <CampaignForm />
                </AppLayout>
              }
            />
            <Route
              path="/message-generator"
              element={
                <AppLayout>
                  <MessageGenerator />
                </AppLayout>
              }
            />
                       <Route
              path="/leads"
              element={
                <AppLayout>
                  <LeadsList />
                </AppLayout>
              }
            />
            <Route
              path="/settings"
              element={
                <AppLayout>
                  <Settings />
                </AppLayout>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CampaignProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
