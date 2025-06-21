import { useState, useEffect } from 'react';

export type Language = 'en' | 'fr';

interface Translations {
  [key: string]: {
    en: string;
    fr: string;
  };
}

const translations: Translations = {
  // Navigation
  'nav.home': { en: 'Home', fr: 'Accueil' },
  'nav.services': { en: 'Services', fr: 'Services' },
  'nav.about': { en: 'About', fr: 'À propos' },
  'nav.contact': { en: 'Contact', fr: 'Contact' },
  'nav.dashboard': { en: 'Dashboard', fr: 'Tableau de bord' },
  'nav.vault': { en: 'Vault Manager', fr: 'Gestionnaire de coffre' },
  'nav.files': { en: 'File Vault', fr: 'Coffre de fichiers' },
  'nav.resume': { en: 'Resume Verifier', fr: 'Vérificateur de CV' },
  'nav.privacy': { en: 'Privacy Requests', fr: 'Demandes de confidentialité' },
  'nav.scam': { en: 'Scam Checker', fr: 'Détecteur d\'arnaques' },
  'nav.alerts': { en: 'Security Alerts', fr: 'Alertes de sécurité' },
  'nav.map': { en: 'Activity Map', fr: 'Carte d\'activité' },
  'nav.settings': { en: 'Settings', fr: 'Paramètres' },
  'nav.help': { en: 'Help', fr: 'Aide' },

  // Common buttons
  'btn.getStarted': { en: 'Get Started', fr: 'Commencer' },
  'btn.connectWallet': { en: 'Connect Wallet', fr: 'Connecter le portefeuille' },
  'btn.login': { en: 'Login', fr: 'Connexion' },
  'btn.logout': { en: 'Log Out', fr: 'Déconnexion' },
  'btn.save': { en: 'Save', fr: 'Enregistrer' },
  'btn.cancel': { en: 'Cancel', fr: 'Annuler' },
  'btn.delete': { en: 'Delete', fr: 'Supprimer' },
  'btn.edit': { en: 'Edit', fr: 'Modifier' },
  'btn.add': { en: 'Add', fr: 'Ajouter' },
  'btn.generate': { en: 'Generate', fr: 'Générer' },
  'btn.copy': { en: 'Copy', fr: 'Copier' },
  'btn.download': { en: 'Download', fr: 'Télécharger' },
  'btn.upload': { en: 'Upload', fr: 'Téléverser' },
  'btn.verify': { en: 'Verify', fr: 'Vérifier' },
  'btn.check': { en: 'Check', fr: 'Vérifier' },

  // Landing page
  'landing.title': { en: 'Cyber Security Expert', fr: 'Expert en cybersécurité' },
  'landing.subtitle': { en: 'Protect your digital life with blockchain-backed privacy and encryption. Enterprise-grade security solutions for individuals and businesses.', fr: 'Protégez votre vie numérique avec la confidentialité et le chiffrement soutenus par la blockchain. Solutions de sécurité de niveau entreprise pour les particuliers et les entreprises.' },
  'landing.watchDemo': { en: 'Watch Demo', fr: 'Voir la démo' },

  // Dashboard
  'dashboard.welcome': { en: 'Welcome back', fr: 'Bon retour' },
  'dashboard.subtitle': { en: 'Monitor your digital security and privacy', fr: 'Surveillez votre sécurité numérique et votre confidentialité' },
  'dashboard.totalVault': { en: 'Total Vault Items', fr: 'Éléments du coffre total' },
  'dashboard.filesSecured': { en: 'Files Secured', fr: 'Fichiers sécurisés' },
  'dashboard.securityAlerts': { en: 'Security Alerts', fr: 'Alertes de sécurité' },
  'dashboard.activeSessions': { en: 'Active Sessions', fr: 'Sessions actives' },

  // Vault Manager
  'vault.title': { en: 'Vault Manager', fr: 'Gestionnaire de coffre' },
  'vault.subtitle': { en: 'Securely store and manage your sensitive information', fr: 'Stockez et gérez en toute sécurité vos informations sensibles' },
  'vault.addNew': { en: 'Add New Item', fr: 'Ajouter un nouvel élément' },
  'vault.search': { en: 'Search vault items...', fr: 'Rechercher des éléments du coffre...' },
  'vault.allTypes': { en: 'All Types', fr: 'Tous les types' },
  'vault.passwords': { en: 'Passwords', fr: 'Mots de passe' },
  'vault.bankAccounts': { en: 'Bank Accounts', fr: 'Comptes bancaires' },
  'vault.creditCards': { en: 'Credit Cards', fr: 'Cartes de crédit' },
  'vault.identity': { en: 'Identity', fr: 'Identité' },
  'vault.licenses': { en: 'Licenses', fr: 'Licences' },
  'vault.wifi': { en: 'WiFi', fr: 'WiFi' },
  'vault.servers': { en: 'Servers', fr: 'Serveurs' },
  'vault.crypto': { en: 'Crypto Wallets', fr: 'Portefeuilles crypto' },
  'vault.apiKeys': { en: 'API Keys', fr: 'Clés API' },
  'vault.secureNotes': { en: 'Secure Notes', fr: 'Notes sécurisées' },

  // Resume Verifier
  'resume.title': { en: 'Resume Verifier', fr: 'Vérificateur de CV' },
  'resume.subtitle': { en: 'Blockchain-backed CV verification for authentic professional credentials', fr: 'Vérification de CV soutenue par la blockchain pour des références professionnelles authentiques' },
  'resume.upload': { en: 'Upload Your Resume', fr: 'Téléversez votre CV' },
  'resume.uploadDesc': { en: 'Upload your CV to create a tamper-proof blockchain record', fr: 'Téléversez votre CV pour créer un enregistrement blockchain inviolable' },

  // Scam Checker
  'scam.title': { en: 'Scam Website Checker', fr: 'Détecteur de sites d\'arnaque' },
  'scam.subtitle': { en: 'Verify website safety using blockchain-verified threat intelligence', fr: 'Vérifiez la sécurité des sites Web en utilisant l\'intelligence des menaces vérifiée par blockchain' },
  'scam.enterUrl': { en: 'Enter website URL to check', fr: 'Entrez l\'URL du site Web à vérifier' },
  'scam.checkSecurity': { en: 'Check Security', fr: 'Vérifier la sécurité' },

  // Security Alerts
  'alerts.title': { en: 'Security Alerts', fr: 'Alertes de sécurité' },
  'alerts.subtitle': { en: 'Monitor and respond to security threats and breaches', fr: 'Surveillez et répondez aux menaces et violations de sécurité' },
  'alerts.total': { en: 'Total Alerts', fr: 'Alertes totales' },
  'alerts.unresolved': { en: 'Unresolved', fr: 'Non résolues' },
  'alerts.critical': { en: 'Critical', fr: 'Critiques' },
  'alerts.resolved': { en: 'Resolved', fr: 'Résolues' },

  // Privacy Requests
  'privacy.title': { en: 'Privacy Requests', fr: 'Demandes de confidentialité' },
  'privacy.subtitle': { en: 'Track and manage your data privacy requests with blockchain verification', fr: 'Suivez et gérez vos demandes de confidentialité des données avec vérification blockchain' },
  'privacy.newRequest': { en: 'New Request', fr: 'Nouvelle demande' },
  'privacy.totalRequests': { en: 'Total Requests', fr: 'Demandes totales' },
  'privacy.inProgress': { en: 'In Progress', fr: 'En cours' },
  'privacy.completed': { en: 'Completed', fr: 'Terminées' },
  'privacy.verified': { en: 'Verified', fr: 'Vérifiées' },

  // Activity Map
  'map.title': { en: 'Activity Map', fr: 'Carte d\'activité' },
  'map.subtitle': { en: 'Track login locations and security events worldwide', fr: 'Suivez les emplacements de connexion et les événements de sécurité dans le monde entier' },
  'map.globalActivity': { en: 'Global Login Activity', fr: 'Activité de connexion mondiale' },
  'map.recentLogins': { en: 'Recent Login Activity', fr: 'Activité de connexion récente' },

  // Settings
  'settings.title': { en: 'Settings', fr: 'Paramètres' },
  'settings.subtitle': { en: 'Manage your account preferences and security settings', fr: 'Gérez vos préférences de compte et paramètres de sécurité' },
  'settings.profile': { en: 'Profile', fr: 'Profil' },
  'settings.security': { en: 'Security', fr: 'Sécurité' },
  'settings.notifications': { en: 'Notifications', fr: 'Notifications' },
  'settings.appearance': { en: 'Appearance', fr: 'Apparence' },
  'settings.privacy': { en: 'Privacy', fr: 'Confidentialité' },

  // Help
  'help.title': { en: 'Help Center', fr: 'Centre d\'aide' },
  'help.subtitle': { en: 'Find answers to common questions and get support', fr: 'Trouvez des réponses aux questions courantes et obtenez de l\'aide' },
  'help.search': { en: 'Search for help articles...', fr: 'Rechercher des articles d\'aide...' },
  'help.categories': { en: 'Categories', fr: 'Catégories' },
  'help.allTopics': { en: 'All Topics', fr: 'Tous les sujets' },
  'help.troubleshooting': { en: 'Troubleshooting', fr: 'Dépannage' },
  'help.features': { en: 'Features', fr: 'Fonctionnalités' },

  // Authentication
  'auth.welcome': { en: 'Welcome to SentriVault', fr: 'Bienvenue sur SentriVault' },
  'auth.chooseMethod': { en: 'Choose your preferred authentication method', fr: 'Choisissez votre méthode d\'authentification préférée' },
  'auth.web3Wallet': { en: 'Connect with Web3 Wallet', fr: 'Se connecter avec un portefeuille Web3' },
  'auth.email': { en: 'Continue with Email', fr: 'Continuer avec l\'email' },
  'auth.secureAuth': { en: 'Secure, encrypted, and decentralized authentication', fr: 'Authentification sécurisée, chiffrée et décentralisée' },

  // Forms
  'form.email': { en: 'Email Address', fr: 'Adresse e-mail' },
  'form.password': { en: 'Password', fr: 'Mot de passe' },
  'form.confirmPassword': { en: 'Confirm Password', fr: 'Confirmer le mot de passe' },
  'form.fullName': { en: 'Full Name', fr: 'Nom complet' },
  'form.title': { en: 'Title', fr: 'Titre' },
  'form.username': { en: 'Username', fr: 'Nom d\'utilisateur' },
  'form.url': { en: 'Website URL', fr: 'URL du site Web' },
  'form.notes': { en: 'Notes', fr: 'Notes' },

  // Status
  'status.safe': { en: 'Safe', fr: 'Sûr' },
  'status.warning': { en: 'Warning', fr: 'Avertissement' },
  'status.dangerous': { en: 'Dangerous', fr: 'Dangereux' },
  'status.pending': { en: 'Pending', fr: 'En attente' },
  'status.completed': { en: 'Completed', fr: 'Terminé' },
  'status.failed': { en: 'Failed', fr: 'Échoué' },

  // Messages
  'msg.success': { en: 'Success', fr: 'Succès' },
  'msg.error': { en: 'Error', fr: 'Erreur' },
  'msg.loading': { en: 'Loading...', fr: 'Chargement...' },
  'msg.noData': { en: 'No data available', fr: 'Aucune donnée disponible' },
  'msg.confirmDelete': { en: 'Are you sure you want to delete this item?', fr: 'Êtes-vous sûr de vouloir supprimer cet élément ?' },

  // Footer
  'footer.poweredBy': { en: 'Powered by', fr: 'Propulsé par' },
  'footer.allRights': { en: 'All rights reserved. Built with ❤️ for digital privacy.', fr: 'Tous droits réservés. Construit avec ❤️ pour la confidentialité numérique.' },
  'footer.quickLinks': { en: 'Quick Links', fr: 'Liens rapides' },
  'footer.legal': { en: 'Legal', fr: 'Légal' },
  'footer.privacyPolicy': { en: 'Privacy Policy', fr: 'Politique de confidentialité' },
  'footer.termsOfService': { en: 'Terms of Service', fr: 'Conditions d\'utilisation' },
  'footer.security': { en: 'Security', fr: 'Sécurité' },
  'footer.compliance': { en: 'Compliance', fr: 'Conformité' }
};

export const useTranslation = () => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('sentrivault_language');
    return (saved as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('sentrivault_language', lang);
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation[language] || translation.en || key;
  };

  return { language, setLanguage, t };
};

export default useTranslation;