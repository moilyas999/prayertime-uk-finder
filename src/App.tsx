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
import WidgetPage from "./pages/WidgetPage";
import WidgetEmbed from "./pages/WidgetEmbed";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

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
            <Route path="/postcode" element={<PostcodePage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/reminders" element={<RemindersPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/widget" element={<WidgetPage />} />
            <Route path="/embed/:widgetId" element={<WidgetEmbed />} />
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
