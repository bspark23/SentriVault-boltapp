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
  Plus,
  MapPin,
  Download,
  Eye
} from 'lucide-react';
import StatsCard from './StatsCard';
import LineChart from './charts/LineChart';
import PieChart from './charts/PieChart';
import BarChart from './charts/BarChart';
import { getCurrentUser, getUserStats, getUserActivityLogs } from '../utils/storage';

interface EnhancedDashboardProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const EnhancedDashboard: React.FC<EnhancedDashboardProps> = ({ isDarkMode, toggleTheme }) => {
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
          <p className="text-white">Loading enhanced dashboard...</p>
        </div>
      </div>
    );
  }

  const statsData = [
    {
      title: 'Total Security Score',
      value: '94%',
      change: '+2%',
      trend: 'up' as const,
      icon: Shield,
      color: 'from-green-400 to-green-600'
    },
    {
      title: 'Files Protected',
      value: '127',
      change: '+12',
      trend: 'up' as const,
      icon: FileText,
      color: 'from-blue-400 to-blue-600'
    },
    {
      title: 'Threats Blocked',
      value: '8',
      change: '+3',
      trend: 'up' as const,
      icon: AlertTriangle,
      color: 'from-red-400 to-red-600'
    },
    {
      title: 'Active Monitoring',
      value: '24/7',
      change: '100%',
      trend: 'up' as const,
      icon: Activity,
      color: 'from-purple-400 to-purple-600'
    }
  ];

  return (
    <div className="p-8 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 bg-clip-text text-transparent mb-2">
              Enhanced Security Dashboard
            </h1>
            <p className="text-gray-400 text-lg">
              Real-time monitoring and advanced threat protection
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 px-6 py-3 rounded-lg font-semibold text-black hover:shadow-lg transition-all duration-200 flex items-center space-x-2">
              <Download className="w-5 h-5" />
              <span>Export Report</span>
            </button>
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-lg">
                {user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Real-time Security Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-xl font-semibold text-white mb-4">Security Trends</h3>
            <LineChart />
          </div>
          
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-xl font-semibold text-white mb-4">Threat Distribution</h3>
            <PieChart />
          </div>
        </div>

        {/* Activity Monitoring */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-xl font-semibold text-white mb-4">Global Activity Map</h3>
            <div className="h-64 bg-gray-800 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-30">
                <svg viewBox="0 0 400 200" className="w-full h-full">
                  <defs>
                    <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#22d3ee" />
                      <stop offset="50%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#f59e0b" />
                    </linearGradient>
                  </defs>
                  <path d="M50,100 Q100,80 150,100 T250,100 Q300,90 350,100" 
                        stroke="url(#mapGradient)" strokeWidth="2" fill="none" />
                  <circle cx="100" cy="100" r="3" fill="#10b981" className="animate-pulse" />
                  <circle cx="200" cy="90" r="3" fill="#f59e0b" className="animate-pulse" />
                  <circle cx="300" cy="110" r="3" fill="#22d3ee" className="animate-pulse" />
                </svg>
              </div>
              <div className="text-center z-10">
                <MapPin className="w-12 h-12 text-cyan-400 mx-auto mb-2" />
                <p className="text-white font-medium">3 Active Locations</p>
                <p className="text-gray-400 text-sm">Last login: New York, USA</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-xl font-semibold text-white mb-4">Recent Security Events</h3>
            <div className="space-y-4">
              {[
                { type: 'success', message: 'Vault accessed securely', time: '2 min ago' },
                { type: 'warning', message: 'New device login detected', time: '1 hour ago' },
                { type: 'info', message: 'Resume verified on blockchain', time: '3 hours ago' },
                { type: 'success', message: 'Password strength updated', time: '1 day ago' }
              ].map((event, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg">
                  <div className={`w-3 h-3 rounded-full ${
                    event.type === 'success' ? 'bg-green-400' :
                    event.type === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">{event.message}</p>
                    <p className="text-gray-400 text-xs">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Advanced Analytics */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 className="text-xl font-semibold text-white mb-4">Advanced Analytics</h3>
          <BarChart />
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;