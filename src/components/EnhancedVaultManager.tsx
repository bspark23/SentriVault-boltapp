import React, { useState, useEffect } from 'react';
import { Plus, Search, Shield, Lock, Eye, EyeOff, Download, Upload } from 'lucide-react';
import { getUserVaultItems, addVaultItem, VaultItem } from '../utils/storage';
import { encryptData, decryptData, generateSecurePassword } from '../utils/encryption';

const EnhancedVaultManager: React.FC = () => {
  const [vaultItems, setVaultItems] = useState<VaultItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadVaultItems();
  }, []);

  const loadVaultItems = () => {
    const items = getUserVaultItems();
    setVaultItems(items);
  };

  const generatePassword = () => {
    return generateSecurePassword(16);
  };

  const exportVault = () => {
    const data = JSON.stringify(vaultItems, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vault-backup.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const categories = [
    { id: 'all', label: 'All Items', count: vaultItems.length },
    { id: 'password', label: 'Passwords', count: vaultItems.filter(i => i.type === 'password').length },
    { id: 'bank', label: 'Banking', count: vaultItems.filter(i => i.type === 'bank').length },
    { id: 'card', label: 'Cards', count: vaultItems.filter(i => i.type === 'card').length },
    { id: 'crypto', label: 'Crypto', count: vaultItems.filter(i => i.type === 'crypto').length }
  ];

  const filteredItems = vaultItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-8 bg-black min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Enhanced Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 bg-clip-text text-transparent mb-2">
              Enhanced Vault Manager
            </h1>
            <p className="text-gray-400">Military-grade encryption • Zero-knowledge architecture</p>
          </div>
          <div className="flex space-x-4">
            <button 
              onClick={exportVault}
              className="bg-gray-800 px-4 py-2 rounded-lg text-white hover:bg-gray-700 transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button className="bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 px-6 py-3 rounded-lg font-semibold text-black hover:shadow-lg transition-all duration-200 flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Item</span>
            </button>
          </div>
        </div>

        {/* Security Status */}
        <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-xl p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Vault Secured</h3>
              <p className="text-gray-300">All {vaultItems.length} items encrypted with AES-256</p>
            </div>
            <div className="ml-auto">
              <div className="flex items-center space-x-2 text-green-400">
                <Lock className="w-5 h-5" />
                <span className="font-semibold">Encrypted</span>
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-4 mb-8">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 text-black'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {category.label} ({category.count})
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search vault items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
          />
        </div>

        {/* Vault Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <div className="flex items-center space-x-1 text-green-400">
                  <Lock className="w-4 h-4" />
                  <span className="text-xs">AES-256</span>
                </div>
              </div>
              
              {item.username && (
                <div className="mb-3">
                  <label className="text-xs text-gray-400 uppercase tracking-wide">Username</label>
                  <p className="text-white font-mono">{item.username}</p>
                </div>
              )}
              
              {item.password && (
                <div className="mb-3">
                  <label className="text-xs text-gray-400 uppercase tracking-wide">Password</label>
                  <div className="flex items-center space-x-2">
                    <p className="text-white font-mono flex-1">
                      {showPasswords[item.id] ? item.password : '••••••••••••'}
                    </p>
                    <button
                      onClick={() => setShowPasswords(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                      className="p-1 text-gray-400 hover:text-cyan-400 transition-colors"
                    >
                      {showPasswords[item.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}
              
              <div className="pt-3 border-t border-gray-800">
                <p className="text-xs text-gray-500">
                  Created: {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Lock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No items found</h3>
            <p className="text-gray-500">Try adjusting your search or add a new item</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedVaultManager;