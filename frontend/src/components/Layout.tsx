import { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Target, Users, MessageSquareText, BarChart3, LayoutDashboard, Rocket, Tag, Menu, X } from 'lucide-react';

const navItems = [
  { name: 'Opportunities', path: '/opportunities', icon: LayoutDashboard },
  { name: 'Mission Planner', path: '/planner', icon: Target },
  { name: 'Missions', path: '/missions', icon: Rocket },
  { name: 'Segments', path: '/segments', icon: Tag },
  { name: 'Customers', path: '/customers', icon: Users },
  { name: 'Ask Catalyst', path: '/ask', icon: MessageSquareText },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
];

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  return (
    <div className="min-h-screen flex bg-surface-secondary">

      {/* Mobile backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar — slide-in on mobile, always visible on desktop */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-surface-bg border-r border-border-default flex flex-col
        transform transition-transform duration-300 ease-in-out
        md:static md:translate-x-0 md:shrink-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-14 md:h-16 flex items-center justify-between px-5 border-b border-border-default">
          <h1 className="text-xl font-bold text-primary-blue tracking-tight">CATALYST</h1>
          <button
            className="md:hidden text-gray-400 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-primary-blue'
                    : 'text-text-primary hover:bg-surface-secondary'
                }`
              }
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 w-full">
        {/* Top bar (mobile only) */}
        <header className="h-14 bg-surface-bg border-b border-border-default flex items-center px-4 shrink-0 md:hidden">
          <button
            className="text-gray-500 hover:text-gray-900 p-2 -ml-2 rounded-lg hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <span className="ml-2 text-lg font-bold text-primary-blue">CATALYST</span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
