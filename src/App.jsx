import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DisasterDataProvider } from './context/DisasterDataContext';
import TopBar from './components/common/TopBar';
import Sidebar from './components/common/Sidebar';

import DashboardPage from './pages/DashboardPage';
import RiskMapPage from './pages/RiskMapPage';
import ImpactPage from './pages/ImpactPage';
import NavigatorPage from './pages/NavigatorPage';
import ReportsPage from './pages/ReportsPage';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <DisasterDataProvider>
      <BrowserRouter>
        <div className="flex min-h-screen bg-[#FAFAF9] text-stone-900 font-sans">
          
          {/* Persistent Sidebar */}
          <Sidebar
            isOpen={isSidebarOpen}
            setIsOpen={setIsSidebarOpen}
            isMobileOpen={isMobileSidebarOpen}
            setIsMobileOpen={setIsMobileSidebarOpen}
          />

          {/* Main Layout Area */}
          <div className="flex-1 flex flex-col min-w-0 transition-all duration-200">
            {/* Top Bar with Alerts & Data Quality */}
            <TopBar onMenuToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />

            {/* Main Content View with generous breathing room */}
            <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto">
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/map" element={<RiskMapPage />} />
                <Route path="/impact" element={<ImpactPage />} />
                <Route path="/navigate" element={<NavigatorPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            {/* Quiet Footer */}
            <footer className="border-t border-[#DEE7EB] px-8 py-4 text-xs text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-3 max-w-7xl mx-auto w-full">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#84A98C]" />
                <span>NER Landslide Intelligence Platform · Operational Decision Support System</span>
              </div>
              <div className="font-mono text-[11px] text-[#5A7F8E]">
                Phase 1 MVP Architecture · FastAPI / PostGIS Ready
              </div>
            </footer>
          </div>

        </div>
      </BrowserRouter>
    </DisasterDataProvider>
  );
}
