import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import VaultManager from './components/VaultManager';
import FileVault from './components/FileVault';
import ResumeVerifier from './components/ResumeVerifier';
import PrivacyRequests from './components/PrivacyRequests';
import ScamChecker from './components/ScamChecker';
import SecurityAlerts from './components/SecurityAlerts';
import ActivityMap from './components/ActivityMap';
import Settings from './components/Settings';
import Help from './components/Help';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className={`${isDarkMode ? 'dark' : ''} min-h-screen`}>
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/landing" 
            element={
              !isAuthenticated ? (
                <LandingPage />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            } 
          />
          <Route 
            path="/auth" 
            element={
              !isAuthenticated ? (
                <AuthPage onLogin={handleLogin} />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            } 
          />
          
          {/* Protected Routes */}
          {isAuthenticated ? (
            <>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route 
                path="/dashboard" 
                element={
                  <div className="flex bg-black dark:bg-black text-white">
                    <Sidebar isDarkMode={isDarkMode} onLogout={handleLogout} />
                    <div className="flex-1 ml-64">
                      <Dashboard isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                    </div>
                  </div>
                } 
              />
              <Route 
                path="/vault" 
                element={
                  <div className="flex bg-black dark:bg-black text-white">
                    <Sidebar isDarkMode={isDarkMode} onLogout={handleLogout} />
                    <div className="flex-1 ml-64">
                      <VaultManager />
                    </div>
                  </div>
                } 
              />
              <Route 
                path="/files" 
                element={
                  <div className="flex bg-black dark:bg-black text-white">
                    <Sidebar isDarkMode={isDarkMode} onLogout={handleLogout} />
                    <div className="flex-1 ml-64">
                      <FileVault />
                    </div>
                  </div>
                } 
              />
              <Route 
                path="/resume" 
                element={
                  <div className="flex bg-black dark:bg-black text-white">
                    <Sidebar isDarkMode={isDarkMode} onLogout={handleLogout} />
                    <div className="flex-1 ml-64">
                      <ResumeVerifier />
                    </div>
                  </div>
                } 
              />
              <Route 
                path="/privacy" 
                element={
                  <div className="flex bg-black dark:bg-black text-white">
                    <Sidebar isDarkMode={isDarkMode} onLogout={handleLogout} />
                    <div className="flex-1 ml-64">
                      <PrivacyRequests />
                    </div>
                  </div>
                } 
              />
              <Route 
                path="/scam-checker" 
                element={
                  <div className="flex bg-black dark:bg-black text-white">
                    <Sidebar isDarkMode={isDarkMode} onLogout={handleLogout} />
                    <div className="flex-1 ml-64">
                      <ScamChecker />
                    </div>
                  </div>
                } 
              />
              <Route 
                path="/alerts" 
                element={
                  <div className="flex bg-black dark:bg-black text-white">
                    <Sidebar isDarkMode={isDarkMode} onLogout={handleLogout} />
                    <div className="flex-1 ml-64">
                      <SecurityAlerts />
                    </div>
                  </div>
                } 
              />
              <Route 
                path="/map" 
                element={
                  <div className="flex bg-black dark:bg-black text-white">
                    <Sidebar isDarkMode={isDarkMode} onLogout={handleLogout} />
                    <div className="flex-1 ml-64">
                      <ActivityMap />
                    </div>
                  </div>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <div className="flex bg-black dark:bg-black text-white">
                    <Sidebar isDarkMode={isDarkMode} onLogout={handleLogout} />
                    <div className="flex-1 ml-64">
                      <Settings isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                    </div>
                  </div>
                } 
              />
              <Route 
                path="/help" 
                element={
                  <div className="flex bg-black dark:bg-black text-white">
                    <Sidebar isDarkMode={isDarkMode} onLogout={handleLogout} />
                    <div className="flex-1 ml-64">
                      <Help />
                    </div>
                  </div>
                } 
              />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/landing" replace />} />
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;