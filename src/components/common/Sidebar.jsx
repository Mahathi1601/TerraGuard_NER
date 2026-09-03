import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Map, 
  Network, 
  Navigation, 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  Activity,
  Compass
} from 'lucide-react';

const NAV_ITEMS = [
  {
    path: '/',
    label: 'Command Center',
    icon: Home,
    sublabel: 'Dashboard & Metrics',
  },
  {
    path: '/map',
    label: 'Risk Map',
    icon: Map,
    sublabel: 'InSAR & Spatial Grid',
  },
  {
    path: '/impact',
    label: 'Roads & Villages',
    icon: Network,
    sublabel: 'Impact & Isolation',
  },
  {
    path: '/navigate',
    label: 'Navigator',
    icon: Navigation,
    sublabel: 'Risk-Aware Routing',
  },
  {
    path: '/reports',
    label: 'Field Reports',
    icon: FileText,
    sublabel: 'Ground Truth Submissions',
  },
];

export default function Sidebar({ isOpen, setIsOpen, isMobileOpen, setIsMobileOpen }) {
  const toggleCollapse = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-stone-900/20 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen flex flex-col justify-between border-r border-[#DEE7EB] bg-[#F1F6F8] transition-all duration-200 shadow-xs ${
          isOpen ? 'w-64' : 'w-18'
        } ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Branding */}
        <div>
          <div className="flex items-center justify-between px-5 h-16 border-b border-[#DEE7EB]">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#5A7F8E] text-white shadow-xs shrink-0">
                <Compass className="w-4 h-4" />
              </div>
              
              {isOpen && (
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold tracking-tight text-stone-900 truncate">
                    NER Landslide
                  </span>
                  <span className="text-[11px] text-[#5A7F8E] font-medium tracking-wide truncate">
                    Intelligence Platform
                  </span>
                </div>
              )}
            </div>

            {/* Desktop collapse toggle */}
            <button
              onClick={toggleCollapse}
              className="hidden md:flex p-1.5 rounded-md hover:bg-[#E2EDF2] text-[#5A7F8E] hover:text-stone-900 transition-colors"
              title={isOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
            >
              {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 mt-3">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs transition-all ${
                      isActive
                        ? 'bg-[#E1EDF2] text-[#1C2930] font-semibold shadow-xs border-l-3 border-[#5A7F8E]'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-[#EAF1F4]/70'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#5A7F8E]' : 'text-[#7C9BA6] group-hover:text-[#5A7F8E]'}`} />

                      {isOpen && (
                        <div className="flex-1 min-w-0 truncate">
                          <span className="truncate block leading-tight">{item.label}</span>
                          <span className="text-[10px] text-stone-400 truncate block mt-0.5">{item.sublabel}</span>
                        </div>
                      )}

                      {/* Tooltip for collapsed mode */}
                      {!isOpen && (
                        <div className="absolute left-full ml-3 px-2.5 py-1 bg-stone-900 text-stone-100 text-xs rounded-md shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                          {item.label}
                        </div>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom System & Telemetry Card */}
        <div className="p-4 border-t border-[#DEE7EB]">
          {isOpen ? (
            <div className="p-3.5 rounded-lg bg-white border border-[#DEE7EB] shadow-xs text-xs">
              <div className="flex items-center justify-between text-stone-500 mb-1.5">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-stone-800">
                  <Activity className="w-3.5 h-3.5 text-[#84A98C]" />
                  Grid Telemetry
                </span>
                <span className="text-[10px] font-mono text-[#5A7F8E] font-medium bg-[#F0F5F8] px-1.5 py-0.5 rounded">ONLINE</span>
              </div>
              <div className="text-xs text-stone-600">
                8 NER States Ingestion Active
              </div>
              <div className="text-[11px] text-stone-400 font-mono mt-1.5 pt-1.5 border-t border-stone-100 flex items-center justify-between">
                <span>FastAPI Bridge:</span>
                <span className="text-[#5A7F8E]">Phase 1 Mock</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-2" title="Telemetry Online: 8 NER States Active">
              <div className="w-2.5 h-2.5 rounded-full bg-[#84A98C]" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
