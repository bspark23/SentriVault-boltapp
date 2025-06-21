import React, { useEffect, useState } from 'react';
import { MapPin, Globe, Shield, AlertTriangle } from 'lucide-react';
import { getUserActivityLogs, getCurrentUser } from '../utils/storage';

const ActivityMap: React.FC = () => {
  const [loginActivities, setLoginActivities] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadActivityData();
  }, []);

  const loadActivityData = () => {
    const currentUser = getCurrentUser();
    const activities = getUserActivityLogs();
    
    setUser(currentUser);
    
    // Convert activity logs to login activities
    const loginLogs = activities
      .filter(log => log.action === 'login' || log.action === 'account_created')
      .slice(0, 5)
      .map((log, index) => ({
        id: log.id,
        location: getRandomLocation(),
        ip: log.ipAddress || '192.168.1.1',
        time: getTimeAgo(log.timestamp),
        device: getRandomDevice(),
        status: 'success'
      }));
    
    setLoginActivities(loginLogs);
  };

  const getRandomLocation = () => {
    const locations = [
      'New York, USA',
      'London, UK', 
      'Tokyo, Japan',
      'Lagos, Nigeria',
      'Berlin, Germany',
      'Sydney, Australia'
    ];
    return locations[Math.floor(Math.random() * locations.length)];
  };

  const getRandomDevice = () => {
    const devices = [
      'Chrome on Windows',
      'Safari on iPhone',
      'Firefox on Linux',
      'Edge on Windows',
      'Chrome on Android'
    ];
    return devices[Math.floor(Math.random() * devices.length)];
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    }
  };

  return (
    <div className="p-8 bg-black min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Activity Map</h1>
          <p className="text-gray-400">Track login locations and security events worldwide</p>
        </div>

        {/* Interactive World Map */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 mb-8">
          <div className="p-6 border-b border-gray-800">
            <h3 className="text-xl font-semibold text-white">Global Login Activity</h3>
          </div>
          <div className="h-96 bg-gray-800 rounded-b-xl flex items-center justify-center relative overflow-hidden">
            {/* World Map SVG */}
            <div className="absolute inset-0 opacity-30">
              <svg viewBox="0 0 1000 500" className="w-full h-full">
                <defs>
                  <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="50%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
                {/* Simplified world map paths */}
                <path d="M100,200 Q200,150 300,200 T500,200 Q600,180 700,200 T900,200" 
                      stroke="url(#mapGradient)" strokeWidth="2" fill="none" />
                <path d="M150,250 Q250,220 350,250 T550,250 Q650,230 750,250 T950,250" 
                      stroke="url(#mapGradient)" strokeWidth="2" fill="none" />
                <path d="M200,300 Q300,270 400,300 T600,300 Q700,280 800,300 T1000,300" 
                      stroke="url(#mapGradient)" strokeWidth="2" fill="none" />
                
                {/* Continents outline */}
                <circle cx="200" cy="200" r="80" fill="none" stroke="url(#mapGradient)" strokeWidth="1" opacity="0.5" />
                <circle cx="500" cy="180" r="60" fill="none" stroke="url(#mapGradient)" strokeWidth="1" opacity="0.5" />
                <circle cx="750" cy="220" r="70" fill="none" stroke="url(#mapGradient)" strokeWidth="1" opacity="0.5" />
              </svg>
            </div>
            
            {/* Activity Pins */}
            <div className="absolute top-1/4 left-1/4 animate-pulse">
              <div className="w-4 h-4 bg-green-400 rounded-full shadow-lg shadow-green-400/50 relative">
                <div className="absolute inset-0 bg-green-400 rounded-full animate-ping"></div>
              </div>
            </div>
            <div className="absolute top-1/3 right-1/3 animate-pulse">
              <div className="w-4 h-4 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50 relative">
                <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping"></div>
              </div>
            </div>
            <div className="absolute bottom-1/3 right-1/4 animate-pulse">
              <div className="w-4 h-4 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50 relative">
                <div className="absolute inset-0 bg-cyan-400 rounded-full animate-ping"></div>
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 animate-pulse">
              <div className="w-4 h-4 bg-red-400 rounded-full shadow-lg shadow-red-400/50 relative">
                <div className="absolute inset-0 bg-red-400 rounded-full animate-ping"></div>
              </div>
            </div>

            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 bg-gray-900/80 backdrop-blur-sm rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">Activity Legend</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">Successful Login</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span className="text-gray-300">Suspicious Activity</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <span className="text-gray-300">Failed Login</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Logins */}
          <div className="bg-gray-900 rounded-xl border border-gray-800">
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-xl font-semibold text-white">Recent Login Activity</h3>
            </div>
            <div className="divide-y divide-gray-800">
              {loginActivities.length > 0 ? (
                loginActivities.map((activity) => (
                  <div key={activity.id} className="p-6 hover:bg-gray-800/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          activity.status === 'success' ? 'bg-green-500/20' : 'bg-yellow-500/20'
                        }`}>
                          <MapPin className={`w-5 h-5 ${
                            activity.status === 'success' ? 'text-green-400' : 'text-yellow-400'
                          }`} />
                        </div>
                        <div>
                          <h4 className="text-white font-medium">{activity.location}</h4>
                          <p className="text-gray-400 text-sm">{activity.ip}</p>
                          <p className="text-gray-500 text-xs">{activity.device}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400 text-sm">{activity.time}</p>
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                          activity.status === 'success' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {activity.status === 'success' ? 'Verified' : 'Review'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <MapPin className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">No login activity</h3>
                  <p className="text-gray-500">Your login history will appear here</p>
                </div>
              )}
            </div>
          </div>

          {/* Security Stats */}
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="text-xl font-semibold text-white mb-4">Security Overview</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-green-400" />
                    <span className="text-white">Trusted Locations</span>
                  </div>
                  <span className="text-green-400 font-semibold">{Math.min(loginActivities.length, 5)}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    <span className="text-white">Suspicious Activity</span>
                  </div>
                  <span className="text-yellow-400 font-semibold">0</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-cyan-400" />
                    <span className="text-white">Countries Accessed</span>
                  </div>
                  <span className="text-cyan-400 font-semibold">{new Set(loginActivities.map(a => a.location.split(',')[1]?.trim())).size}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 px-4 py-3 rounded-lg font-semibold text-black hover:shadow-lg transition-all duration-200">
                  Add Trusted Location
                </button>
                <button className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors">
                  Export Activity Log
                </button>
                <button 
                  onClick={() => window.location.href = '/settings'}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Security Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityMap;