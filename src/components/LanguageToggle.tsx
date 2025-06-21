import React from 'react';
import { Globe } from 'lucide-react';
import { useTranslation } from '../utils/i18n';

const LanguageToggle: React.FC = () => {
  const { language, setLanguage, t } = useTranslation();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' }
  ];

  return (
    <div className="relative group">
      <button className="flex items-center space-x-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-white">
        <Globe className="w-4 h-4" />
        <span className="text-sm">{languages.find(l => l.code === language)?.flag}</span>
        <span className="text-sm">{languages.find(l => l.code === language)?.name}</span>
      </button>
      
      <div className="absolute top-full right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code as 'en' | 'fr')}
            className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-800 transition-colors first:rounded-t-lg last:rounded-b-lg ${
              language === lang.code ? 'bg-gray-800 text-cyan-400' : 'text-white'
            }`}
          >
            <span className="text-lg">{lang.flag}</span>
            <span className="text-sm">{lang.name}</span>
            {language === lang.code && (
              <span className="ml-auto text-cyan-400">✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageToggle;