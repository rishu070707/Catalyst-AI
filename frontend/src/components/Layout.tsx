import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Target, Users, MessageSquareText, BarChart3, Database, LayoutDashboard, Rocket, Tag } from 'lucide-react';

const Layout = () => {
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
    <div className="min-h-screen flex bg-surface-secondary">
      {/* Sidebar */}
      <aside className="w-64 bg-surface-bg border-r border-border-default flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-border-default">
          <h1 className="text-xl font-bold text-primary-blue tracking-tight">CATALYST</h1>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
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
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-surface-bg border-b border-border-default shadow-sm"></header>
        <div className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
