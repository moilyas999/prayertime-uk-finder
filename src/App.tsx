import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PrayerTimesPage from "./pages/PrayerTimesPage";
import SettingsPage from "./pages/SettingsPage";
import { BottomNavigation } from "./components/BottomNavigation";

const App: React.FC = () => {
  const queryClient = React.useMemo(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
      },
    },
  }), []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground">
          <HashRouter>
            <main className="pb-16 min-h-screen">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/prayer-times" element={<PrayerTimesPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<HomePage />} />
              </Routes>
            </main>
            <BottomNavigation />
          </HashRouter>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;