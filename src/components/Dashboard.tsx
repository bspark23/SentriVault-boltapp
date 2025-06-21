import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  FileText, 
  AlertTriangle, 
  Activity,
  TrendingUp,
  Users,
  Globe,
  Lock,
  Plus
} from 'lucide-react';
import StatsCard from './StatsCard';
import LineChart from './charts/LineChart';
import PieChart from './charts/PieChart';
import BarChart from './charts/BarChart';
import { getCurrentUser, getUserStats, getUserActivityLogs } from '../utils/storage';

interface DashboardProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ isDarkMode, toggleTheme }) => {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    try {
      const currentUser = getCurrentUser();
      const userStats = getUserStats();
      const activities = getUserActivityLogs();
      
      setUser(currentUser);
      setStats(userStats);
      setRecentActivities(activities.slice(0, 5));
      setLoading(false);
    } catch (error) {
      console.error('Error loading user data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 bg-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-700 border-t-green-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !stats) {
    return (
      <div className="p-8 bg-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-white">Error loading dashboard data</p>
          <button 
            onClick={loadUserData}
            className="mt-4 bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 px-6 py-3 rounded-lg font-semibold text-black hover:shadow-lg transition-all duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const isNewUser = stats.totalVaultItems === 0 && recentActivities.length <= 1;

  const statsData = [
    {
      title: 'Total Vault Items',
      value: stats.totalVaultItems.toString(),
      change: stats.totalVaultItems > 0 ? '+' + stats.totalVaultItems : '0',
      trend: 'up' as const,
      icon: Shield,
      color: 'from-yellow-400 to-yellow-600'
    },
    {
      title: 'Files Secured',
      value: '0', // Will be implemented with file vault
      change: '0',
      trend: 'up' as const,
      icon: FileText,
      color: 'from-green-400 to-green-600'
    },
    {
      title: 'Security Alerts',
      value: stats.unreadAlerts.toString(),
      change: stats.unreadAlerts > 0 ? '+' + stats.unreadAlerts : '0',
      trend: stats.unreadAlerts > 0 ? 'up' : 'down',
      icon: AlertTriangle,
      color: 'from-red-400 to-red-600'
    },
    {
      title: 'Active Sessions',
      value: '1',
      change: '+1',
      trend: 'up' as const,
      icon: Activity,
      color: 'from-cyan-400 to-cyan-600'
    }
  ];

  return (
    <div className="p-8 bg-black min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-gray-400">
            {isNewUser 
              ? "Let's get started with securing your digital life" 
              : "Monitor your digital security and privacy"
            }
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-white"
          >
            {isDarkMode ? '🌙' : '☀️'} {isDarkMode ? 'Dark' : 'Light'}
          </button>
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 rounded-full flex items-center justify-center">
            <span className="text-black font-bold text-sm">
              {user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* New User Welcome */}
      {isNewUser && (
        <div className="bg-gradient-to-r from-yellow-400/10 via-green-400/10 to-red-400/10 border border-cyan-400/30 rounded-xl p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-black" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white mb-2">Welcome to SentriVault!</h3>
              <p className="text-gray-400 mb-4">
                Start securing your digital life by adding your first vault item or checking a website for security threats.
              </p>
              <div className="flex space-x-4">
                <button 
                  onClick={() => window.location.href = '/vault'}
                  className="bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 px-4 py-2 rounded-lg font-semibold text-black hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add First Vault Item</span>
                </button>
                <button 
                  onClick={() => window.location.href = '/scam-checker'}
                  className="border border-gray-600 px-4 py-2 rounded-lg text-white hover:border-cyan-400 transition-colors"
                >
                  Check Website Security
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Line Chart */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 className="text-xl font-semibold text-white mb-4">Security Activity</h3>
          {isNewUser ? (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <Activity className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No activity data yet</p>
                <p className="text-gray-500 text-sm">Start using SentriVault to see your security trends</p>
              </div>
            </div>
          ) : (
            <LineChart />
          )}
        </div>

        {/* Pie Chart */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 className="text-xl font-semibold text-white mb-4">Vault Categories</h3>
          {stats.totalVaultItems === 0 ? (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No vault items yet</p>
                <p className="text-gray-500 text-sm">Add passwords, notes, or keys to see the breakdown</p>
              </div>
            </div>
          ) : (
            <PieChart />
          )}
        </div>
      </div>

      {/* Bar Chart and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 className="text-xl font-semibold text-white mb-4">Monthly Activity</h3>
          {isNewUser ? (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No monthly data yet</p>
                <p className="text-gray-500 text-sm">Use SentriVault features to generate activity data</p>
              </div>
            </div>
          ) : (
            <BarChart />
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Lock className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white">{activity.details}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No recent activity</p>
                <p className="text-gray-500 text-xs">Your actions will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions for New Users */}
      {isNewUser && (
        <div className="mt-8 bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 className="text-xl font-semibold text-white mb-4">Quick Start Guide</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors" onClick={() => window.location.href = '/vault'}>
              <Shield className="w-8 h-8 text-yellow-400 mb-3" />
              <h4 className="text-white font-medium mb-2">Secure Your Passwords</h4>
              <p className="text-gray-400 text-sm mb-3">Store your passwords securely in the vault</p>
              <button className="text-cyan-400 hover:text-cyan-300 text-sm">Get Started →</button>
            </div>
            <div className="p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors" onClick={() => window.location.href = '/scam-checker'}>
              <AlertTriangle className="w-8 h-8 text-red-400 mb-3" />
              <h4 className="text-white font-medium mb-2">Check Website Safety</h4>
              <p className="text-gray-400 text-sm mb-3">Verify if websites are safe to visit</p>
              <button className="text-cyan-400 hover:text-cyan-300 text-sm">Try Now →</button>
            </div>
            <div className="p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors" onClick={() => window.location.href = '/resume'}>
              <FileText className="w-8 h-8 text-green-400 mb-3" />
              <h4 className="text-white font-medium mb-2">Verify Your Resume</h4>
              <p className="text-gray-400 text-sm mb-3">Create blockchain-backed CV verification</p>
              <button className="text-cyan-400 hover:text-cyan-300 text-sm">Upload →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;