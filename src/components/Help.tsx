import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  Book, 
  MessageCircle, 
  Mail, 
  Phone, 
  ChevronDown, 
  ChevronRight,
  Shield,
  Lock,
  FileText,
  AlertTriangle
} from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const Help: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const faqs: FAQItem[] = [
    {
      id: '1',
      question: 'How secure is my data in SentriVault?',
      answer: 'Your data is protected with military-grade AES-256 encryption. All sensitive information is encrypted locally on your device before being stored. We use zero-knowledge architecture, meaning we cannot access your data even if we wanted to.',
      category: 'security'
    },
    {
      id: '2',
      question: 'How do I enable two-factor authentication?',
      answer: 'Go to Settings > Security > Two-Factor Authentication. Toggle the switch to enable 2FA, then scan the QR code with your authenticator app (like Google Authenticator or Authy). Enter the verification code to complete setup.',
      category: 'security'
    },
    {
      id: '3',
      question: 'What happens if I forget my master password?',
      answer: 'Due to our zero-knowledge security model, we cannot recover your master password. However, if you have set up recovery options or have an encrypted backup, you can restore your account. Always keep your recovery key in a safe place.',
      category: 'account'
    },
    {
      id: '4',
      question: 'How does the Resume Verifier work?',
      answer: 'The Resume Verifier creates a cryptographic hash of your resume and stores it on the blockchain. This creates an immutable record that can be used to verify the authenticity of your resume at any time. Employers can verify your resume using the provided verification link.',
      category: 'features'
    },
    {
      id: '5',
      question: 'Can I access my vault from multiple devices?',
      answer: 'Yes, your encrypted vault syncs across all your devices. Simply log in with your master password on any device to access your data. Each device must be verified for security.',
      category: 'account'
    },
    {
      id: '6',
      question: 'How does the Scam Website Checker work?',
      answer: 'Our Scam Website Checker uses a combination of blockchain-verified threat intelligence, machine learning algorithms, and community reporting to identify potentially malicious websites. It checks domains against known phishing sites, malware distributors, and suspicious patterns.',
      category: 'features'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Topics', icon: Book },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'account', label: 'Account', icon: Lock },
    { id: 'features', label: 'Features', icon: FileText },
    { id: 'troubleshooting', label: 'Troubleshooting', icon: AlertTriangle }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const openWhatsApp = () => {
    window.open('https://wa.me/2348036630578', '_blank');
  };

  const openEmail = () => {
    window.open('mailto:adaoma2826@gmail.com', '_blank');
  };

  return (
    <div className="p-8 bg-black min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-4">Help Center</h1>
          <p className="text-gray-400 text-lg">
            Find answers to common questions and get support
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for help articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none text-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
              <nav className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                        selectedCategory === category.id
                          ? 'bg-gradient-to-r from-yellow-400/20 via-green-400/20 to-red-400/20 border border-cyan-400/30 text-cyan-400'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{category.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Contact Support */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Need More Help?</h3>
              <div className="space-y-3">
                <button 
                  onClick={openWhatsApp}
                  className="w-full flex items-center space-x-3 px-4 py-3 bg-gray-800 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>WhatsApp Support</span>
                </button>
                <button 
                  onClick={openEmail}
                  className="w-full flex items-center space-x-3 px-4 py-3 bg-gray-800 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  <span>Email Support</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-4 py-3 bg-gray-800 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                  <Phone className="w-5 h-5" />
                  <span>Phone Support</span>
                </button>
              </div>
              <div className="mt-4 p-3 bg-gray-800 rounded-lg">
                <p className="text-xs text-gray-400">
                  WhatsApp: +234 803 663 0578<br />
                  Email: adaoma2826@gmail.com
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="lg:col-span-3">
            <div className="bg-gray-900 rounded-xl border border-gray-800">
              <div className="p-6 border-b border-gray-800">
                <h3 className="text-xl font-semibold text-white">
                  Frequently Asked Questions
                  {filteredFAQs.length > 0 && (
                    <span className="text-gray-400 text-base font-normal ml-2">
                      ({filteredFAQs.length} {filteredFAQs.length === 1 ? 'result' : 'results'})
                    </span>
                  )}
                </h3>
              </div>

              <div className="divide-y divide-gray-800">
                {filteredFAQs.map((faq) => (
                  <div key={faq.id} className="p-6">
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full flex items-center justify-between text-left hover:text-cyan-400 transition-colors"
                    >
                      <h4 className="text-lg font-medium text-white pr-4">{faq.question}</h4>
                      {expandedFAQ === faq.id ? (
                        <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      )}
                    </button>
                    
                    {expandedFAQ === faq.id && (
                      <div className="mt-4 pt-4 border-t border-gray-800">
                        <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                        <div className="mt-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-cyan-400/20 text-cyan-400 border border-cyan-400/30">
                            {faq.category.charAt(0).toUpperCase() + faq.category.slice(1)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {filteredFAQs.length === 0 && (
                <div className="p-12 text-center">
                  <HelpCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">No results found</h3>
                  <p className="text-gray-500">
                    Try adjusting your search terms or browse by category
                  </p>
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h4 className="text-lg font-semibold text-white mb-4">Getting Started</h4>
                <ul className="space-y-3">
                  <li>
                    <a href="/vault" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                      Setting up your vault
                    </a>
                  </li>
                  <li>
                    <a href="/vault" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                      Creating strong passwords
                    </a>
                  </li>
                  <li>
                    <a href="/settings" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                      Enabling two-factor authentication
                    </a>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h4 className="text-lg font-semibold text-white mb-4">Advanced Features</h4>
                <ul className="space-y-3">
                  <li>
                    <a href="/resume" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                      Using the Resume Verifier
                    </a>
                  </li>
                  <li>
                    <a href="/files" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                      File vault and IPFS storage
                    </a>
                  </li>
                  <li>
                    <a href="/privacy" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                      Privacy request tracking
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;