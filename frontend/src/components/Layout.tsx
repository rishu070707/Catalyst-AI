import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Target, Users, MessageSquareText, BarChart3, LayoutDashboard, Rocket, Tag, Menu, X } from 'lucide-react';

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Opportunity Center', path: '/app/opportunities', icon: LayoutDashboard },
    { name: 'Mission Planner', path: '/app/planner', icon: Target },
    { name: 'Missions', path: '/app/missions', icon: Rocket },
    { name: 'Segments', path: '/app/segments', icon: Tag },
    { name: 'Customers', path: '/app/customers', icon: Users },
    { name: 'Ask Catalyst', path: '/app/ask', icon: MessageSquareText },
    { name: 'Analytics', path: '/app/analytics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen flex bg-surface-secondary overflow-hidden">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-border-default shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex flex-col transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-border-default">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-primary-blue to-primary-violet rounded-lg flex items-center justify-center shadow-glow">
              <Rocket size={14} className="text-white" />
            </div>
            <h1 className="text-xl font-display font-bold text-text-primary tracking-tight">CATALYST</h1>
          </div>
          <button className="md:hidden text-text-secondary hover:text-text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-blue/10 text-primary-blue font-semibold'
                    : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary font-medium'
                }`
              }
            >
              <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col w-full min-w-0">
        <header className="h-16 glass z-30 border-b border-border-default sticky top-0 flex items-center px-4 md:px-8 shrink-0">
          <button 
            className="md:hidden text-text-secondary hover:text-text-primary p-2 -ml-2 rounded-lg hover:bg-surface-secondary transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
          <span className="md:hidden ml-2 text-lg font-display font-bold text-text-primary tracking-tight">CATALYST</span>
        </header>
        <div className="flex-1 p-4 md:p-8 overflow-y-auto w-full page-enter">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
