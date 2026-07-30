import { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import SplashScreen from '../screens/SplashScreen';
import SignupScreen from '../screens/SignupScreen';
import CycleSetupScreen from '../screens/CycleSetupScreen';
import ProtectScreen from '../screens/ProtectScreen';
import CreateCredentialScreen from '../screens/CreateCredentialScreen';
import ConnexionScreen from '../screens/ConnexionScreen';
import LoginScreen from '../screens/LoginScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import SecurityUnlockScreen from '../screens/SecurityUnlockScreen';
import { useAuthStore } from '../store/authStore';
import { getSecurityMethod } from '../services/authService';
import { THEMES, DEFAULT_THEME_KEY } from '../themes/theme';

type SignupStep =
  | 'splash' | 'signup' | 'cycle' | 'protect' | 'credential'
  | 'connexion' | 'login' | 'forgotPassword';

function Loader() {
  const t = THEMES[DEFAULT_THEME_KEY];
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: t.header }}>
      <ActivityIndicator color={t.accent} />
    </View>
  );
}

export default function AuthFlow() {
  const { deviceStatus, securityMethod, setSecurityMethod, unlock } = useAuthStore();
  const [step, setStep] = useState<SignupStep>('splash');
  const [splashDone, setSplashDone] = useState(false);
  const [prefillEmail, setPrefillEmail] = useState('');

  useEffect(() => {
    if (deviceStatus === 'hasAccount' && securityMethod === null) {
      getSecurityMethod().then((m) => setSecurityMethod(m ?? 'none'));
    }
  }, [deviceStatus, securityMethod, setSecurityMethod]);

  useEffect(() => {
    if (deviceStatus === 'hasAccount' && splashDone && securityMethod === 'none') {
      unlock();
    }
  }, [deviceStatus, splashDone, securityMethod, unlock]);

  if (deviceStatus === 'loading') return <Loader />;

  if (deviceStatus === 'hasAccount') {
    if (!splashDone) {
      return <SplashScreen showButtons={false} onSplashDone={() => setSplashDone(true)} onGoSignup={() => {}} onGoLogin={() => {}} />;
    }
    if (securityMethod === null || securityMethod === 'none') return <Loader />;
    return <SecurityUnlockScreen />;
  }

  // deviceStatus === 'noAccount'
  switch (step) {
    case 'splash':
      return (
        <SplashScreen
          showButtons
          onSplashDone={() => {}}
          onGoSignup={() => setStep('signup')}
          onGoLogin={() => setStep('login')}
        />
      );
    case 'signup':
      return <SignupScreen onContinue={() => setStep('cycle')} />;
    case 'cycle':
      return <CycleSetupScreen onContinue={() => setStep('protect')} />;
    case 'protect':
      return (
        <ProtectScreen
          onContinue={(choice) => setStep(choice === 'none' ? 'connexion' : 'credential')}
        />
      );
    case 'credential':
      return <CreateCredentialScreen onContinue={() => setStep('connexion')} />;
    case 'connexion':
      return (
        <ConnexionScreen
          onAlreadyExists={(email) => {
            setPrefillEmail(email);
            setStep('login');
          }}
        />
      );
    case 'login':
      return (
        <LoginScreen
          prefillEmail={prefillEmail}
          onGoSignup={() => setStep('signup')}
          onGoForgotPassword={(email) => {
            setPrefillEmail(email);
            setStep('forgotPassword');
          }}
        />
      );
    case 'forgotPassword':
      return <ForgotPasswordScreen onDone={() => setStep('login')} />;
    default:
      return null;
  }
}