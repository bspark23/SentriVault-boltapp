// Real persistent storage utility
import CryptoJS from 'crypto-js';

const STORAGE_KEY = 'sentrivault_data';
const ENCRYPTION_KEY = 'sentrivault_secret_key_2024';

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  walletAddress?: string;
  vaultPin?: string;
  createdAt: string;
  lastLogin: string;
}

export interface VaultItem {
  id: string;
  userId: string;
  type: 'password' | 'bank' | 'card' | 'note' | 'key' | 'identity' | 'license' | 'wifi' | 'server' | 'crypto';
  title: string;
  // Password fields
  username?: string;
  password?: string;
  url?: string;
  // Bank fields
  bankName?: string;
  accountNumber?: string;
  routingNumber?: string;
  accountType?: string;
  swiftCode?: string;
  // Card fields
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardholderName?: string;
  cardType?: string;
  // Identity fields
  fullName?: string;
  dateOfBirth?: string;
  ssn?: string;
  passportNumber?: string;
  nationality?: string;
  // License fields
  licenseNumber?: string;
  licenseType?: string;
  issueDate?: string;
  expiryDateLicense?: string;
  issuingAuthority?: string;
  // WiFi fields
  networkName?: string;
  wifiPassword?: string;
  securityType?: string;
  // Server fields
  serverName?: string;
  ipAddress?: string;
  port?: string;
  serverUsername?: string;
  serverPassword?: string;
  // Crypto fields
  walletName?: string;
  walletAddress?: string;
  privateKey?: string;
  seedPhrase?: string;
  cryptoType?: string;
  // Common fields
  notes?: string;
  createdAt: string;
}

export interface SecurityAlert {
  id: string;
  userId: string;
  type: 'breach' | 'login' | 'password' | 'suspicious';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  location?: string;
  resolved: boolean;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: string;
  location?: string;
  ipAddress?: string;
}

interface AppData {
  users: User[];
  vaultItems: VaultItem[];
  securityAlerts: SecurityAlert[];
  activityLogs: ActivityLog[];
  currentUser: string | null;
}

// Encrypt data before storing
const encryptData = (data: any): string => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
};

// Decrypt data after retrieving
const decryptData = (encryptedData: string): any => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch {
    return null;
  }
};

// Get all app data
export const getAppData = (): AppData => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const defaultData: AppData = {
      users: [],
      vaultItems: [],
      securityAlerts: [],
      activityLogs: [],
      currentUser: null
    };
    saveAppData(defaultData);
    return defaultData;
  }
  
  const decrypted = decryptData(stored);
  return decrypted || {
    users: [],
    vaultItems: [],
    securityAlerts: [],
    activityLogs: [],
    currentUser: null
  };
};

// Save all app data
export const saveAppData = (data: AppData): void => {
  const encrypted = encryptData(data);
  localStorage.setItem(STORAGE_KEY, encrypted);
};

// User management
export const createUser = (email: string, name: string, password: string, walletAddress?: string): User => {
  const data = getAppData();
  
  // Check if user already exists
  const existingUser = data.users.find(u => u.email === email);
  if (existingUser) {
    throw new Error('User with this email already exists');
  }
  
  const user: User = {
    id: Date.now().toString(),
    email,
    name,
    password: CryptoJS.SHA256(password).toString(), // Hash password
    walletAddress,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  };
  
  data.users.push(user);
  data.currentUser = user.id;
  saveAppData(data);
  
  // Add welcome activity
  addActivityLog(user.id, 'account_created', 'Account created successfully');
  
  return user;
};

export const authenticateUser = (email: string, password: string): User | null => {
  const data = getAppData();
  const hashedPassword = CryptoJS.SHA256(password).toString();
  const user = data.users.find(u => u.email === email && u.password === hashedPassword);
  
  if (user) {
    user.lastLogin = new Date().toISOString();
    data.currentUser = user.id;
    saveAppData(data);
    
    // Log login activity
    addActivityLog(user.id, 'login', 'User logged in successfully');
  }
  
  return user || null;
};

export const getCurrentUser = (): User | null => {
  const data = getAppData();
  const currentUserId = localStorage.getItem('sentrivault_current_user') || data.currentUser;
  if (!currentUserId) return null;
  return data.users.find(u => u.id === currentUserId) || null;
};

export const logoutUser = (): void => {
  const data = getAppData();
  const user = getCurrentUser();
  if (user) {
    addActivityLog(user.id, 'logout', 'User logged out');
  }
  data.currentUser = null;
  saveAppData(data);
};

// Vault PIN management
export const setVaultPin = (pin: string): void => {
  const data = getAppData();
  const user = getCurrentUser();
  if (!user) throw new Error('No authenticated user');
  
  const userIndex = data.users.findIndex(u => u.id === user.id);
  if (userIndex > -1) {
    data.users[userIndex].vaultPin = CryptoJS.SHA256(pin).toString();
    saveAppData(data);
    addActivityLog(user.id, 'vault_pin_set', 'Vault PIN has been set');
  }
};

export const verifyVaultPin = (pin: string): boolean => {
  const user = getCurrentUser();
  if (!user || !user.vaultPin) return false;
  
  const hashedPin = CryptoJS.SHA256(pin).toString();
  return user.vaultPin === hashedPin;
};

export const hasVaultPin = (): boolean => {
  const user = getCurrentUser();
  return !!(user && user.vaultPin);
};

// Vault management
export const addVaultItem = (item: Omit<VaultItem, 'id' | 'userId' | 'createdAt'>): VaultItem => {
  const data = getAppData();
  const user = getCurrentUser();
  if (!user) throw new Error('No authenticated user');
  
  const vaultItem: VaultItem = {
    ...item,
    id: Date.now().toString(),
    userId: user.id,
    createdAt: new Date().toISOString()
  };
  
  data.vaultItems.push(vaultItem);
  saveAppData(data);
  
  addActivityLog(user.id, 'vault_add', `Added ${item.type}: ${item.title}`);
  return vaultItem;
};

export const getUserVaultItems = (): VaultItem[] => {
  const data = getAppData();
  const user = getCurrentUser();
  if (!user) return [];
  
  return data.vaultItems.filter(item => item.userId === user.id);
};

export const updateVaultItem = (itemId: string, updates: Partial<VaultItem>): void => {
  const data = getAppData();
  const user = getCurrentUser();
  if (!user) return;
  
  const itemIndex = data.vaultItems.findIndex(item => item.id === itemId && item.userId === user.id);
  if (itemIndex > -1) {
    data.vaultItems[itemIndex] = { ...data.vaultItems[itemIndex], ...updates };
    saveAppData(data);
    addActivityLog(user.id, 'vault_update', `Updated vault item: ${data.vaultItems[itemIndex].title}`);
  }
};

export const deleteVaultItem = (itemId: string): void => {
  const data = getAppData();
  const user = getCurrentUser();
  if (!user) return;
  
  const itemIndex = data.vaultItems.findIndex(item => item.id === itemId && item.userId === user.id);
  if (itemIndex > -1) {
    const item = data.vaultItems[itemIndex];
    data.vaultItems.splice(itemIndex, 1);
    saveAppData(data);
    addActivityLog(user.id, 'vault_delete', `Deleted ${item.type}: ${item.title}`);
  }
};

// Security alerts
export const addSecurityAlert = (alert: Omit<SecurityAlert, 'id' | 'userId' | 'timestamp'>): SecurityAlert => {
  const data = getAppData();
  const user = getCurrentUser();
  if (!user) throw new Error('No authenticated user');
  
  const securityAlert: SecurityAlert = {
    ...alert,
    id: Date.now().toString(),
    userId: user.id,
    timestamp: new Date().toISOString()
  };
  
  data.securityAlerts.push(securityAlert);
  saveAppData(data);
  return securityAlert;
};

export const getUserSecurityAlerts = (): SecurityAlert[] => {
  const data = getAppData();
  const user = getCurrentUser();
  if (!user) return [];
  
  return data.securityAlerts.filter(alert => alert.userId === user.id);
};

export const resolveSecurityAlert = (alertId: string): void => {
  const data = getAppData();
  const user = getCurrentUser();
  if (!user) return;
  
  const alert = data.securityAlerts.find(a => a.id === alertId && a.userId === user.id);
  if (alert) {
    alert.resolved = true;
    saveAppData(data);
    addActivityLog(user.id, 'alert_resolve', `Resolved security alert: ${alert.title}`);
  }
};

// Activity logs
export const addActivityLog = (userId: string, action: string, details: string, location?: string): void => {
  const data = getAppData();
  
  const log: ActivityLog = {
    id: Date.now().toString(),
    userId,
    action,
    details,
    timestamp: new Date().toISOString(),
    location,
    ipAddress: '192.168.1.1' // Simulated IP
  };
  
  data.activityLogs.push(log);
  saveAppData(data);
};

export const getUserActivityLogs = (): ActivityLog[] => {
  const data = getAppData();
  const user = getCurrentUser();
  if (!user) return [];
  
  return data.activityLogs
    .filter(log => log.userId === user.id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// Get user statistics
export const getUserStats = () => {
  const user = getCurrentUser();
  if (!user) return null;
  
  const vaultItems = getUserVaultItems();
  const alerts = getUserSecurityAlerts();
  const activities = getUserActivityLogs();
  
  return {
    totalVaultItems: vaultItems.length,
    unreadAlerts: alerts.filter(a => !a.resolved).length,
    recentActivities: activities.slice(0, 5),
    vaultByType: {
      passwords: vaultItems.filter(i => i.type === 'password').length,
      bank: vaultItems.filter(i => i.type === 'bank').length,
      cards: vaultItems.filter(i => i.type === 'card').length,
      notes: vaultItems.filter(i => i.type === 'note').length,
      keys: vaultItems.filter(i => i.type === 'key').length,
      identity: vaultItems.filter(i => i.type === 'identity').length,
      license: vaultItems.filter(i => i.type === 'license').length,
      wifi: vaultItems.filter(i => i.type === 'wifi').length,
      server: vaultItems.filter(i => i.type === 'server').length,
      crypto: vaultItems.filter(i => i.type === 'crypto').length
    }
  };
};