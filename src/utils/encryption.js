import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = 'sentrivault_master_key_2024_secure';

// AES-256 Encryption
export const encryptData = (data, key = ENCRYPTION_KEY) => {
  try {
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
    return encrypted;
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Failed to encrypt data');
  }
};

// AES-256 Decryption
export const decryptData = (encryptedData, key = ENCRYPTION_KEY) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Failed to decrypt data');
  }
};

// Generate secure password
export const generateSecurePassword = (length = 16, options = {}) => {
  const {
    includeUppercase = true,
    includeLowercase = true,
    includeNumbers = true,
    includeSymbols = true,
    excludeSimilar = true
  } = options;

  let charset = '';
  if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
  if (includeNumbers) charset += '0123456789';
  if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  if (excludeSimilar) {
    charset = charset.replace(/[0O1lI]/g, '');
  }

  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  
  return password;
};

// Generate word-based password
export const generateWordPassword = (wordCount = 3) => {
  const words = [
    'Ocean', 'Mountain', 'River', 'Forest', 'Desert', 'Valley', 'Storm', 'Thunder',
    'Lightning', 'Rainbow', 'Sunset', 'Sunrise', 'Galaxy', 'Planet', 'Star', 'Moon',
    'Phoenix', 'Dragon', 'Eagle', 'Wolf', 'Tiger', 'Lion', 'Bear', 'Falcon',
    'Crystal', 'Diamond', 'Gold', 'Silver', 'Platinum', 'Ruby', 'Emerald', 'Sapphire'
  ];
  
  const separators = ['$', '@', '#', '&', '*', '!', '+', '='];
  const numbers = Math.floor(Math.random() * 999) + 1;
  
  let password = '';
  for (let i = 0; i < wordCount; i++) {
    const word = words[Math.floor(Math.random() * words.length)];
    password += word;
    if (i < wordCount - 1) {
      password += separators[Math.floor(Math.random() * separators.length)];
    }
  }
  password += numbers;
  
  return password;
};

// Hash data
export const hashData = (data) => {
  return CryptoJS.SHA256(JSON.stringify(data)).toString();
};

// Generate random salt
export const generateSalt = () => {
  return CryptoJS.lib.WordArray.random(128/8).toString();
};

// Encrypt file
export const encryptFile = async (file, password) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const fileData = e.target.result;
        const encrypted = CryptoJS.AES.encrypt(fileData, password).toString();
        resolve(encrypted);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Decrypt file
export const decryptFile = (encryptedData, password) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, password);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    throw new Error('Failed to decrypt file');
  }
};

// Validate password strength
export const validatePasswordStrength = (password) => {
  let score = 0;
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /\d/.test(password),
    symbols: /[^A-Za-z0-9]/.test(password)
  };
  
  Object.values(checks).forEach(check => {
    if (check) score += 20;
  });
  
  return {
    score,
    strength: score >= 80 ? 'Strong' : score >= 60 ? 'Medium' : 'Weak',
    checks
  };
};

export default {
  encryptData,
  decryptData,
  generateSecurePassword,
  generateWordPassword,
  hashData,
  generateSalt,
  encryptFile,
  decryptFile,
  validatePasswordStrength
};