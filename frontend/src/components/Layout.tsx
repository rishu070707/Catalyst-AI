import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Target, Users, MessageSquareText, BarChart3, Database, LayoutDashboard, Rocket, Tag, Menu, X } from 'lucide-react';

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Opportunity Center', path: '/opportunities', icon: LayoutDashboard },
    { name: 'Mission Planner', path: '/planner', icon: Target },
    { name: 'Missions', path: '/missions', icon: Rocket },
    { name: 'Segments', path: '/segments', icon: Tag },
    { name: 'Customers', path: '/customers', icon: Users },
    { name: 'Ask Catalyst', path: '/ask', icon: MessageSquareText },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
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
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-surface-bg border-r border-border-default flex flex-col transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-border-default">
          <h1 className="text-xl font-bold text-primary-blue tracking-tight">CATALYST</h1>
          <button className="md:hidden text-gray-500 hover:text-gray-900" onClick={() => setIsMobileMenuOpen(false)}>
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
                `flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#EFF6FF] text-primary-blue'
                    : 'text-text-primary hover:bg-surface-secondary'
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
        <header className="h-16 bg-surface-bg border-b border-border-default shadow-sm flex items-center px-4 md:px-8 shrink-0">
          <button 
            className="md:hidden text-gray-500 hover:text-gray-900 p-2 -ml-2 rounded-lg hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
        </header>
        <div className="flex-1 p-4 md:p-8 overflow-y-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
