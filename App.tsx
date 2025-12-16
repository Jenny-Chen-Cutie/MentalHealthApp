import React, { useEffect, useState, createContext, useContext } from 'react';
import { DailyView } from './components/DailyView';
import { WeeklyView } from './components/WeeklyView';
import { QuarterlyView } from './components/QuarterlyView';
import { PenLine, BarChart2, BookOpen } from 'lucide-react';

// --- Minimal Hash Router Implementation ---
const RouterContext = createContext<{ path: string }>({ path: '/' });

const useLocation = () => {
  const context = useContext(RouterContext);
  return { pathname: context.path };
};

const HashRouter = ({ children }: { children: React.ReactNode }) => {
  const [path, setPath] = useState(() => window.location.hash.slice(1) || '/');

  useEffect(() => {
    const handleHashChange = () => {
      const current = window.location.hash.slice(1) || '/';
      setPath(current);
    };
    window.addEventListener('hashchange', handleHashChange);
    // Ensure we start with a hash if none exists
    if (!window.location.hash) window.location.hash = '#/';
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <RouterContext.Provider value={{ path }}>
      {children}
    </RouterContext.Provider>
  );
};

const Routes = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const Route = ({ path, element }: { path: string; element: React.ReactNode }) => {
  const { path: currentPath } = useContext(RouterContext);
  return currentPath === path ? <>{element}</> : null;
};

const NavLink = ({
  to,
  className,
  children,
}: {
  to: string;
  className: string | ((props: { isActive: boolean }) => string);
  children: React.ReactNode;
}) => {
  const { path } = useContext(RouterContext);
  const isActive = path === to;
  const resolvedClassName = typeof className === 'function' ? className({ isActive }) : className;
  return (
    <a href={`#${to}`} className={resolvedClassName}>
      {children}
    </a>
  );
};
// ------------------------------------------------------------------

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