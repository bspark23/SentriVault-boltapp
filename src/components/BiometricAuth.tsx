import React, { useState, useEffect } from 'react';
import { Fingerprint, Eye, Shield, AlertCircle, CheckCircle } from 'lucide-react';

interface BiometricAuthProps {
  onSuccess: () => void;
  onFallback: () => void;
}

const BiometricAuth: React.FC<BiometricAuthProps> = ({ onSuccess, onFallback }) => {
  const [isSupported, setIsSupported] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    checkBiometricSupport();
    checkRegistration();
  }, []);

  const checkBiometricSupport = () => {
    if (window.PublicKeyCredential && 
        typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function') {
      window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
        .then(available => setIsSupported(available))
        .catch(() => setIsSupported(false));
    } else {
      setIsSupported(false);
    }
  };

  const checkRegistration = () => {
    const registration = localStorage.getItem('biometric_registration');
    setIsRegistered(!!registration);
  };

  const registerBiometric = async () => {
    if (!isSupported) return;

    try {
      setIsAuthenticating(true);
      setError('');

      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
        challenge,
        rp: {
          name: "SentriVault",
          id: window.location.hostname,
        },
        user: {
          id: new TextEncoder().encode("user123"),
          name: "user@sentrivault.com",
          displayName: "SentriVault User",
        },
        pubKeyCredParams: [{ alg: -7, type: "public-key" }],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required"
        },
        timeout: 60000,
        attestation: "direct"
      };

      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions
      }) as PublicKeyCredential;

      if (credential) {
        const registrationData = {
          id: credential.id,
          rawId: Array.from(new Uint8Array(credential.rawId)),
          type: credential.type,
          timestamp: Date.now()
        };

        localStorage.setItem('biometric_registration', JSON.stringify(registrationData));
        setIsRegistered(true);
        setError('');
      }
    } catch (err: any) {
      setError(err.message || 'Biometric registration failed');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const authenticateBiometric = async () => {
    if (!isSupported || !isRegistered) return;

    try {
      setIsAuthenticating(true);
      setError('');

      const registration = JSON.parse(localStorage.getItem('biometric_registration') || '{}');
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
        challenge,
        allowCredentials: [{
          id: new Uint8Array(registration.rawId),
          type: 'public-key'
        }],
        timeout: 60000,
        userVerification: "required"
      };

      const assertion = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions
      });

      if (assertion) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Biometric authentication failed');
    } finally {
      setIsAuthenticating(false);
    }
  };

  if (!isSupported) {
    return (
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 text-center">
        <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Biometric Not Supported</h3>
        <p className="text-gray-400 mb-4">Your device doesn't support biometric authentication</p>
        <button
          onClick={onFallback}
          className="bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 px-6 py-3 rounded-lg font-semibold text-black hover:shadow-lg transition-all duration-200"
        >
          Use Wallet Login
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
          {isRegistered ? <CheckCircle className="w-8 h-8 text-black" /> : <Fingerprint className="w-8 h-8 text-black" />}
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          {isRegistered ? 'Biometric Login' : 'Setup Biometric Login'}
        </h3>
        <p className="text-gray-400">
          {isRegistered 
            ? 'Use your fingerprint or face to login securely' 
            : 'Register your biometric for quick and secure access'
          }
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <span className="text-red-400 text-sm">{error}</span>
        </div>
      )}

      <div className="space-y-4">
        {!isRegistered ? (
          <button
            onClick={registerBiometric}
            disabled={isAuthenticating}
            className="w-full bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 px-6 py-3 rounded-lg font-semibold text-black hover:shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {isAuthenticating ? (
              <>
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                <span>Registering...</span>
              </>
            ) : (
              <>
                <Fingerprint className="w-5 h-5" />
                <span>Register Biometric</span>
              </>
            )}
          </button>
        ) : (
          <button
            onClick={authenticateBiometric}
            disabled={isAuthenticating}
            className="w-full bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 px-6 py-3 rounded-lg font-semibold text-black hover:shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {isAuthenticating ? (
              <>
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <Eye className="w-5 h-5" />
                <span>Authenticate</span>
              </>
            )}
          </button>
        )}

        <button
          onClick={onFallback}
          className="w-full bg-gray-800 border border-gray-700 px-6 py-3 rounded-lg font-semibold text-white hover:bg-gray-700 transition-colors"
        >
          Use Wallet Login Instead
        </button>
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          Biometric data is stored locally on your device and never shared
        </p>
      </div>
    </div>
  );
};

export default BiometricAuth;