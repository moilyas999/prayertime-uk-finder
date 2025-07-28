import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Welcome from "./pages/Welcome";
import PostcodePage from "./pages/PostcodePage";
import ResultsPage from "./pages/ResultsPage";
import RemindersPage from "./pages/RemindersPage";
import AuthPage from "./pages/AuthPage";
import AccountPage from "./pages/AccountPage";
import NotificationsPage from "./pages/NotificationsPage";
import LocationAccessPage from "./pages/LocationAccessPage";
import ForecastPage from "./pages/ForecastPage";
import MosqueAdminPage from "./pages/MosqueAdminPage";
import WidgetPage from "./pages/WidgetPage";
import WidgetEmbed from "./pages/WidgetEmbed";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AzanSettingsPage from "./pages/AzanSettingsPage";
import ThemesPage from "./pages/ThemesPage";
import IslamicCalendarPage from "./pages/IslamicCalendarPage";
import IqamaSubmitPage from "./pages/IqamaSubmitPage";
import MosqueAnalyticsPage from "./pages/MosqueAnalyticsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/location-access" element={<LocationAccessPage />} />
            <Route path="/postcode" element={<PostcodePage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/forecast" element={<ForecastPage />} />
            <Route path="/reminders" element={<RemindersPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/mosque-admin" element={<MosqueAdminPage />} />
            <Route path="/widget" element={<WidgetPage />} />
            <Route path="/embed/:widgetId" element={<WidgetEmbed />} />
            <Route path="/azan-settings" element={<AzanSettingsPage />} />
            <Route path="/themes" element={<ThemesPage />} />
            <Route path="/islamic-calendar" element={<IslamicCalendarPage />} />
            <Route path="/iqama-submit" element={<IqamaSubmitPage />} />
            <Route path="/mosque-analytics" element={<MosqueAnalyticsPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
