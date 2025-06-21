import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, Wallet, ArrowLeft, AlertCircle } from 'lucide-react';
import { createUser, authenticateUser } from '../utils/storage';

interface AuthPageProps {
  onLogin: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [authMode, setAuthMode] = useState<'choose' | 'web3' | 'traditional'>('choose');
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  const handleBackToLanding = () => {
    navigate('/landing');
  };

  const handleWeb3Auth = async (walletType: string) => {
    setIsConnecting(true);
    setError('');
    
    try {
      if (walletType === 'metamask') {
        if (typeof window.ethereum !== 'undefined') {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          const walletAddress = accounts[0];
          
          // Check if user exists with this wallet
          const userData = JSON.parse(localStorage.getItem('sentrivault_data') || '{}');
          const existingUser = userData.users?.find((u: any) => u.walletAddress === walletAddress);
          
          if (existingUser) {
            // Login existing user
            localStorage.setItem('sentrivault_current_user', existingUser.id);
            onLogin();
          } else {
            // Create new user with wallet
            const email = `${walletAddress.slice(0, 8)}@wallet.user`;
            const name = `Wallet User ${walletAddress.slice(0, 6)}`;
            const user = createUser(email, name, walletAddress, walletAddress);
            localStorage.setItem('sentrivault_current_user', user.id);
            onLogin();
          }
        } else {
          throw new Error('MetaMask not detected');
        }
      } else {
        // Simulate other wallet connections
        await new Promise(resolve => setTimeout(resolve, 2000));
        const mockAddress = `0x${Math.random().toString(16).substr(2, 40)}`;
        const email = `${mockAddress.slice(0, 8)}@wallet.user`;
        const name = `${walletType} User`;
        const user = createUser(email, name, mockAddress, mockAddress);
        localStorage.setItem('sentrivault_current_user', user.id);
        onLogin();
      }
    } catch (error: any) {
      console.error('Wallet connection failed:', error);
      setError(error.message || 'Wallet connection failed. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleTraditionalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (!isLogin && !formData.name) {
      setError('Please enter your full name');
      return;
    }
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    try {
      if (isLogin) {
        // Login existing user
        const user = authenticateUser(formData.email, formData.password);
        if (user) {
          localStorage.setItem('sentrivault_current_user', user.id);
          onLogin();
        } else {
          setError('Invalid email or password');
        }
      } else {
        // Create new user
        const user = createUser(formData.email, formData.name, formData.password);
        localStorage.setItem('sentrivault_current_user', user.id);
        onLogin();
      }
    } catch (error: any) {
      setError(error.message || 'Authentication failed');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  if (authMode === 'choose') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <button
            onClick={handleBackToLanding}
            className="flex items-center space-x-2 text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>

          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 rounded-full mb-4">
                <Lock className="w-8 h-8 text-black" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Welcome to SentriVault</h1>
              <p className="text-gray-400">Choose your preferred authentication method</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => setAuthMode('web3')}
                className="w-full bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 p-4 rounded-xl text-black font-semibold hover:shadow-lg hover:shadow-green-400/25 transition-all duration-200 flex items-center justify-center space-x-3"
              >
                <Wallet className="w-6 h-6" />
                <span>Connect with Web3 Wallet</span>
              </button>

              <button
                onClick={() => setAuthMode('traditional')}
                className="w-full bg-gray-800 border border-gray-700 p-4 rounded-xl text-white font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center space-x-3"
              >
                <Mail className="w-6 h-6" />
                <span>Continue with Email</span>
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Secure, encrypted, and decentralized authentication
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (authMode === 'web3') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <button
            onClick={() => setAuthMode('choose')}
            className="flex items-center space-x-2 text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 rounded-full mb-4">
                <Wallet className="w-8 h-8 text-black" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h1>
              <p className="text-gray-400">Choose your preferred Web3 wallet to continue</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-400 text-sm">{error}</span>
              </div>
            )}

            {isConnecting ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 border-4 border-gray-700 border-t-green-400 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white">Connecting to wallet...</p>
                <p className="text-gray-400 text-sm mt-2">Please check your wallet for connection request</p>
              </div>
            ) : (
              <div className="space-y-4">
                <button
                  onClick={() => handleWeb3Auth('metamask')}
                  className="w-full bg-gray-800 border border-gray-700 p-4 rounded-xl text-white font-semibold hover:bg-gray-700 transition-colors flex items-center space-x-4"
                >
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">M</span>
                  </div>
                  <span>MetaMask</span>
                </button>

                <button
                  onClick={() => handleWeb3Auth('walletconnect')}
                  className="w-full bg-gray-800 border border-gray-700 p-4 rounded-xl text-white font-semibold hover:bg-gray-700 transition-colors flex items-center space-x-4"
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">W</span>
                  </div>
                  <span>WalletConnect</span>
                </button>

                <button
                  onClick={() => handleWeb3Auth('coinbase')}
                  className="w-full bg-gray-800 border border-gray-700 p-4 rounded-xl text-white font-semibold hover:bg-gray-700 transition-colors flex items-center space-x-4"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">C</span>
                  </div>
                  <span>Coinbase Wallet</span>
                </button>
              </div>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Your wallet will be used to sign transactions and verify your identity
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Traditional Authentication
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <button
          onClick={() => setAuthMode('choose')}
          className="flex items-center space-x-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 rounded-full mb-4">
              <Lock className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-gray-400">
              {isLogin ? 'Sign in to your account' : 'Sign up to get started'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-400 text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleTraditionalSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors"
                  placeholder="Enter your full name"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-400 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors"
                    placeholder="Confirm your password"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 text-black py-3 px-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-green-400/25 transition-all duration-200"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;