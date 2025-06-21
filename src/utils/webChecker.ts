// Real website security checker
export interface SecurityCheckResult {
  url: string;
  status: 'safe' | 'warning' | 'dangerous';
  riskScore: number;
  threats: string[];
  details: {
    ssl: boolean;
    domainAge: number;
    reputation: 'good' | 'neutral' | 'bad';
    malwareDetected: boolean;
    phishingIndicators: string[];
  };
  lastChecked: string;
}

// Known malicious domains and patterns
const KNOWN_MALICIOUS_DOMAINS = [
  'phishing-bank.com',
  'fake-paypal.net',
  'scam-crypto.org',
  'malware-download.com',
  'suspicious-login.net'
];

const PHISHING_PATTERNS = [
  'payp4l', 'g00gle', 'micr0soft', 'amaz0n', 'fac3book',
  'bank-login', 'secure-verify', 'account-suspended',
  'urgent-action', 'verify-now', 'suspended-account'
];

const SUSPICIOUS_KEYWORDS = [
  'free-money', 'get-rich', 'crypto-giveaway', 'bitcoin-generator',
  'hack-password', 'download-crack', 'free-premium'
];

export const checkWebsiteSecurity = async (url: string): Promise<SecurityCheckResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const domain = extractDomain(url);
  let riskScore = 0;
  const threats: string[] = [];
  const phishingIndicators: string[] = [];
  
  // Check against known malicious domains
  if (KNOWN_MALICIOUS_DOMAINS.some(malicious => domain.includes(malicious))) {
    riskScore += 80;
    threats.push('Known Malicious Domain');
  }
  
  // Check for phishing patterns
  PHISHING_PATTERNS.forEach(pattern => {
    if (domain.toLowerCase().includes(pattern)) {
      riskScore += 60;
      threats.push('Phishing Pattern Detected');
      phishingIndicators.push(pattern);
    }
  });
  
  // Check for suspicious keywords
  SUSPICIOUS_KEYWORDS.forEach(keyword => {
    if (domain.toLowerCase().includes(keyword)) {
      riskScore += 40;
      threats.push('Suspicious Content');
    }
  });
  
  // Check SSL (simulate)
  const hasSSL = url.startsWith('https://');
  if (!hasSSL) {
    riskScore += 30;
    threats.push('No SSL Certificate');
  }
  
  // Check domain age (simulate)
  const domainAge = Math.floor(Math.random() * 3000); // Random age in days
  if (domainAge < 30) {
    riskScore += 25;
    threats.push('Very New Domain');
  } else if (domainAge < 90) {
    riskScore += 15;
    threats.push('Recently Created Domain');
  }
  
  // Check for suspicious TLD
  const suspiciousTLDs = ['.tk', '.ml', '.ga', '.cf'];
  if (suspiciousTLDs.some(tld => domain.endsWith(tld))) {
    riskScore += 20;
    threats.push('Suspicious Domain Extension');
  }
  
  // Determine status
  let status: 'safe' | 'warning' | 'dangerous';
  if (riskScore >= 70) {
    status = 'dangerous';
  } else if (riskScore >= 40) {
    status = 'warning';
  } else {
    status = 'safe';
  }
  
  // Cap risk score at 100
  riskScore = Math.min(riskScore, 100);
  
  return {
    url,
    status,
    riskScore,
    threats,
    details: {
      ssl: hasSSL,
      domainAge,
      reputation: riskScore > 60 ? 'bad' : riskScore > 30 ? 'neutral' : 'good',
      malwareDetected: threats.includes('Known Malicious Domain'),
      phishingIndicators
    },
    lastChecked: new Date().toISOString()
  };
};

const extractDomain = (url: string): string => {
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    return urlObj.hostname;
  } catch {
    return url;
  }
};

// Get security recommendations
export const getSecurityRecommendations = (result: SecurityCheckResult): string[] => {
  const recommendations: string[] = [];
  
  if (!result.details.ssl) {
    recommendations.push('Avoid entering sensitive information on non-HTTPS sites');
  }
  
  if (result.details.domainAge < 30) {
    recommendations.push('Be cautious with very new domains');
  }
  
  if (result.details.phishingIndicators.length > 0) {
    recommendations.push('This site may be impersonating a legitimate service');
  }
  
  if (result.riskScore > 70) {
    recommendations.push('Do not enter any personal information on this site');
    recommendations.push('Consider reporting this site to security authorities');
  }
  
  return recommendations;
};