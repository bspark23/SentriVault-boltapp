import React, { useState, useEffect } from 'react';
import { AlertTriangle, Shield, Bell, CheckCircle, X, Eye, Clock, MapPin } from 'lucide-react';
import { getUserSecurityAlerts, resolveSecurityAlert, SecurityAlert } from '../utils/storage';

const SecurityAlerts: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = () => {
    const userAlerts = getUserSecurityAlerts();
    setAlerts(userAlerts);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-blue-400 bg-blue-400/20 border-blue-400/30';
      case 'medium': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
      case 'high': return 'text-orange-400 bg-orange-400/20 border-orange-400/30';
      case 'critical': return 'text-red-400 bg-red-400/20 border-red-400/30';
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'breach': return <Shield className="w-5 h-5" />;
      case 'login': return <MapPin className="w-5 h-5" />;
      case 'password': return <Eye className="w-5 h-5" />;
      case 'suspicious': return <AlertTriangle className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const handleResolveAlert = (id: string) => {
    resolveSecurityAlert(id);
    loadAlerts();
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    if (filter === 'unresolved') return !alert.resolved;
    if (filter === 'resolved') return alert.resolved;
    return alert.severity === filter;
  });

  const alertStats = {
    total: alerts.length,
    unresolved: alerts.filter(a => !a.resolved).length,
    critical: alerts.filter(a => a.severity === 'critical').length,
    resolved: alerts.filter(a => a.resolved).length
  };

  return (
    <div className="p-8 bg-black min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Security Alerts</h1>
          <p className="text-gray-400">Monitor and respond to security threats and breaches</p>
        </div>

        {/* Alert Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{alertStats.total}</h3>
                <p className="text-gray-400 text-sm">Total Alerts</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-red-600 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{alertStats.unresolved}</h3>
                <p className="text-gray-400 text-sm">Unresolved</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{alertStats.critical}</h3>
                <p className="text-gray-400 text-sm">Critical</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{alertStats.resolved}</h3>
                <p className="text-gray-400 text-sm">Resolved</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 mb-8">
          <div className="p-6 border-b border-gray-800">
            <div className="flex flex-wrap gap-2">
              {['all', 'unresolved', 'resolved', 'critical', 'high', 'medium', 'low'].map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => setFilter(filterOption)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === filterOption
                      ? 'bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 text-black'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Alerts List */}
          <div className="divide-y divide-gray-800">
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((alert) => (
                <div key={alert.id} className={`p-6 hover:bg-gray-800/50 transition-colors ${
                  alert.resolved ? 'opacity-60' : ''
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        alert.resolved ? 'bg-green-500/20' : getSeverityColor(alert.severity)
                      }`}>
                        {alert.resolved ? <CheckCircle className="w-5 h-5 text-green-400" /> : getTypeIcon(alert.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-white font-semibold">{alert.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(alert.severity)}`}>
                            {alert.severity.toUpperCase()}
                          </span>
                          {alert.resolved && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-400/30">
                              RESOLVED
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 mb-3">{alert.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(alert.timestamp).toLocaleString()}</span>
                          </div>
                          {alert.location && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{alert.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!alert.resolved && (
                        <button
                          onClick={() => handleResolveAlert(alert.id)}
                          className="bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 px-4 py-2 rounded-lg font-semibold text-black hover:shadow-lg transition-all duration-200 text-sm"
                        >
                          Mark Resolved
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  {alerts.length === 0 ? 'No security alerts' : 'No alerts found'}
                </h3>
                <p className="text-gray-500">
                  {alerts.length === 0 
                    ? 'Great! You have no security alerts at this time.' 
                    : 'No security alerts match your current filter'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityAlerts;