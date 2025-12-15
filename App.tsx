import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { DailyView } from './components/DailyView';
import { WeeklyView } from './components/WeeklyView';
import { QuarterlyView } from './components/QuarterlyView';
import { PenLine, BarChart2, BookOpen } from 'lucide-react';

const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
        isActive ? 'text-stone-800' : 'text-stone-400 hover:text-stone-500'
      }`
    }
  >
    <Icon size={24} strokeWidth={2} />
    <span className="text-[10px] font-medium tracking-wide">{label}</span>
  </NavLink>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-[#fafaf9] text-stone-800 font-sans selection:bg-stone-200">
        <main className="max-w-md mx-auto min-h-screen relative shadow-2xl shadow-stone-200 bg-[#fafaf9]">
          
          <div className="p-6 pt-8">
            <Routes>
              <Route path="/" element={<DailyView />} />
              <Route path="/weekly" element={<WeeklyView />} />
              <Route path="/quarterly" element={<QuarterlyView />} />
            </Routes>
          </div>

          {/* Sticky Bottom Nav */}
          <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-stone-100 pb-safe">
             <div className="max-w-md mx-auto h-16 flex justify-around items-center">
                <NavItem to="/" icon={PenLine} label="今日" />
                <NavItem to="/weekly" icon={BarChart2} label="趨勢" />
                <NavItem to="/quarterly" icon={BookOpen} label="回顧" />
             </div>
          </nav>

        </main>
      </div>
    </HashRouter>
  );
};

export default App;