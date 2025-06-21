import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Search, ExternalLink, Globe } from 'lucide-react';
import { checkWebsiteSecurity, SecurityCheckResult } from '../utils/webChecker';
import { addSecurityAlert, addActivityLog, getCurrentUser } from '../utils/storage';

const ScamChecker: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<SecurityCheckResult | null>(null);
  const [recentChecks, setRecentChecks] = useState<SecurityCheckResult[]>([]);

  const handleCheck = async () => {
    if (!url.trim()) {
      alert('Please enter a URL to check');
      return;
    }
    
    setIsChecking(true);
    setResult(null);
    
    try {
      const checkResult = await checkWebsiteSecurity(url);
      setResult(checkResult);
      
      // Add to recent checks
      setRecentChecks(prev => [checkResult, ...prev.slice(0, 4)]);
      
      // Log activity
      const user = getCurrentUser();
      if (user) {
        addActivityLog(user.id, 'website_check', `Checked website security: ${url}`);
        
        // Create security alert if dangerous
        if (checkResult.status === 'dangerous') {
          addSecurityAlert({
            type: 'suspicious',
            title: 'Dangerous Website Detected',
            description: `Website ${url} was flagged as dangerous with risk score ${checkResult.riskScore}%`,
            severity: 'high',
            resolved: false
          });
        }
      }
      
    } catch (error) {
      console.error('Error checking website:', error);
      alert('Error checking website. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'text-green-400 bg-green-400/20';
      case 'warning': return 'text-yellow-400 bg-yellow-400/20';
      case 'dangerous': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'safe': return <CheckCircle className="w-5 h-5" />;
      case 'warning': return <AlertTriangle className="w-5 h-5" />;
      case 'dangerous': return <Shield className="w-5 h-5" />;
      default: return <Globe className="w-5 h-5" />;
    }
  };

  return (
    <div className="p-8 bg-black min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-4">Scam Website Checker</h1>
          <p className="text-gray-400 text-lg">
            Verify website safety using blockchain-verified threat intelligence
          </p>
        </div>

        {/* URL Checker */}
        <div className="bg-gray-900 rounded-xl p-8 border border-gray-800 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Enter website URL to check (e.g., https://example.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCheck()}
                className="w-full px-4 py-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <button
              onClick={handleCheck}
              disabled={!url.trim() || isChecking}
              className="bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 px-8 py-4 rounded-lg font-semibold text-black hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isChecking ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  <span>Checking...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Check URL</span>
                </>
              )}
            </button>
          </div>
          
          {/* Quick Test Buttons */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => setUrl('https://google.com')}
              className="px-3 py-1 bg-gray-800 text-gray-300 rounded text-sm hover:bg-gray-700"
            >
              Test Safe Site
            </button>
            <button
              onClick={() => setUrl('phishing-bank.com')}
              className="px-3 py-1 bg-gray-800 text-gray-300 rounded text-sm hover:bg-gray-700"
            >
              Test Dangerous Site
            </button>
            <button
              onClick={() => setUrl('suspicious-crypto.net')}
              className="px-3 py-1 bg-gray-800 text-gray-300 rounded text-sm hover:bg-gray-700"
            >
              Test Warning Site
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-gray-900 rounded-xl p-8 border border-gray-800 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-semibold text-white mb-2">Scan Results</h3>
                <p className="text-gray-400 flex items-center space-x-2">
                  <ExternalLink className="w-4 h-4" />
                  <span>{result.url}</span>
                </p>
              </div>
              <div className={`px-4 py-2 rounded-full flex items-center space-x-2 ${getStatusColor(result.status)}`}>
                {getStatusIcon(result.status)}
                <span className="font-semibold capitalize">{result.status}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Risk Score */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Risk Score</h4>
                <div className="relative">
                  <div className="w-full bg-gray-700 rounded-full h-4">
                    <div 
                      className={`h-4 rounded-full transition-all duration-500 ${
                        result.riskScore > 70 ? 'bg-red-500' : 
                        result.riskScore > 40 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${result.riskScore}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400 mt-2">
                    <span>Safe</span>
                    <span className="font-bold text-white">{result.riskScore}/100</span>
                    <span>Dangerous</span>
                  </div>
                </div>
              </div>

              {/* Threats Detected */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Threats Detected</h4>
                {result.threats.length > 0 ? (
                  <div className="space-y-2">
                    {result.threats.map((threat, index) => (
                      <div key={index} className="flex items-center space-x-2 text-red-400">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm">{threat}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">No threats detected</span>
                  </div>
                )}
              </div>
            </div>

            {/* Security Details */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800 rounded-lg p-4">
                <h5 className="text-white font-medium mb-2">Security Details</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">SSL Certificate:</span>
                    <span className={result.details.ssl ? 'text-green-400' : 'text-red-400'}>
                      {result.details.ssl ? 'Valid' : 'Missing'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Domain Age:</span>
                    <span className="text-white">{result.details.domainAge} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Reputation:</span>
                    <span className={
                      result.details.reputation === 'good' ? 'text-green-400' :
                      result.details.reputation === 'neutral' ? 'text-yellow-400' : 'text-red-400'
                    }>
                      {result.details.reputation}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <h5 className="text-white font-medium mb-2">Recommendations</h5>
                <div className="space-y-1 text-sm text-gray-300">
                  {result.status === 'dangerous' && (
                    <>
                      <p>• Do not enter personal information</p>
                      <p>• Avoid downloading files</p>
                      <p>• Report this site if suspicious</p>
                    </>
                  )}
                  {result.status === 'warning' && (
                    <>
                      <p>• Exercise caution</p>
                      <p>• Verify site legitimacy</p>
                      <p>• Check URL carefully</p>
                    </>
                  )}
                  {result.status === 'safe' && (
                    <>
                      <p>• Site appears legitimate</p>
                      <p>• SSL certificate valid</p>
                      <p>• No known threats detected</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-400">
                Last checked: {new Date(result.lastChecked).toLocaleString()} • 
                Results verified on blockchain • 
                Report powered by threat intelligence
              </p>
            </div>
          </div>
        )}

        {/* Recent Checks */}
        {recentChecks.length > 0 && (
          <div className="bg-gray-900 rounded-xl border border-gray-800">
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-xl font-semibold text-white">Recent Security Checks</h3>
            </div>
            <div className="divide-y divide-gray-800">
              {recentChecks.map((check, index) => (
                <div key={index} className="p-6 hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(check.status)}`}>
                        {getStatusIcon(check.status)}
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{check.url}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>Risk: {check.riskScore}/100</span>
                          <span>•</span>
                          <span>{new Date(check.lastChecked).toLocaleString()}</span>
                        </div>
                        {check.threats.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {check.threats.map((threat, i) => (
                              <span key={i} className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
                                {threat}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(check.status)}`}>
                      {check.status.toUpperCase()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScamChecker;