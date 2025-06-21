import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Shield, Lock, AlertTriangle, HelpCircle, Bot } from 'lucide-react';
import { getCurrentUser, getUserStats } from '../utils/storage';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  category?: string;
}

const SentriBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addBotMessage("👋 Hi! I'm SentriBot, your privacy assistant. I can help you with security tips, explain features, and keep your data safe. What would you like to know?", 'greeting');
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addBotMessage = (text: string, category?: string) => {
    const message: Message = {
      id: Date.now().toString(),
      text,
      isBot: true,
      timestamp: new Date(),
      category
    };
    setMessages(prev => [...prev, message]);
  };

  const addUserMessage = (text: string) => {
    const message: Message = {
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
  };

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    const user = getCurrentUser();
    const stats = getUserStats();

    // Security-related responses
    if (input.includes('password') || input.includes('secure')) {
      if (input.includes('strong') || input.includes('generate')) {
        return "🔐 For strong passwords, use our AI Password Generator! It creates unique passwords with uppercase, lowercase, numbers, and symbols. Avoid reusing passwords across sites. Each account should have its own unique password.";
      }
      if (input.includes('reuse') || input.includes('same')) {
        return "⚠️ Never reuse passwords! If one account gets compromised, all your accounts become vulnerable. Use our Vault Manager to store unique passwords for each service.";
      }
      return "🛡️ Password security tips:\n• Use unique passwords for each account\n• Enable 2FA when possible\n• Use our Password Generator for strong passwords\n• Store them safely in your vault\n• Never share passwords via email or text";
    }

    // Vault-related responses
    if (input.includes('vault') || input.includes('store')) {
      return `📦 Your Vault is your secure digital safe! You currently have ${stats?.totalVaultItems || 0} items stored. You can store passwords, bank details, crypto wallets, and more. Everything is encrypted with AES-256 encryption.`;
    }

    // Privacy-related responses
    if (input.includes('privacy') || input.includes('data')) {
      return "🔒 Your privacy is our priority! We use zero-knowledge architecture - we can't see your data even if we wanted to. Your information is encrypted locally before storage, and you control your own encryption keys.";
    }

    // Blockchain-related responses
    if (input.includes('blockchain') || input.includes('web3')) {
      return "⛓️ SentriVault uses blockchain for verification and immutable records. Your resume verifications and activity logs are stored on-chain for tamper-proof authenticity. This ensures your credentials can't be faked.";
    }

    // Resume verification
    if (input.includes('resume') || input.includes('cv')) {
      return "📄 Our Resume Verifier creates blockchain-backed proof of your credentials. Upload your CV to get a tamper-proof verification that employers can trust. It's stored on IPFS and verified on-chain.";
    }

    // Scam checking
    if (input.includes('scam') || input.includes('phishing') || input.includes('website')) {
      return "🚨 Our Scam Checker analyzes websites for threats using AI and blockchain-verified databases. Always check suspicious links before clicking. Look for HTTPS, verify URLs carefully, and trust your instincts.";
    }

    // Two-factor authentication
    if (input.includes('2fa') || input.includes('two factor') || input.includes('authentication')) {
      return "🔐 Two-Factor Authentication adds an extra security layer. Enable it in Settings > Security. Use apps like Google Authenticator or Authy. Even if someone gets your password, they can't access your account without the second factor.";
    }

    // Biometric login
    if (input.includes('biometric') || input.includes('fingerprint') || input.includes('face')) {
      return "👆 Biometric login uses your fingerprint or face for secure access. It's stored locally on your device and never shared. Enable it in your security settings for quick, secure login.";
    }

    // General security tips
    if (input.includes('tip') || input.includes('advice') || input.includes('secure')) {
      const tips = [
        "🛡️ Enable 2FA on all important accounts",
        "🔄 Regularly update your passwords",
        "📱 Keep your devices updated with latest security patches",
        "🌐 Always verify website URLs before entering credentials",
        "💾 Backup your vault data regularly",
        "🔍 Monitor your accounts for suspicious activity"
      ];
      return tips[Math.floor(Math.random() * tips.length)];
    }

    // Location/IP alerts
    if (input.includes('location') || input.includes('ip') || input.includes('login')) {
      return "🌍 I monitor your login locations for security. If I detect a login from an unusual location, I'll alert you. This helps catch unauthorized access attempts early.";
    }

    // Help with features
    if (input.includes('help') || input.includes('how') || input.includes('use')) {
      return "❓ I can help you with:\n• Password security best practices\n• Using the Vault Manager\n• Understanding blockchain verification\n• Privacy and data protection\n• Security alerts and monitoring\n\nWhat specific feature would you like help with?";
    }

    // Default responses
    const defaultResponses = [
      "🤔 I'm not sure about that specific question, but I'm here to help with security and privacy! Try asking about passwords, vault management, or privacy protection.",
      "💡 That's interesting! I specialize in cybersecurity and privacy. Ask me about protecting your data, managing passwords, or understanding our security features.",
      "🔍 I didn't quite understand that. I'm your privacy assistant - ask me about security tips, vault features, or how to protect your digital life!"
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    addUserMessage(inputText);
    setInputText('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = getBotResponse(inputText);
      addBotMessage(response);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { text: "Password tips", icon: Lock },
    { text: "Privacy policy", icon: Shield },
    { text: "Security alerts", icon: AlertTriangle },
    { text: "How to use vault", icon: HelpCircle }
  ];

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
        >
          {isOpen ? (
            <X className="w-8 h-8 text-black" />
          ) : (
            <div className="relative">
              <Bot className="w-8 h-8 text-black" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          )}
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-gray-900 border border-gray-800 rounded-xl shadow-2xl z-50 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-800 bg-gradient-to-r from-yellow-400/10 via-green-400/10 to-red-400/10 rounded-t-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="text-white font-semibold">SentriBot</h3>
                <p className="text-gray-400 text-sm">Your Privacy Assistant</p>
              </div>
              <div className="ml-auto">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.isBot
                      ? 'bg-gray-800 text-white'
                      : 'bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 text-black'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                  <p className={`text-xs mt-1 ${message.isBot ? 'text-gray-400' : 'text-black/70'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-800 text-white p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 1 && (
            <div className="p-4 border-t border-gray-800">
              <p className="text-gray-400 text-sm mb-3">Quick questions:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        addUserMessage(action.text);
                        setTimeout(() => {
                          const response = getBotResponse(action.text);
                          addBotMessage(response);
                        }, 500);
                      }}
                      className="flex items-center space-x-2 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white text-sm transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{action.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about security..."
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isTyping}
                className="bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 p-2 rounded-lg text-black hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SentriBot;