import React, { useState } from 'react';
import { RefreshCw, Copy, Check, Eye, EyeOff, Settings, Zap } from 'lucide-react';
import { addVaultItem } from '../utils/storage';

interface PasswordGeneratorProps {
  onClose?: () => void;
  onSave?: (password: string) => void;
}

const PasswordGenerator: React.FC<PasswordGeneratorProps> = ({ onClose, onSave }) => {
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [settings, setSettings] = useState({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: true,
    wordBased: false,
    wordCount: 3
  });

  const generateRandomPassword = () => {
    let charset = '';
    if (settings.includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (settings.includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (settings.includeNumbers) charset += '0123456789';
    if (settings.includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    if (settings.excludeSimilar) {
      charset = charset.replace(/[0O1lI]/g, '');
    }

    let result = '';
    for (let i = 0; i < settings.length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return result;
  };

  const generateWordBasedPassword = () => {
    const words = [
      'Ocean', 'Mountain', 'River', 'Forest', 'Desert', 'Valley', 'Storm', 'Thunder',
      'Lightning', 'Rainbow', 'Sunset', 'Sunrise', 'Galaxy', 'Planet', 'Star', 'Moon',
      'Phoenix', 'Dragon', 'Eagle', 'Wolf', 'Tiger', 'Lion', 'Bear', 'Falcon',
      'Crystal', 'Diamond', 'Gold', 'Silver', 'Platinum', 'Ruby', 'Emerald', 'Sapphire'
    ];
    
    const separators = ['$', '@', '#', '&', '*', '!', '+', '='];
    const numbers = Math.floor(Math.random() * 999) + 1;
    
    let result = '';
    for (let i = 0; i < settings.wordCount; i++) {
      const word = words[Math.floor(Math.random() * words.length)];
      result += word;
      if (i < settings.wordCount - 1) {
        result += separators[Math.floor(Math.random() * separators.length)];
      }
    }
    result += numbers;
    return result;
  };

  const generatePassword = () => {
    const newPassword = settings.wordBased ? generateWordBasedPassword() : generateRandomPassword();
    setPassword(newPassword);
    setCopied(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy password:', err);
    }
  };

  const getPasswordStrength = () => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    if (score <= 2) return { label: 'Weak', color: 'bg-red-500', width: '25%' };
    if (score <= 4) return { label: 'Medium', color: 'bg-yellow-500', width: '50%' };
    if (score <= 5) return { label: 'Strong', color: 'bg-green-500', width: '75%' };
    return { label: 'Very Strong', color: 'bg-green-600', width: '100%' };
  };

  const saveToVault = () => {
    try {
      addVaultItem({
        type: 'password',
        title: 'Generated Password',
        password: password,
        notes: 'Generated using SentriVault Password Generator'
      });
      if (onSave) onSave(password);
      alert('Password saved to vault successfully!');
    } catch (error) {
      alert('Error saving password to vault');
    }
  };

  React.useEffect(() => {
    generatePassword();
  }, []);

  const strength = getPasswordStrength();

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 max-w-2xl w-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-white flex items-center space-x-2">
          <Zap className="w-6 h-6 text-yellow-400" />
          <span>AI Password Generator</span>
        </h3>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ×
          </button>
        )}
      </div>

      {/* Generated Password Display */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-400 mb-2">Generated Password</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            readOnly
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white font-mono text-lg pr-20"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="p-2 text-gray-400 hover:text-cyan-400 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button
              onClick={copyToClipboard}
              className="p-2 text-gray-400 hover:text-green-400 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
        
        {/* Password Strength */}
        <div className="mt-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-400">Password Strength</span>
            <span className={`text-sm font-medium ${strength.color.replace('bg-', 'text-')}`}>
              {strength.label}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${strength.color}`}
              style={{ width: strength.width }}
            ></div>
          </div>
        </div>
      </div>

      {/* Password Type Toggle */}
      <div className="mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setSettings({...settings, wordBased: false})}
            className={`px-4 py-2 rounded-lg transition-colors ${
              !settings.wordBased 
                ? 'bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 text-black' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Random Characters
          </button>
          <button
            onClick={() => setSettings({...settings, wordBased: true})}
            className={`px-4 py-2 rounded-lg transition-colors ${
              settings.wordBased 
                ? 'bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 text-black' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Word-Based
          </button>
        </div>
      </div>

      {/* Settings */}
      <div className="mb-6 space-y-4">
        <h4 className="text-lg font-semibold text-white flex items-center space-x-2">
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </h4>
        
        {!settings.wordBased ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Length: {settings.length}
              </label>
              <input
                type="range"
                min="8"
                max="64"
                value={settings.length}
                onChange={(e) => setSettings({...settings, length: parseInt(e.target.value)})}
                className="w-full"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.includeUppercase}
                  onChange={(e) => setSettings({...settings, includeUppercase: e.target.checked})}
                  className="rounded"
                />
                <span className="text-white">Uppercase (A-Z)</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.includeLowercase}
                  onChange={(e) => setSettings({...settings, includeLowercase: e.target.checked})}
                  className="rounded"
                />
                <span className="text-white">Lowercase (a-z)</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.includeNumbers}
                  onChange={(e) => setSettings({...settings, includeNumbers: e.target.checked})}
                  className="rounded"
                />
                <span className="text-white">Numbers (0-9)</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.includeSymbols}
                  onChange={(e) => setSettings({...settings, includeSymbols: e.target.checked})}
                  className="rounded"
                />
                <span className="text-white">Symbols (!@#$)</span>
              </label>
            </div>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.excludeSimilar}
                onChange={(e) => setSettings({...settings, excludeSimilar: e.target.checked})}
                className="rounded"
              />
              <span className="text-white">Exclude similar characters (0, O, 1, l, I)</span>
            </label>
          </>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Number of Words: {settings.wordCount}
            </label>
            <input
              type="range"
              min="2"
              max="5"
              value={settings.wordCount}
              onChange={(e) => setSettings({...settings, wordCount: parseInt(e.target.value)})}
              className="w-full"
            />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex space-x-4">
        <button
          onClick={generatePassword}
          className="flex-1 bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 px-6 py-3 rounded-lg font-semibold text-black hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <RefreshCw className="w-5 h-5" />
          <span>Generate New</span>
        </button>
        <button
          onClick={saveToVault}
          disabled={!password}
          className="flex-1 bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save to Vault
        </button>
      </div>
    </div>
  );
};

export default PasswordGenerator;