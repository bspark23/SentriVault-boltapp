import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Lock, 
  FileText, 
  AlertTriangle, 
  Mail, 
  Bell, 
  Vault,
  CheckCircle,
  ArrowRight,
  Menu,
  X,
  Globe,
  Database,
  Key,
  Eye
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/auth');
  };

  const handleConnectWallet = async () => {
    // Simulate wallet connection
    try {
      if (typeof window.ethereum !== 'undefined') {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        // Simulate successful connection and redirect to dashboard
        navigate('/dashboard');
      } else {
        // If no wallet detected, redirect to auth page for other options
        navigate('/auth');
      }
    } catch (error) {
      console.error('Wallet connection failed:', error);
      // Fallback to auth page
      navigate('/auth');
    }
  };

  const services = [
    {
      icon: Vault,
      title: 'Vault Manager',
      description: 'Securely store passwords, keys, and sensitive data with military-grade encryption.'
    },
    {
      icon: FileText,
      title: 'File Vault',
      description: 'Store files on IPFS with blockchain verification and tamper-proof security.'
    },
    {
      icon: Shield,
      title: 'Resume Verifier',
      description: 'Create blockchain-backed CV verification for authentic professional credentials.'
    },
    {
      icon: AlertTriangle,
      title: 'Scam Website Checker',
      description: 'Verify website safety using blockchain-verified threat intelligence.'
    },
    {
      icon: Mail,
      title: 'Privacy Requests',
      description: 'Track and manage your data privacy requests with blockchain verification.'
    },
    {
      icon: Bell,
      title: 'Security Alerts',
      description: 'Real-time monitoring and alerts for security threats and data breaches.'
    }
  ];

  const features = [
    {
      icon: Database,
      title: 'Decentralized Verification',
      description: 'Blockchain-based verification ensures data integrity and authenticity.'
    },
    {
      icon: FileText,
      title: 'Tamper-proof Request Logs',
      description: 'Immutable records of all privacy requests and security events.'
    },
    {
      icon: Key,
      title: 'Full Data Control',
      description: 'You own and control your data with zero-knowledge architecture.'
    },
    {
      icon: Lock,
      title: 'AES-256 Encryption',
      description: 'Military-grade encryption protects your sensitive information.'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 rounded-lg flex items-center justify-center">
                <Lock className="w-6 h-6 text-black" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 bg-clip-text text-transparent">
                SentriVault
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-300 hover:text-white transition-colors">Home</a>
              <a href="#services" className="text-gray-300 hover:text-white transition-colors">Services</a>
              <a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a>
              <a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</a>
              <button 
                onClick={handleConnectWallet}
                className="bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 px-6 py-2 rounded-lg font-semibold text-black hover:shadow-lg hover:shadow-green-400/25 transition-all duration-200"
              >
                Connect Wallet
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 hover:text-white"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden bg-gray-900 border-t border-gray-800">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a href="#home" className="block px-3 py-2 text-gray-300 hover:text-white">Home</a>
                <a href="#services" className="block px-3 py-2 text-gray-300 hover:text-white">Services</a>
                <a href="#about" className="block px-3 py-2 text-gray-300 hover:text-white">About</a>
                <a href="#contact" className="block px-3 py-2 text-gray-300 hover:text-white">Contact</a>
                <button 
                  onClick={handleConnectWallet}
                  className="w-full mt-2 bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 px-6 py-2 rounded-lg font-semibold text-black"
                >
                  Connect Wallet
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-20 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 rounded-full mb-6 animate-pulse">
                <Shield className="w-10 h-10 text-black" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 bg-clip-text text-transparent">
              Welcome to Sentrivault, We value the privacy of everyone
              </span>
              <br />
              <span className="text-white">Expert</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto">
              Protect your digital life with blockchain-backed privacy and encryption. 
              Enterprise-grade security solutions for individuals and businesses. protect your data
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 px-8 py-4 rounded-lg font-semibold text-black text-lg hover:shadow-lg hover:shadow-green-400/25 transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={handleGetStarted}
                className="border border-gray-600 px-8 py-4 rounded-lg font-semibold text-white hover:border-green-400 hover:text-green-400 transition-all duration-200"
              >
                Watch Demo
              </button>
            </div>
          </div>

          {/* Hero Visual Elements */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-green-400/10 to-red-400/10 rounded-3xl blur-3xl"></div>
            <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Encrypted Storage</h3>
                  <p className="text-gray-400 text-sm">AES-256 encryption protects your data</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Blockchain Verified</h3>
                  <p className="text-gray-400 text-sm">Immutable proof of authenticity</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Zero Knowledge</h3>
                  <p className="text-gray-400 text-sm">We can't see your private data</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 bg-clip-text text-transparent">
                Our Services
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Comprehensive security solutions powered by blockchain technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-green-400/50 hover:shadow-lg hover:shadow-green-400/10 transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer"
                  onClick={handleGetStarted}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                    <Icon className="w-6 h-6 text-black" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-green-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                About <span className="bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 bg-clip-text text-transparent">SentriVault</span>
              </h2>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                SentriVault empowers users to secure their data using encryption, IPFS storage, 
                and smart privacy tools — without complexity. We believe in giving you complete 
                control over your digital identity and sensitive information through cutting-edge 
                blockchain technology.
              </p>
              <button 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 px-6 py-3 rounded-lg font-semibold text-black hover:shadow-lg hover:shadow-green-400/25 transition-all duration-200"
              >
                Learn More
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-green-400/20 to-red-400/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-gray-900 border border-gray-800 rounded-3xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">256-bit</div>
                    <div className="text-gray-400 text-sm">Encryption</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400 mb-2">100%</div>
                    <div className="text-gray-400 text-sm">Private</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-400 mb-2">24/7</div>
                    <div className="text-gray-400 text-sm">Monitoring</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-cyan-400 mb-2">∞</div>
                    <div className="text-gray-400 text-sm">Scalable</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Approach to <span className="bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 bg-clip-text text-transparent">Digital Safety</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Built on principles of privacy, security, and user empowerment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-6 bg-gray-900 border border-gray-800 rounded-xl hover:border-green-400/50 transition-all duration-300 cursor-pointer"
                  onClick={handleGetStarted}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security Guarantee Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 rounded-full mb-6">
              <Shield className="w-12 h-12 text-black" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 bg-clip-text text-transparent">
              Security Guarantee
            </span>
          </h2>
          <p className="text-xl text-gray-400 mb-8 leading-relaxed">
            We guarantee your digital security through encrypted storage and blockchain transparency. 
            Your data is protected by military-grade encryption and verified through immutable blockchain records.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center space-x-2 bg-gray-900 px-4 py-2 rounded-full border border-gray-800">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-white">99.9% Uptime</span>
            </div>
            <div className="flex items-center space-x-2 bg-gray-900 px-4 py-2 rounded-full border border-gray-800">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-white">SOC 2 Compliant</span>
            </div>
            <div className="flex items-center space-x-2 bg-gray-900 px-4 py-2 rounded-full border border-gray-800">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-white">GDPR Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-yellow-400/10 via-green-400/10 to-red-400/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to access <span className="bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 bg-clip-text text-transparent">best-in-breed</span> cyber security?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of users who trust SentriVault to protect their digital lives
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 px-8 py-4 rounded-lg font-semibold text-black text-lg hover:shadow-lg hover:shadow-green-400/25 transition-all duration-200 transform hover:scale-105"
            >
              Start Now
            </button>
            <button 
              onClick={handleGetStarted}
              className="border border-gray-600 px-8 py-4 rounded-lg font-semibold text-white hover:border-green-400 hover:text-green-400 transition-all duration-200"
            >
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 rounded-lg flex items-center justify-center">
                  <Lock className="w-6 h-6 text-black" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 bg-clip-text text-transparent">
                  SentriVault
                </span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Protecting your digital life with blockchain-backed privacy and encryption. 
                Own your data. Guard your privacy.
              </p>
              <p className="text-gray-400">
                Contact: <a href="mailto:hello@sentrivault.com" className="text-green-400 hover:text-green-300">adaoma2826@gmail.com</a>
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#home" className="text-gray-400 hover:text-green-400 transition-colors">Home</a></li>
                <li><a href="#services" className="text-gray-400 hover:text-green-400 transition-colors">Features</a></li>
                <li><a href="#about" className="text-gray-400 hover:text-green-400 transition-colors">About</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-green-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Security</a></li>
                <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Compliance</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              © 2024 SentriVault. All rights reserved. Built with ❤️ for digital privacy.
            </p>
            
            {/* Powered by Bolt Logo */}
            <div className="flex items-center space-x-2">
              <span className="text-gray-500 text-sm">Powered by</span>
              <div className="relative">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-black font-bold text-lg">b</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 rounded-full"></div>
              </div>
              <span className="text-gray-400 text-sm font-medium">Bolt.new</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;