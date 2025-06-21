import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, EyeOff, Lock, Key, CreditCard, FileText, X, User, Wifi, Server, Bitcoin, Shield } from 'lucide-react';
import { addVaultItem, getUserVaultItems, deleteVaultItem, updateVaultItem, VaultItem, setVaultPin, verifyVaultPin, hasVaultPin } from '../utils/storage';

const VaultManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});
  const [selectedType, setSelectedType] = useState<string>('all');
  const [vaultItems, setVaultItems] = useState<VaultItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(true);
  const [showSetPinModal, setShowSetPinModal] = useState(false);
  const [pin, setPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [editingItem, setEditingItem] = useState<VaultItem | null>(null);

  const [newItem, setNewItem] = useState({
    type: 'password' as VaultItem['type'],
    title: '',
    // Password fields
    username: '',
    password: '',
    url: '',
    // Bank fields
    bankName: '',
    accountNumber: '',
    routingNumber: '',
    accountType: '',
    swiftCode: '',
    // Card fields
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    cardType: '',
    // Identity fields
    fullName: '',
    dateOfBirth: '',
    ssn: '',
    passportNumber: '',
    nationality: '',
    // License fields
    licenseNumber: '',
    licenseType: '',
    issueDate: '',
    expiryDateLicense: '',
    issuingAuthority: '',
    // WiFi fields
    networkName: '',
    wifiPassword: '',
    securityType: '',
    // Server fields
    serverName: '',
    ipAddress: '',
    port: '',
    serverUsername: '',
    serverPassword: '',
    // Crypto fields
    walletName: '',
    walletAddress: '',
    privateKey: '',
    seedPhrase: '',
    cryptoType: '',
    notes: ''
  });

  useEffect(() => {
    checkPinStatus();
  }, []);

  useEffect(() => {
    if (isUnlocked) {
      loadVaultItems();
    }
  }, [isUnlocked]);

  const checkPinStatus = () => {
    if (!hasVaultPin()) {
      setShowSetPinModal(true);
      setShowPinModal(false);
    } else {
      setShowPinModal(true);
      setShowSetPinModal(false);
    }
  };

  const loadVaultItems = () => {
    const items = getUserVaultItems();
    setVaultItems(items);
  };

  const handleSetPin = () => {
    if (newPin.length < 4) {
      alert('PIN must be at least 4 digits');
      return;
    }
    if (newPin !== confirmPin) {
      alert('PINs do not match');
      return;
    }
    
    try {
      setVaultPin(newPin);
      setShowSetPinModal(false);
      setShowPinModal(true);
      setNewPin('');
      setConfirmPin('');
      alert('Vault PIN set successfully!');
    } catch (error) {
      alert('Error setting PIN: ' + (error as Error).message);
    }
  };

  const handlePinSubmit = () => {
    if (verifyVaultPin(pin)) {
      setIsUnlocked(true);
      setShowPinModal(false);
      setPin('');
    } else {
      alert('Incorrect PIN');
    }
  };

  const resetNewItem = () => {
    setNewItem({
      type: 'password',
      title: '',
      username: '',
      password: '',
      url: '',
      bankName: '',
      accountNumber: '',
      routingNumber: '',
      accountType: '',
      swiftCode: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: '',
      cardType: '',
      fullName: '',
      dateOfBirth: '',
      ssn: '',
      passportNumber: '',
      nationality: '',
      licenseNumber: '',
      licenseType: '',
      issueDate: '',
      expiryDateLicense: '',
      issuingAuthority: '',
      networkName: '',
      wifiPassword: '',
      securityType: '',
      serverName: '',
      ipAddress: '',
      port: '',
      serverUsername: '',
      serverPassword: '',
      walletName: '',
      walletAddress: '',
      privateKey: '',
      seedPhrase: '',
      cryptoType: '',
      notes: ''
    });
  };

  const handleAddItem = () => {
    try {
      addVaultItem(newItem);
      resetNewItem();
      setShowAddModal(false);
      loadVaultItems();
    } catch (error) {
      alert('Error adding item: ' + (error as Error).message);
    }
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      deleteVaultItem(id);
      loadVaultItems();
    }
  };

  const handleEditItem = (item: VaultItem) => {
    setEditingItem(item);
    setNewItem({
      type: item.type,
      title: item.title,
      username: item.username || '',
      password: item.password || '',
      url: item.url || '',
      bankName: item.bankName || '',
      accountNumber: item.accountNumber || '',
      routingNumber: item.routingNumber || '',
      accountType: item.accountType || '',
      swiftCode: item.swiftCode || '',
      cardNumber: item.cardNumber || '',
      expiryDate: item.expiryDate || '',
      cvv: item.cvv || '',
      cardholderName: item.cardholderName || '',
      cardType: item.cardType || '',
      fullName: item.fullName || '',
      dateOfBirth: item.dateOfBirth || '',
      ssn: item.ssn || '',
      passportNumber: item.passportNumber || '',
      nationality: item.nationality || '',
      licenseNumber: item.licenseNumber || '',
      licenseType: item.licenseType || '',
      issueDate: item.issueDate || '',
      expiryDateLicense: item.expiryDateLicense || '',
      issuingAuthority: item.issuingAuthority || '',
      networkName: item.networkName || '',
      wifiPassword: item.wifiPassword || '',
      securityType: item.securityType || '',
      serverName: item.serverName || '',
      ipAddress: item.ipAddress || '',
      port: item.port || '',
      serverUsername: item.serverUsername || '',
      serverPassword: item.serverPassword || '',
      walletName: item.walletName || '',
      walletAddress: item.walletAddress || '',
      privateKey: item.privateKey || '',
      seedPhrase: item.seedPhrase || '',
      cryptoType: item.cryptoType || '',
      notes: item.notes || ''
    });
    setShowAddModal(true);
  };

  const handleUpdateItem = () => {
    if (editingItem) {
      updateVaultItem(editingItem.id, newItem);
      setEditingItem(null);
      resetNewItem();
      setShowAddModal(false);
      loadVaultItems();
    }
  };

  const togglePasswordVisibility = (id: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'password': return <Key className="w-5 h-5" />;
      case 'bank': return <CreditCard className="w-5 h-5" />;
      case 'card': return <CreditCard className="w-5 h-5" />;
      case 'note': return <FileText className="w-5 h-5" />;
      case 'key': return <Lock className="w-5 h-5" />;
      case 'identity': return <User className="w-5 h-5" />;
      case 'license': return <FileText className="w-5 h-5" />;
      case 'wifi': return <Wifi className="w-5 h-5" />;
      case 'server': return <Server className="w-5 h-5" />;
      case 'crypto': return <Bitcoin className="w-5 h-5" />;
      default: return <Lock className="w-5 h-5" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'password': return 'Password';
      case 'bank': return 'Bank Account';
      case 'card': return 'Credit Card';
      case 'note': return 'Secure Note';
      case 'key': return 'API Key';
      case 'identity': return 'Identity';
      case 'license': return 'License';
      case 'wifi': return 'WiFi Password';
      case 'server': return 'Server';
      case 'crypto': return 'Crypto Wallet';
      default: return type;
    }
  };

  const filteredItems = vaultItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.username?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || item.type === selectedType;
    return matchesSearch && matchesType;
  });

  const renderItemFields = (item: VaultItem) => {
    const fields = [];
    
    // Common fields for all types
    if (item.username) fields.push({ label: 'Username', value: item.username, type: 'text' });
    if (item.password) fields.push({ label: 'Password', value: item.password, type: 'password' });
    if (item.url) fields.push({ label: 'URL', value: item.url, type: 'url' });
    
    // Bank specific fields
    if (item.bankName) fields.push({ label: 'Bank Name', value: item.bankName, type: 'text' });
    if (item.accountNumber) fields.push({ label: 'Account Number', value: item.accountNumber, type: 'password' });
    if (item.routingNumber) fields.push({ label: 'Routing Number', value: item.routingNumber, type: 'text' });
    if (item.accountType) fields.push({ label: 'Account Type', value: item.accountType, type: 'text' });
    if (item.swiftCode) fields.push({ label: 'SWIFT Code', value: item.swiftCode, type: 'text' });
    
    // Card specific fields
    if (item.cardNumber) fields.push({ label: 'Card Number', value: item.cardNumber, type: 'password' });
    if (item.expiryDate) fields.push({ label: 'Expiry Date', value: item.expiryDate, type: 'text' });
    if (item.cvv) fields.push({ label: 'CVV', value: item.cvv, type: 'password' });
    if (item.cardholderName) fields.push({ label: 'Cardholder Name', value: item.cardholderName, type: 'text' });
    if (item.cardType) fields.push({ label: 'Card Type', value: item.cardType, type: 'text' });
    
    // Identity fields
    if (item.fullName) fields.push({ label: 'Full Name', value: item.fullName, type: 'text' });
    if (item.dateOfBirth) fields.push({ label: 'Date of Birth', value: item.dateOfBirth, type: 'text' });
    if (item.ssn) fields.push({ label: 'SSN', value: item.ssn, type: 'password' });
    if (item.passportNumber) fields.push({ label: 'Passport Number', value: item.passportNumber, type: 'password' });
    if (item.nationality) fields.push({ label: 'Nationality', value: item.nationality, type: 'text' });
    
    // License fields
    if (item.licenseNumber) fields.push({ label: 'License Number', value: item.licenseNumber, type: 'password' });
    if (item.licenseType) fields.push({ label: 'License Type', value: item.licenseType, type: 'text' });
    if (item.issueDate) fields.push({ label: 'Issue Date', value: item.issueDate, type: 'text' });
    if (item.expiryDateLicense) fields.push({ label: 'Expiry Date', value: item.expiryDateLicense, type: 'text' });
    if (item.issuingAuthority) fields.push({ label: 'Issuing Authority', value: item.issuingAuthority, type: 'text' });
    
    // WiFi fields
    if (item.networkName) fields.push({ label: 'Network Name', value: item.networkName, type: 'text' });
    if (item.wifiPassword) fields.push({ label: 'WiFi Password', value: item.wifiPassword, type: 'password' });
    if (item.securityType) fields.push({ label: 'Security Type', value: item.securityType, type: 'text' });
    
    // Server fields
    if (item.serverName) fields.push({ label: 'Server Name', value: item.serverName, type: 'text' });
    if (item.ipAddress) fields.push({ label: 'IP Address', value: item.ipAddress, type: 'text' });
    if (item.port) fields.push({ label: 'Port', value: item.port, type: 'text' });
    if (item.serverUsername) fields.push({ label: 'Username', value: item.serverUsername, type: 'text' });
    if (item.serverPassword) fields.push({ label: 'Password', value: item.serverPassword, type: 'password' });
    
    // Crypto fields
    if (item.walletName) fields.push({ label: 'Wallet Name', value: item.walletName, type: 'text' });
    if (item.walletAddress) fields.push({ label: 'Wallet Address', value: item.walletAddress, type: 'text' });
    if (item.privateKey) fields.push({ label: 'Private Key', value: item.privateKey, type: 'password' });
    if (item.seedPhrase) fields.push({ label: 'Seed Phrase', value: item.seedPhrase, type: 'password' });
    if (item.cryptoType) fields.push({ label: 'Crypto Type', value: item.cryptoType, type: 'text' });
    
    return fields;
  };

  const renderFormFields = () => {
    switch (newItem.type) {
      case 'password':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Username/Email</label>
              <input
                type="text"
                value={newItem.username}
                onChange={(e) => setNewItem({...newItem, username: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                placeholder="username or email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
              <input
                type="password"
                value={newItem.password}
                onChange={(e) => setNewItem({...newItem, password: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                placeholder="password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Website URL</label>
              <input
                type="url"
                value={newItem.url}
                onChange={(e) => setNewItem({...newItem, url: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                placeholder="https://example.com"
              />
            </div>
          </>
        );
      
      case 'bank':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Bank Name</label>
              <input
                type="text"
                value={newItem.bankName}
                onChange={(e) => setNewItem({...newItem, bankName: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                placeholder="e.g., Chase Bank"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Account Number</label>
              <input
                type="text"
                value={newItem.accountNumber}
                onChange={(e) => setNewItem({...newItem, accountNumber: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                placeholder="Account number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Routing Number</label>
              <input
                type="text"
                value={newItem.routingNumber}
                onChange={(e) => setNewItem({...newItem, routingNumber: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                placeholder="Routing number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Account Type</label>
              <select
                value={newItem.accountType}
                onChange={(e) => setNewItem({...newItem, accountType: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
              >
                <option value="">Select account type</option>
                <option value="checking">Checking</option>
                <option value="savings">Savings</option>
                <option value="business">Business</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">SWIFT Code (Optional)</label>
              <input
                type="text"
                value={newItem.swiftCode}
                onChange={(e) => setNewItem({...newItem, swiftCode: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                placeholder="SWIFT/BIC code"
              />
            </div>
          </>
        );
      
      case 'card':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Cardholder Name</label>
              <input
                type="text"
                value={newItem.cardholderName}
                onChange={(e) => setNewItem({...newItem, cardholderName: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                placeholder="Name on card"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Card Number</label>
              <input
                type="text"
                value={newItem.cardNumber}
                onChange={(e) => setNewItem({...newItem, cardNumber: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                placeholder="1234 5678 9012 3456"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Expiry Date</label>
                <input
                  type="text"
                  value={newItem.expiryDate}
                  onChange={(e) => setNewItem({...newItem, expiryDate: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                  placeholder="MM/YY"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">CVV</label>
                <input
                  type="text"
                  value={newItem.cvv}
                  onChange={(e) => setNewItem({...newItem, cvv: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                  placeholder="123"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Card Type</label>
              <select
                value={newItem.cardType}
                onChange={(e) => setNewItem({...newItem, cardType: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
              >
                <option value="">Select card type</option>
                <option value="visa">Visa</option>
                <option value="mastercard">Mastercard</option>
                <option value="amex">American Express</option>
                <option value="discover">Discover</option>
              </select>
            </div>
          </>
        );
      
      case 'identity':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
              <input
                type="text"
                value={newItem.fullName}
                onChange={(e) => setNewItem({...newItem, fullName: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                placeholder="Full legal name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Date of Birth</label>
              <input
                type="date"
                value={newItem.dateOfBirth}
                onChange={(e) => setNewItem({...newItem, dateOfBirth: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">SSN</label>
              <input
                type="text"
                value={newItem.ssn}
                onChange={(e) => setNewItem({...newItem, ssn: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                placeholder="XXX-XX-XXXX"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Passport Number</label>
              <input
                type="text"
                value={newItem.passportNumber}
                onChange={(e) => setNewItem({...newItem, passportNumber: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                placeholder="Passport number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Nationality</label>
              <input
                type="text"
                value={newItem.nationality}
                onChange={(e) => setNewItem({...newItem, nationality: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                placeholder="Nationality"
              />
            </div>
          </>
        );
      
      case 'license':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">License Number</label>
              <input
                type="text"
                value={newItem.licenseNumber}
                onChange={(e) => setNewItem({...newItem, licenseNumber: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                placeholder="License number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">License Type</label>
              <select
                value={newItem.licenseType}
                onChange={(e) => setNewItem({...newItem, licenseType: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
              >
                <option value="">Select license type</option>
                <option value="drivers">Driver's License</option>
                <option value="professional">Professional License</option>
                <option value="business">Business License</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Issue Date</label>
                <input
                  type="date"
                  value={newItem.issueDate}
                  onChange={(e) => setNewItem({...newItem, issueDate: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Expiry Date</label>
                <input
                  type="date"
                  value={newItem.expiryDateLicense}
                  onChange={(e) => setNewItem({...newItem, expiryDateLicense: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Issuing Authority</label>
              <input
                type="text"
                value={newItem.issuingAuthority}
                onChange={(e) => setNewItem({...newItem, issuingAuthority: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                placeholder="e.g., DMV, State Board"
              />
            </div>
          </>
        );
      
      case 'wifi':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Network Name (SSID)</label>
              <input
                type="text"
                value={newItem.networkName}
                onChange={(e) => setNewItem({...newItem, networkName: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                placeholder="WiFi network name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">WiFi Password</label>
              <input
                type="password"
                value={newItem.wifiPassword}
                onChange={(e) => setNewItem({...newItem, wifiPassword: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                placeholder="WiFi password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Security Type</label>
              <select
                value={newItem.securityType}
                onChange={(e) => setNewItem({...newItem, securityType: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
              >
                <option value="">Select security type</option>
                <option value="WPA2">WPA2</option>
                <option value="WPA3">WPA3</option>
                <option value="WEP">WEP</option>
                <option value="Open">Open</option>
              </select>
            </div>
          </>
        );
      
      case 'server':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Server Name</label>
              <input
                type="text"
                value={newItem.serverName}
                onChange={(e) => setNewItem({...newItem, serverName: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                placeholder="Server name or hostname"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">IP Address</label>
                <input
                  type="text"
                  value={newItem.ipAddress}
                  onChange={(e) => setNewItem({...newItem, ipAddress: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                  placeholder="192.168.1.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Port</label>
                <input
                  type="text"
                  value={newItem.port}
                  onChange={(e) => setNewItem({...newItem, port: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                  placeholder="22, 80, 443"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
              <input
                type="text"
                value={newItem.serverUsername}
                onChange={(e) => setNewItem({...newItem, serverUsername: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                placeholder="Server username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
              <input
                type="password"
                value={newItem.serverPassword}
                onChange={(e) => setNewItem({...newItem, serverPassword: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                placeholder="Server password"
              />
            </div>
          </>
        );
      
      case 'crypto':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Wallet Name</label>
              <input
                type="text"
                value={newItem.walletName}
                onChange={(e) => setNewItem({...newItem, walletName: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                placeholder="My Bitcoin Wallet"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Crypto Type</label>
              <select
                value={newItem.cryptoType}
                onChange={(e) => setNewItem({...newItem, cryptoType: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
              >
                <option value="">Select crypto type</option>
                <option value="Bitcoin">Bitcoin</option>
                <option value="Ethereum">Ethereum</option>
                <option value="Litecoin">Litecoin</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Wallet Address</label>
              <input
                type="text"
                value={newItem.walletAddress}
                onChange={(e) => setNewItem({...newItem, walletAddress: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                placeholder="Wallet address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Private Key</label>
              <input
                type="password"
                value={newItem.privateKey}
                onChange={(e) => setNewItem({...newItem, privateKey: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                placeholder="Private key (keep secure)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Seed Phrase</label>
              <textarea
                rows={3}
                value={newItem.seedPhrase}
                onChange={(e) => setNewItem({...newItem, seedPhrase: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-400 focus:outline-none resize-none"
                placeholder="12 or 24 word seed phrase"
              />
            </div>
          </>
        );
      
      case 'key':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">API Key</label>
              <input
                type="password"
                value={newItem.password}
                onChange={(e) => setNewItem({...newItem, password: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                placeholder="API key or secret"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Service URL</label>
              <input
                type="url"
                value={newItem.url}
                onChange={(e) => setNewItem({...newItem, url: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                placeholder="https://api.service.com"
              />
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  // Set PIN Modal
  if (showSetPinModal) {
    return (
      <div className="p-8 bg-black min-h-screen flex items-center justify-center">
        <div className="bg-gray-900 rounded-xl p-8 border border-gray-800 max-w-md w-full">
          <div className="text-center mb-6">
            <Lock className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Set Vault PIN</h2>
            <p className="text-gray-400">Create a secure PIN to protect your vault</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">New PIN</label>
              <input
                type="password"
                placeholder="Enter new PIN (min 4 digits)"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-center text-2xl tracking-widest focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Confirm PIN</label>
              <input
                type="password"
                placeholder="Confirm your PIN"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-center text-2xl tracking-widest focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <button
              onClick={handleSetPin}
              className="w-full bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 px-6 py-3 rounded-lg font-semibold text-black hover:shadow-lg transition-all duration-200"
            >
              Set PIN
            </button>
          </div>
        </div>
      </div>
    );
  }

  // PIN Entry Modal
  if (!isUnlocked) {
    return (
      <div className="p-8 bg-black min-h-screen flex items-center justify-center">
        <div className="bg-gray-900 rounded-xl p-8 border border-gray-800 max-w-md w-full">
          <div className="text-center mb-6">
            <Lock className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Vault Locked</h2>
            <p className="text-gray-400">Enter your PIN to access the vault</p>
          </div>
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Enter your PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-center text-2xl tracking-widest focus:border-cyan-400 focus:outline-none"
            />
            <button
              onClick={handlePinSubmit}
              className="w-full bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 px-6 py-3 rounded-lg font-semibold text-black hover:shadow-lg transition-all duration-200"
            >
              Unlock Vault
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-black min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Vault Manager</h1>
            <p className="text-gray-400">Securely store and manage your sensitive information</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 px-6 py-3 rounded-lg font-semibold text-black hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Item</span>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search vault items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="password">Passwords</option>
            <option value="bank">Bank Accounts</option>
            <option value="card">Credit Cards</option>
            <option value="identity">Identity</option>
            <option value="license">Licenses</option>
            <option value="wifi">WiFi</option>
            <option value="server">Servers</option>
            <option value="crypto">Crypto Wallets</option>
            <option value="key">API Keys</option>
            <option value="note">Secure Notes</option>
          </select>
        </div>

        {/* Vault Items Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 rounded-lg flex items-center justify-center">
                      {getTypeIcon(item.type)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                      <p className="text-sm text-gray-400">{getTypeLabel(item.type)}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEditItem(item)}
                      className="p-2 text-gray-400 hover:text-cyan-400 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {renderItemFields(item).map((field, index) => (
                    <div key={index}>
                      <label className="text-xs text-gray-400 uppercase tracking-wide">{field.label}</label>
                      <div className="flex items-center space-x-2">
                        <p className="text-white font-mono text-sm flex-1">
                          {field.type === 'password' && !showPasswords[item.id] ? '••••••••••••' : 
                           field.type === 'url' ? (
                             <span className="text-cyan-400 hover:underline cursor-pointer">{field.value}</span>
                           ) : field.value}
                        </p>
                        {field.type === 'password' && (
                          <button
                            onClick={() => togglePasswordVisibility(item.id)}
                            className="p-1 text-gray-400 hover:text-cyan-400 transition-colors"
                          >
                            {showPasswords[item.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {item.notes && (
                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-wide">Notes</label>
                      <p className="text-white text-sm">{item.notes}</p>
                    </div>
                  )}

                  <div className="pt-2 border-t border-gray-800">
                    <p className="text-xs text-gray-500">Created: {new Date(item.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Lock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              {vaultItems.length === 0 ? 'Your vault is empty' : 'No items found'}
            </h3>
            <p className="text-gray-500">
              {vaultItems.length === 0 
                ? 'Add your first item to get started' 
                : 'Try adjusting your search or filter criteria'
              }
            </p>
          </div>
        )}

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-xl p-8 border border-gray-800 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-white">
                  {editingItem ? 'Edit Item' : 'Add New Item'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingItem(null);
                    resetNewItem();
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form className="space-y-6" onSubmit={(e) => {
                e.preventDefault();
                editingItem ? handleUpdateItem() : handleAddItem();
              }}>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Type</label>
                  <select
                    value={newItem.type}
                    onChange={(e) => setNewItem({...newItem, type: e.target.value as VaultItem['type']})}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="password">Password</option>
                    <option value="bank">Bank Account</option>
                    <option value="card">Credit Card</option>
                    <option value="identity">Identity</option>
                    <option value="license">License</option>
                    <option value="wifi">WiFi</option>
                    <option value="server">Server</option>
                    <option value="crypto">Crypto Wallet</option>
                    <option value="key">API Key</option>
                    <option value="note">Secure Note</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Title *</label>
                  <input
                    type="text"
                    required
                    value={newItem.title}
                    onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                    placeholder="e.g., Gmail Account, Chase Bank"
                  />
                </div>

                {renderFormFields()}

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Notes</label>
                  <textarea
                    rows={4}
                    value={newItem.notes}
                    onChange={(e) => setNewItem({...newItem, notes: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-400 focus:outline-none resize-none"
                    placeholder="Additional notes..."
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingItem(null);
                      resetNewItem();
                    }}
                    className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 px-6 py-3 rounded-lg font-semibold text-black hover:shadow-lg transition-all duration-200"
                  >
                    {editingItem ? 'Update Item' : 'Add Item'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VaultManager;