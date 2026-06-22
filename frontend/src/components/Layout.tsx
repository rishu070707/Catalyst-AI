import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Target, Users, MessageSquareText, BarChart3, LayoutDashboard, Rocket, Tag, Menu, X } from 'lucide-react';

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Opportunity Center', path: '/app/opportunities', icon: LayoutDashboard },
    { name: 'Mission Planner',    path: '/app/planner',       icon: Target },
    { name: 'Missions',           path: '/app/missions',       icon: Rocket },
    { name: 'Segments',           path: '/app/segments',       icon: Tag },
    { name: 'Customers',          path: '/app/customers',      icon: Users },
    { name: 'Ask Catalyst',       path: '/app/ask',            icon: MessageSquareText },
    { name: 'Analytics',          path: '/app/analytics',      icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen flex bg-surface-secondary overflow-hidden">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-brand-900/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r-2 border-brand-100 flex flex-col transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ boxShadow: '4px 0 24px rgba(37, 99, 235, 0.06)' }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b-2 border-brand-100">
          <div className="flex items-center gap-2">
            <span className="text-xl font-display font-bold text-brand-900 tracking-tight">CATALYST</span>
          </div>
          <button
            className="md:hidden text-text-secondary hover:text-brand-700 transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 py-5 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center px-3.5 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 font-semibold border border-brand-200 shadow-soft'
                    : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary font-medium'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-4.5 h-4.5 mr-3 flex-shrink-0 ${isActive ? 'text-brand-600' : 'text-text-muted'}`} size={18} />
                  {item.name}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t-2 border-brand-100">
          <div className="bg-brand-50 rounded-xl p-4 border border-brand-100">
            <p className="text-xs font-bold text-brand-700 mb-1">AI Credits</p>
            <div className="w-full bg-brand-100 rounded-full h-1.5 mb-2">
              <div className="bg-gradient-to-r from-brand-500 to-brand-700 h-1.5 rounded-full w-3/4" />
            </div>
            <p className="text-xs text-text-secondary">75 / 100 missions used</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col w-full min-w-0">
        {/* Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b-2 border-brand-100 sticky top-0 z-30 flex items-center justify-between px-4 md:px-8 shrink-0"
          style={{ boxShadow: '0 2px 12px rgba(37, 99, 235, 0.06)' }}
        >
          <div className="flex items-center gap-3">
            <button
              className="md:hidden text-text-secondary hover:text-brand-700 p-2 -ml-2 rounded-xl hover:bg-brand-50 transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={22} />
            </button>
            <span className="md:hidden text-lg font-display font-bold text-brand-900 tracking-tight">CATALYST</span>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-medium text-text-secondary bg-surface-secondary border border-border-default rounded-lg px-3 py-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Live · All systems operational
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto w-full page-enter">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
