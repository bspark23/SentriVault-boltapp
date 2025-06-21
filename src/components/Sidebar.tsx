import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Vault, 
  FileText, 
  Shield, 
  Mail, 
  AlertTriangle, 
  Bell, 
  Map, 
  Settings, 
  HelpCircle, 
  LogOut,
  Lock
} from 'lucide-react';
import { logoutUser } from '../utils/storage';

interface SidebarProps {
  isDarkMode: boolean;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isDarkMode, onLogout }) => {
  const location = useLocation();

  const handleLogout = () => {
    logoutUser();
    localStorage.removeItem('sentrivault_current_user');
    onLogout();
  };

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/vault', icon: Vault, label: 'Vault Manager' },
    { path: '/files', icon: FileText, label: 'File Vault' },
    { path: '/resume', icon: Shield, label: 'Resume Verifier' },
    { path: '/privacy', icon: Mail, label: 'Privacy Requests' },
    { path: '/scam-checker', icon: AlertTriangle, label: 'Scam Website Checker' },
    { path: '/alerts', icon: Bell, label: 'Security Alerts' },
    { path: '/map', icon: Map, label: 'Activity Map' },
    { path: '/settings', icon: Settings, label: 'Settings' },
    { path: '/help', icon: HelpCircle, label: 'Help' },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-gray-900 border-r border-gray-800 z-50">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 rounded-lg flex items-center justify-center">
            <Lock className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 bg-clip-text text-transparent">
              SentriVault
            </h1>
            <p className="text-xs text-gray-400">Security Dashboard</p>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-yellow-400/20 via-green-400/20 to-red-400/20 border border-cyan-400/30 text-cyan-400'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 w-full text-gray-300 hover:bg-gray-800 hover:text-red-400 rounded-lg transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;